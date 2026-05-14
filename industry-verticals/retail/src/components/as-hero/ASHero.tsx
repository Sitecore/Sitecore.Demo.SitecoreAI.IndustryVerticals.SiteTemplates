import {
  Field,
  ImageField,
  LinkField,
  NextImage as ContentSdkImage,
  Text as ContentSdkText,
  Link,
  Placeholder,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';
import { useSitecore } from '@sitecore-content-sdk/nextjs';

const DEFAULT_MAIN_BG = '#1e3a8a';
const DEFAULT_DIAGONAL_OVERLAY_BG = '#003c70';
const DEFAULT_SUBTITLE_COLOR = '#FFD700';
const DEFAULT_TITLE_COLOR = '#FFFFFF';
const DEFAULT_BUTTON_BG = '#FFD700';
const DEFAULT_BUTTON_TEXT = '#000000';

interface Fields {
  Image: ImageField;
  Subtitle: Field<string>;
  Title: Field<string>;
  SearchPlaceholder: Field<string>;
  CtaLink: LinkField;
  ButtonText: Field<string>;
}

export type ASHeroParams = {
  [key: string]: string | undefined;
  RenderingIdentifier?: string;
  styles?: string;
  MainBackgroundColor?: string;
  DiagonalOverlayColor?: string;
  SubtitleColor?: string;
  TitleColor?: string;
  ButtonBackgroundColor?: string;
  ButtonTextColor?: string;
};

export type ASHeroProps = ComponentProps & {
  params: ASHeroParams;
  fields: Fields;
};

const ASHeroCommon = ({
  params,
  fields,
  children,
}: ASHeroProps & { children: React.ReactNode }) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;
  const isPageEditing = page.mode.isEditing;

  if (!fields) {
    return isPageEditing ? (
      <div data-class-change className={`component as-hero ${styles}`} id={id}>
        [AS Hero]
      </div>
    ) : (
      <></>
    );
  }

  return (
    <div
      className={`component as-hero ${styles} relative flex min-h-[320px] flex-col lg:min-h-[420px] lg:flex-row`}
      id={id}
    >
      {children}
    </div>
  );
};

export const Default = ({ params, fields, rendering }: ASHeroProps) => {
  const searchPlaceholder =
    (fields?.SearchPlaceholder?.value as string) ?? 'Search by postcode or location';

  const mainBackgroundColor = params['main-background-color'] || DEFAULT_MAIN_BG;
  const diagonalOverlayColor = params['diagonal-background-color'] || DEFAULT_DIAGONAL_OVERLAY_BG;
  const subtitleColor = params['subtitle-color'] || DEFAULT_SUBTITLE_COLOR;
  const titleColor = params['title-color'] || DEFAULT_TITLE_COLOR;
  const buttonBackgroundColor = params['button-background-color'] || DEFAULT_BUTTON_BG;
  const buttonTextColor = params['button-text-color'] || DEFAULT_BUTTON_TEXT;

  return (
    <ASHeroCommon params={params} fields={fields} rendering={rendering}>
      {/* Left: content area with solid background */}
      <div
        className="relative z-10 flex w-full flex-1 flex-col justify-center px-6 py-10 md:px-8 md:py-12 lg:w-1/2 lg:pr-12 lg:pl-16"
        style={{ backgroundColor: mainBackgroundColor }}
      >
        {/* Subtitle (yellow) */}
        <p className="text-xl font-semibold md:text-2xl" style={{ color: subtitleColor }}>
          <ContentSdkText field={fields.Subtitle} />
        </p>
        {/* Title (white, bold) */}
        <h1
          className="mt-2 text-3xl leading-tight font-bold md:text-4xl xl:text-5xl"
          style={{ color: titleColor }}
        >
          <ContentSdkText field={fields.Title} />
        </h1>

        {/* Input + button as one unit */}
        <div className="mt-6 flex max-w-xl flex-col gap-0 sm:flex-row sm:items-stretch">
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="min-w-0 flex-1 rounded-t-lg border border-gray-300 bg-white px-4 py-3 text-gray-700 placeholder-gray-500 focus:border-gray-400 focus:ring-1 focus:ring-gray-400 focus:outline-none sm:rounded-l-lg sm:rounded-tr-none sm:rounded-br-none"
            readOnly
            disabled
            aria-label={searchPlaceholder}
          />
          <Link
            field={fields.CtaLink}
            className="inline-flex items-center justify-center gap-2 rounded-b-lg px-6 py-3 font-semibold transition-opacity hover:opacity-90 sm:rounded-tl-none sm:rounded-r-lg sm:rounded-bl-none"
            style={{ backgroundColor: buttonBackgroundColor, color: buttonTextColor }}
          >
            <svg
              className="h-5 w-5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <ContentSdkText field={fields.ButtonText} />
          </Link>
        </div>
      </div>

      {/* Right: image with diagonal overlay shapes */}
      <div className="relative z-0 flex w-full flex-1 shrink-0 lg:h-full lg:w-1/2">
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-full">
          {/* Back darker diagonal */}
          <div
            className="pointer-events-none absolute hidden lg:block"
            style={{
              height: '900px',
              width: '400px',
              background: diagonalOverlayColor,
              left: '-270px',
              top: '-250px',
              transform: 'rotate(31deg)',
              borderRadius: '110px',
              zIndex: 2,
              boxShadow: '0 20px 50px 0 rgba(0, 0, 0, .3)',
            }}
            aria-hidden
          />
          {/* Front lighter diagonal */}
          <div
            className="pointer-events-none absolute hidden lg:block"
            style={{
              height: '900px',
              width: '500px',
              background: mainBackgroundColor,
              left: '-270px',
              top: '-20px',
              transform: 'rotate(-27.75deg)',
              borderRadius: '110px',
              zIndex: 3,
              boxShadow: '0 10px 50px 0 rgba(0, 0, 0, .36)',
            }}
            aria-hidden
          />
          <ContentSdkImage
            field={fields.Image}
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>
      </div>
    </ASHeroCommon>
  );
};

