import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { Default as Navigation } from '../components/navigation/Navigation';
import { ComponentProps } from 'react';
import { CommonParams, CommonRendering } from './common/commonData';
import { getNavigationFields, logoParam } from './constants/navFields';
import { boolToSitecoreCheckbox } from './helpers/boolToSitecoreCheckbox';

type StoryProps = ComponentProps<typeof Navigation> & {
  withRoot?: boolean;
  isFlat?: boolean;
  hasLogo?: boolean;
  isSimpleLayout?: boolean;
};

const meta = {
  title: 'Navigation/Navigation',
  component: Navigation,
  tags: ['autodocs'],
  play: async ({ canvasElement, userEvent, args, step }) => {
    await step('Logo rendering', async () => {
      const logoImg = canvasElement.querySelector('[role="menuitem"] img');
      if (args.hasLogo && args.withRoot) {
        expect(logoImg).toBeInTheDocument();
      } else {
        expect(logoImg).not.toBeInTheDocument();
      }
    });

    await step('Root item logic', async () => {
      const navItems = Array.from(canvasElement.querySelectorAll('li'));

      const hasRootItem = navItems.some(
        (link) =>
          link.classList.contains('level0') &&
          !Array.from(link.classList).some((cls) => cls.startsWith('flat-level'))
      );

      if (args.withRoot) {
        expect(hasRootItem).toBe(true);
      } else {
        expect(hasRootItem).toBe(false);
      }
    });

    await step('Hamburger menu', async () => {
      const hamburger = canvasElement.querySelector('.navigation-mobile-trigger');
      expect(hamburger).toBeInTheDocument();
      if (hamburger) {
        await userEvent.click(hamburger);
        expect(hamburger?.getAttribute('aria-expanded')).toBe('true');
        await userEvent.click(hamburger);
        expect(hamburger?.getAttribute('aria-expanded')).toBe('false');
      }
    });

    await step('Dropdown menu', async () => {
      const chevron = canvasElement.querySelector('.navigation-dropdown-trigger');
      if (chevron) {
        await userEvent.click(chevron);
        const dropdown = chevron.closest('li')?.querySelector('[data-navigation-dropdown]');
        expect(dropdown).toBeInTheDocument();

        await waitFor(() => {
          expect(dropdown).toBeVisible();
        });

        const outside = canvasElement.querySelector('.component.navigation');
        if (outside) {
          await userEvent.click(outside);
          await waitFor(() => {
            expect(dropdown).not.toBeVisible();
          });
        }
      }
    });
  },
  argTypes: {
    withRoot: {
      name: 'Include root page',
      control: 'boolean',
      defaultValue: true,
    },
    isFlat: {
      name: 'Flat structure',
      description: 'all items displayed on the same level',
      control: 'boolean',
      defaultValue: false,
    },
    isSimpleLayout: {
      name: 'Simple Layout',
      description: 'left aligned logo, right aligned menu items',
      control: 'boolean',
      defaultValue: false,
    },
    hasLogo: {
      name: 'Show Logo',
      control: 'boolean',
      defaultValue: true,
    },
  },
  args: {
    withRoot: true,
    isFlat: false,
    hasLogo: true,
    isSimpleLayout: false,
  },
} satisfies Meta<StoryProps>;
export default meta;

type Story = StoryObj<StoryProps>;

const baseParams = {
  ...CommonParams,
};

const baseRendering = {
  ...CommonRendering,
  componentName: 'Navigation',
  params: baseParams,
};

export const Default: Story = {
  render: (args) => {
    const params = {
      ...baseParams,
      ...(args.hasLogo ? { Logo: logoParam } : {}),
      SimpleLayout: boolToSitecoreCheckbox(args.isSimpleLayout),
    };
    const fields = getNavigationFields({ withRoot: args.withRoot, flat: args.isFlat });
    return <Navigation params={params} rendering={baseRendering} fields={fields} />;
  },
};

export const Simple: Story = {
  args: {
    withRoot: true,
    isFlat: false,
    hasLogo: true,
    isSimpleLayout: true,
  },
  render: (args) => {
    const params = {
      ...baseParams,
      ...(args.hasLogo ? { Logo: logoParam } : {}),
      SimpleLayout: boolToSitecoreCheckbox(args.isSimpleLayout),
    };
    const fields = getNavigationFields({ withRoot: args.withRoot, flat: args.isFlat });
    return <Navigation params={params} rendering={baseRendering} fields={fields} />;
  },
};
