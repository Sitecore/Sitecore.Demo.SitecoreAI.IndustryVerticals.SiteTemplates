'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Link, TextField, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { ChevronDown, ChevronRight } from 'lucide-react';
import HamburgerIcon from '@/components/non-sitecore/HamburgerIcon';
import { useClickAway } from '@/hooks/useClickAway';
import { useStopResponsiveTransition } from '@/hooks/useStopResponsiveTransition';
import { extractMediaUrl } from '@/helpers/extractMediaUrl';
import {
  getLinkContent,
  getLinkField,
  isNavLevel,
  isNavRootItem,
  prepareFields,
} from '@/helpers/navHelpers';
import clsx from 'clsx';
import { isParamEnabled } from '@/helpers/isParamEnabled';

export interface NavItemFields {
  Id: string;
  DisplayName: string;
  Title: TextField;
  NavigationTitle: TextField;
  Href: string;
  Querystring: string;
  Children?: Array<NavItemFields>;
  Styles: string[];
}

interface NavigationListItemProps {
  fields: NavItemFields;
  handleClick: (event?: React.MouseEvent<HTMLElement>) => void;
  logoSrc?: string;
  isSimpleLayout?: boolean;
}

export interface NavigationProps extends ComponentProps {
  fields: Record<string, NavItemFields>;
}

/** Follow path of Ids from roots; return null if any segment is missing. */
function findNodeAtPath(roots: NavItemFields[], pathIds: string[]): NavItemFields | null {
  let list = roots;
  let found: NavItemFields | null = null;
  for (const id of pathIds) {
    found = list.find((c) => c.Id === id) ?? null;
    if (!found) return null;
    list = found.Children ?? [];
  }
  return found;
}

/** One column per depth: L2, then L3, L4, … following pathIds while nodes have children. */
function buildColumnsFromPath(roots: NavItemFields[], pathIds: string[]): NavItemFields[][] {
  if (!roots.length) return [];
  const columns: NavItemFields[][] = [roots];
  let list = roots;
  for (let d = 0; d < pathIds.length; d++) {
    const id = pathIds[d];
    const node = list.find((c) => c.Id === id);
    if (!node?.Children?.length) break;
    columns.push(node.Children);
    list = node.Children;
  }
  return columns;
}