export const WithPlaceholder = ({ params, fields, rendering }: ASHeroProps) => {
  const mainBackgroundColor = params['main-background-color'] || DEFAULT_MAIN_BG;
  const diagonalOverlayColor = params['diagonal-background-color'] || DEFAULT_DIAGONAL_OVERLAY_BG;

  const { DynamicPlaceholderId } = params;
  const phKey = `asHeroContainer-${DynamicPlaceholderId}`;

  return (
    <ASHeroCommon params={params} fields={fields} rendering={rendering}>
      {/* Left: content area with solid background */}
      <div
        className="relative z-10 flex w-full flex-1 flex-col justify-center px-6 py-10 md:px-8 md:py-12 lg:w-2/5 lg:pr-10 lg:pl-16"
        style={{ backgroundColor: mainBackgroundColor }}
      >
        <Placeholder name={phKey} rendering={rendering} />
      </div>

      {/* Right: image with diagonal overlay shapes */}
      <div className="relative z-0 flex w-full flex-1 shrink-0 lg:h-full lg:w-3/5">
        <div className="relative aspect-[4/3] w-full overflow-hidden lg:aspect-auto lg:h-full">
          {/* Back darker diagonal */}
          <div
            className="pointer-events-none absolute hidden lg:block"
            style={{
              height: '800px',
              width: '500px',
              background: diagonalOverlayColor,
              left: '-270px',
              top: '-250px',
              transform: 'rotate(31deg)',
              borderRadius: '110px',
              zIndex: 2,
              boxShadow: '0 20px 50px 0 rgba(0, 0, 0, .3)',
            }}
            aria-hidden
          />
          {/* Front lighter diagonal */}
          <div
            className="pointer-events-none absolute hidden lg:block"
            style={{
              height: '800px',
              width: '500px',
              background: mainBackgroundColor,
              left: '-270px',
              top: '-20px',
              transform: 'rotate(-27.75deg)',
              borderRadius: '110px',
              zIndex: 3,
              boxShadow: '0 10px 50px 0 rgba(0, 0, 0, .36)',
            }}
            aria-hidden
          />
          <ContentSdkImage
            field={fields.Image}
            className="h-full w-full object-cover object-center"
            priority
          />
        </div>
      </div>
    </ASHeroCommon>
  );
};
