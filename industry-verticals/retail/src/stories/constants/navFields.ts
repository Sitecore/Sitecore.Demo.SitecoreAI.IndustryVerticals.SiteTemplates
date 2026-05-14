import { createPlaceholderImageSrc, createTextField } from '../helpers/createFields';

export const createNavItem = (text: string) => {
  return {
    Id: `${text}-${Date.now()}`,
    Href: '#',
    Querystring: '',
    DisplayName: text,
    Title: createTextField(text),
    NavigationTitle: createTextField(text),
  };
};

export const arrayToObject = <T>(arr: T[]): Record<string, T> =>
  arr.reduce(
    (acc, item, index) => {
      acc[String(index)] = item;
      return acc;
    },
    {} as Record<string, T>
  );

export const navRoot = {
  ...createNavItem('Home'),
  Styles: ['level0', 'submenu', 'item0', 'odd', 'first', 'last', 'active'],
};

export const topLevelPages = [
  {
    ...createNavItem('Furniture'),
    Styles: ['level1', 'item0', 'odd', 'first'],
  },
  {
    ...createNavItem('Decor'),
    Styles: ['level1', 'item1', 'even'],
  },
  {
    ...createNavItem('About us'),
    Styles: ['level1', 'item1', 'even'],
    Children: [
      {
        ...createNavItem('Our story'),
        Styles: ['level2', 'item0', 'odd', 'first'],
        Children: [
          {
            ...createNavItem('History'),
            Styles: ['level3', 'item0', 'odd', 'first'],
            Children: [
              {
                ...createNavItem('Archives'),
                Styles: ['level4', 'item0', 'odd', 'first'],
              },
              {
                ...createNavItem('Timeline'),
                Styles: ['level4', 'item1', 'even', 'last'],
              },
            ],
          },
          {
            ...createNavItem('Mission'),
            Styles: ['level3', 'item1', 'even'],
          },
          {
            ...createNavItem('Press'),
            Styles: ['level3', 'item2', 'odd', 'last'],
          },
        ],
      },
      {
        ...createNavItem('Our team'),
        Styles: ['level2', 'item1', 'even'],
      },
      {
        ...createNavItem('Careers'),
        Styles: ['level2', 'item2', 'odd', 'last'],
      },
    ],
  },
  {
    ...createNavItem('Contact'),
    Styles: ['level1', 'submenu', 'item2', 'odd', 'last'],
  },
];

export const flatTopLevelPages = [
  {
    ...createNavItem('Furniture'),
    Styles: ['level0', 'item0', 'odd', 'first', 'flat-level1'],
  },
  {
    ...createNavItem('Decor'),
    Styles: ['level0', 'item1', 'even', 'flat-level1'],
  },
  {
    ...createNavItem('About us'),
    Styles: ['level0', 'item1', 'even', 'flat-level1'],
  },
  {
    ...createNavItem('Our story'),
    Styles: ['level0', 'item0', 'odd', 'first', 'flat-level2'],
  },
  {
    ...createNavItem('Our team'),
    Styles: ['level0', 'item1', 'even', 'flat-level2'],
  },
  {
    ...createNavItem('Careers'),
    Styles: ['level0', 'item2', 'odd', 'last', 'flat-level2'],
  },

  {
    ...createNavItem('Contact'),
    Styles: ['level0', 'submenu', 'item2', 'odd', 'last', 'flat-level1'],
  },
];

export const getNavigationFields = (options?: { withRoot?: boolean; flat?: boolean }) => {
  const { withRoot = true, flat = false } = options || {};

  const pages = flat ? flatTopLevelPages : topLevelPages;

  if (withRoot) {
    return {
      0: {
        ...navRoot,
        Children: pages,
      },
    };
  }

  return arrayToObject(pages);
};

export const logoParam = `<image mediaid="8cc2a449-e23b-488c-bb23-3d7c7a07f6e7" mediaurl="${createPlaceholderImageSrc(true)}" />`;