const SideOpeningMegaPanel: React.FC<{
  sections: NavItemFields[];
  isOpen: boolean;
  handleLinkClick: (event?: React.MouseEvent<HTMLElement>) => void;
}> = ({ sections, isOpen, handleLinkClick }) => {
  const { page } = useSitecore();
  const firstSectionId = sections[0]?.Id ?? '';
  const [pathIds, setPathIds] = useState<string[]>(() => (firstSectionId ? [firstSectionId] : []));

  useEffect(() => {
    if (isOpen && firstSectionId) {
      setPathIds([firstSectionId]);
    }
  }, [isOpen, firstSectionId]);

  const columns = buildColumnsFromPath(sections, pathIds);
  const focusNode = findNodeAtPath(sections, pathIds) ?? sections[0];

  if (!sections.length || !focusNode) {
    return null;
  }

  const selectAtColumn = (colIndex: number, item: NavItemFields) => {
    setPathIds((prev) => [...prev.slice(0, colIndex), item.Id]);
  };

  return (
    <div className="hidden min-h-[12rem] w-full max-w-[min(96vw,90rem)] min-w-[min(90vw,36rem)] flex-col lg:flex">
      <div className="border-foreground/10 text-foreground/90 flex flex-wrap items-baseline justify-between gap-2 border-b px-5 py-3 text-sm">
        <span className="text-foreground font-medium">{getLinkContent(focusNode)}</span>
        <Link
          field={getLinkField(focusNode)}
          editable={page.mode.isEditing}
          onClick={handleLinkClick}
          className="text-foreground/70 hover:text-foreground whitespace-nowrap underline-offset-4 hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="flex max-h-[min(70vh,28rem)] max-w-full flex-1 overflow-x-auto overflow-y-hidden">
        {columns.map((items, colIndex) => (
          <ul
            key={colIndex}
            className="border-foreground/15 m-0 max-h-[min(70vh,28rem)] w-52 shrink-0 list-none flex-col overflow-x-hidden overflow-y-auto border-r p-3 last:border-r-0"
            role="presentation"
          >
            {items.map((section) => {
              const isSelected = pathIds[colIndex] === section.Id;
              const hasKids = !!section.Children?.length;
              return (
                <li key={section.Id} className="list-none">
                  {hasKids ? (
                    <button
                      type="button"
                      className={clsx(
                        'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-left text-sm transition-colors',
                        isSelected ? 'bg-foreground text-background' : 'hover:bg-foreground/5'
                      )}
                      aria-current={isSelected ? 'true' : undefined}
                      onMouseEnter={() => selectAtColumn(colIndex, section)}
                      onFocus={() => selectAtColumn(colIndex, section)}
                      onClick={() => selectAtColumn(colIndex, section)}
                    >
                      <span className="min-w-0 truncate">{getLinkContent(section)}</span>
                      <ChevronRight className="size-4 shrink-0 opacity-70" aria-hidden />
                    </button>
                  ) : (
                    <Link
                      field={getLinkField(section)}
                      editable={page.mode.isEditing}
                      onClick={handleLinkClick}
                      onMouseEnter={() => selectAtColumn(colIndex, section)}
                      onFocus={() => selectAtColumn(colIndex, section)}
                      className={clsx(
                        'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2.5 text-sm transition-colors',
                        isSelected ? 'bg-foreground/8' : 'hover:bg-foreground/5'
                      )}
                    >
                      <span className="min-w-0 truncate">{getLinkContent(section)}</span>
                      <ChevronRight className="size-4 shrink-0 opacity-50" aria-hidden />
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        ))}
      </div>
    </div>
  );
};

const NavigationListItem: React.FC<NavigationListItemProps> = ({
  fields,
  handleClick,
  logoSrc,
  isSimpleLayout,
}) => {
  const { page } = useSitecore();
  const [isActive, setIsActive] = useState(false);

  const dropdownRef = useRef<HTMLLIElement>(null);
  useClickAway(dropdownRef, () => setIsActive(false));

  const isRootItem = isNavRootItem(fields);
  const isTopLevelPage = isNavLevel(fields, 1);

  const hasChildren = !!fields.Children?.length;
  const isLogoRootItem = isRootItem && logoSrc;
  const hasDropdownMenu = hasChildren && isTopLevelPage;

  const clickHandler = (event: React.MouseEvent<HTMLElement>) => {
    handleClick(event);
    setIsActive(false);
  };

  const children = hasChildren
    ? fields.Children!.map((child) => (
        <NavigationListItem
          key={child.Id}
          fields={child}
          handleClick={clickHandler}
          isSimpleLayout={isSimpleLayout}
          logoSrc={logoSrc}
        />
      ))
    : null;

  const dropdownShellClasses = hasDropdownMenu
    ? clsx(
        'navigation-dropdown-panel z-110 text-base max-lg:border-b max-lg:pb-4 max-lg:text-sm',
        'lg:absolute lg:top-full lg:transition-all lg:duration-300',
        'lg:bg-background lg:rounded-xl lg:shadow-md',
        'lg:left-0 lg:translate-x-0 lg:p-0',
        isActive
          ? 'max-lg:flex max-lg:flex-col'
          : 'max-lg:hidden lg:pointer-events-none lg:translate-y-2 lg:scale-95 lg:opacity-0'
      )
    : undefined;

  return (
    <li
      ref={dropdownRef}
      tabIndex={0}
      role="menuitem"
      className={clsx(
        fields?.Styles?.join(' '),
        'relative flex flex-col gap-x-8 gap-y-4 xl:gap-x-14',
        isRootItem && 'lg:flex-row',
        isLogoRootItem && 'shrink-0 max-lg:hidden',
        isLogoRootItem && isSimpleLayout && 'lg:mr-auto'
      )}
    >
      <div className="flex items-center justify-center gap-1">
        <Link
          field={getLinkField(fields)}
          editable={page.mode.isEditing}
          onClick={clickHandler}
          className="hover:text-foreground-light whitespace-nowrap transition-colors"
        >
          {getLinkContent(fields, logoSrc)}
        </Link>
        {hasDropdownMenu && (
          <button
            type="button"
            aria-label="Toggle submenu"
            aria-haspopup="true"
            aria-expanded={isActive}
            className="flex h-6 w-6 cursor-pointer items-center justify-center"
            onClick={() => setIsActive((a) => !a)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsActive((a) => !a);
              }
            }}
          >
            <ChevronDown
              className={clsx(
                'size-4 transition-transform duration-300',
                isActive && 'rotate-180',
                'navigation-dropdown-trigger'
              )}
            />
          </button>
        )}
      </div>
      {hasChildren && hasDropdownMenu && (
        <div data-navigation-dropdown className={dropdownShellClasses}>
          <ul
            role="menu"
            className="flex flex-col items-center gap-x-8 gap-y-4 max-lg:w-full lg:hidden xl:gap-x-14"
          >
            {children}
          </ul>
          <SideOpeningMegaPanel
            sections={fields.Children!}
            isOpen={isActive}
            handleLinkClick={clickHandler}
          />
        </div>
      )}
      {hasChildren && !hasDropdownMenu && (
        <ul
          role="menu"
          data-navigation-dropdown
          className={clsx(
            'flex flex-col items-center gap-x-8 gap-y-4 xl:gap-x-14',
            isRootItem && 'lg:flex-row',
            hasDropdownMenu && dropdownShellClasses
          )}
        >
          {children}
        </ul>
      )}
    </li>
  );
};

export const Default = ({ params, fields }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id, Logo: logoImage, SimpleLayout: simpleLayout } = params;

  useStopResponsiveTransition();

  if (!Object.values(fields).some((v) => !!v)) {
    return (
      <div className={`component navigation ${styles}`} id={id}>
        <div className="component-content">[Navigation]</div>
      </div>
    );
  }

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, forceState?: boolean) => {
    if (event && page.mode.isEditing) {
      event.preventDefault();
    }
    setIsMenuOpen(forceState ?? !isMenuOpen);
  };

  const isSimpleLayout = isParamEnabled(simpleLayout);
  const preparedFields = prepareFields(fields, !isSimpleLayout);
  const rootItem = Object.values(preparedFields).find((item) => isNavRootItem(item));
  const logoSrc = extractMediaUrl(logoImage);
  const hasLogoRootItem = rootItem && logoSrc;

  const navigationItems = Object.values(preparedFields)
    .filter((item): item is NavItemFields => !!item)
    .map((item) => (
      <NavigationListItem
        key={item.Id}
        fields={item}
        handleClick={(event) => handleToggleMenu(event, false)}
        logoSrc={logoSrc}
        isSimpleLayout={!!isSimpleLayout}
      />
    ));

  return (
    <div className={`component navigation bg-background ${styles}`} id={id}>
      <div
        className={clsx(
          'relative z-150 container flex items-center py-4 lg:hidden',
          !isSimpleLayout &&
            '[.component.header_&]:grid-cols-2 [.component.header_&]:px-0 [.component.header_&]:max-lg:grid',
          !isSimpleLayout ? 'flex-row-reverse' : '',
          isSimpleLayout && !hasLogoRootItem ? 'justify-end' : 'justify-between'
        )}
      >
        {hasLogoRootItem && (
          <Link
            field={getLinkField(rootItem!)}
            editable={page.mode.isEditing}
            className={clsx(
              'navigation-mobile-trigger',
              !isSimpleLayout && '[.component.header_&]:mx-auto'
            )}
          >
            {getLinkContent(rootItem!, logoSrc)}
          </Link>
        )}
        <HamburgerIcon
          isOpen={isMenuOpen}
          onClick={handleToggleMenu}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleMenu();
            }
          }}
          className={clsx(
            'navigation-mobile-trigger',
            !isSimpleLayout && '[.component.header_&]:-order-1'
          )}
        />
      </div>

      <nav
        className={clsx(
          'bg-background z-100 flex duration-300',
          'max-lg:fixed max-lg:inset-0',
          !isMenuOpen && 'max-lg:-translate-y-full max-lg:opacity-0'
        )}
      >
        <ul
          role="menubar"
          className={clsx(
            'container flex flex-col items-center justify-center gap-x-8 gap-y-4 py-6 text-lg lg:flex-row xl:gap-x-16',
            isSimpleLayout && !hasLogoRootItem && 'lg:justify-end'
          )}
        >
          {navigationItems}
        </ul>
      </nav>
    </div>
  );
};
