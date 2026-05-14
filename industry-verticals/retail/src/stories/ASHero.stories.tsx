import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Default as ASHero } from '../components/as-hero/ASHero';
import type { ASHeroProps } from '../components/as-hero/ASHero';
import { CommonParams, CommonRendering } from './common/commonData';
import { createImageField, createLinkField, createTextField } from './helpers/createFields';

const meta = {
  title: 'Page Content/AS Hero',
  component: ASHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    MainBackgroundColor: { control: 'color', name: 'Main background' },
    DiagonalOverlayColor: { control: 'color', name: 'Diagonal overlay (darker blue)' },
    SubtitleColor: { control: 'color', name: 'Subtitle (yellow)' },
    TitleColor: { control: 'color', name: 'Title' },
    ButtonBackgroundColor: { control: 'color', name: 'Button background' },
    ButtonTextColor: { control: 'color', name: 'Button text' },
  },
  args: {
    MainBackgroundColor: '#2A52BE',
    DiagonalOverlayColor: '#1e3a8a',
    SubtitleColor: '#FFD700',
    TitleColor: '#FFFFFF',
    ButtonBackgroundColor: '#FFD700',
    ButtonTextColor: '#000000',
  },
} satisfies Meta<ASHeroProps & Record<string, string>>;

export default meta;

type Story = StoryObj<ASHeroProps & Record<string, string>>;

const baseParams = { ...CommonParams };
const baseRendering = { ...CommonRendering, componentName: 'AS Hero', params: baseParams };

const createASHeroFields = () => ({
  Image: createImageField('placeholder'),
  Subtitle: createTextField('Affordable self storage'),
  Title: createTextField('Get a quote and rent online'),
  SearchPlaceholder: createTextField('Search by postcode or location'),
  CtaLink: createLinkField('Get a quote'),
  ButtonText: createTextField('Get a quote'),
});

export const Default: Story = {
  render: (args) => {
    const params = {
      ...baseParams,
      styles: args.styles,
      MainBackgroundColor: args.MainBackgroundColor,
      DiagonalOverlayColor: args.DiagonalOverlayColor,
      SubtitleColor: args.SubtitleColor,
      TitleColor: args.TitleColor,
      ButtonBackgroundColor: args.ButtonBackgroundColor,
      ButtonTextColor: args.ButtonTextColor,
    };
    const fields = createASHeroFields();
    return <ASHero params={params} rendering={baseRendering} fields={fields} />;
  },
};
