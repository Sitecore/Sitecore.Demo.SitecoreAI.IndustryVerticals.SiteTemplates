import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import React, { JSX, useEffect, useRef, useState } from 'react';
import { extractMediaUrl } from '@/helpers/extractMediaUrl';
import { ComponentProps } from 'lib/component-props';

interface AccordionProps extends ComponentProps {
  params: ComponentProps['params'] & {
    BackgroundImage?: string;
    DynamicPlaceholderId: string;
  };
}

const Accordion = ({ params, rendering }: AccordionProps): JSX.Element => {
  const { page } = useSitecore();
  const {
    styles,
    RenderingIdentifier: id,
    BackgroundImage: backgroundImage,
    DynamicPlaceholderId,
  } = params;
  // Keep the same placeholder key pattern as Container so nested renderings resolve.
  const phKey = `container-${DynamicPlaceholderId}`;
  const collapsedHeight = 360;
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const isPageEditing = page.mode.isEditing;

  const mediaUrl = extractMediaUrl(backgroundImage);
  let backgroundStyle: { [key: string]: string } = {};
  if (mediaUrl) {
    backgroundStyle = {
      backgroundImage: `url('${mediaUrl}')`,
    };
  }

  useEffect(() => {
    const element = contentRef.current;
    if (!element) {
      return;
    }

    const checkOverflow = () => {
      setIsOverflowing(element.scrollHeight > collapsedHeight);
    };

    checkOverflow();

    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }

    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(element);
    window.addEventListener('resize', checkOverflow);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkOverflow);
    };
  }, [collapsedHeight, isPageEditing]);

  return (
    <div className={`component accordion-default ${styles}`} id={id}>
      <div className="component-content" style={backgroundStyle}>
        <div
          className={`accordion-content ${isOverflowing && !isExpanded ? 'is-collapsed' : ''}`}
          style={isOverflowing && !isExpanded ? { maxHeight: `${collapsedHeight}px` } : undefined}
          ref={contentRef}
        >
          <div className="row">
            <Placeholder name={phKey} rendering={rendering} />
          </div>
        </div>
        {isOverflowing && (
          <button
            type="button"
            className="accordion-toggle"
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded((previous) => !previous)}
          >
            {isExpanded ? 'SHOW LESS' : 'SHOW MORE'}
            <span aria-hidden>{isExpanded ? '-' : '+'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const Default = (props: AccordionProps): JSX.Element => {
  const styles = props.params?.styles?.split(' ');

  return styles?.includes('container') ? (
    <div className="container-wrapper">
      <Accordion {...props} />
    </div>
  ) : (
    <Accordion {...props} />
  );
};
