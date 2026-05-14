import React, { JSX } from 'react';
import {
  NextImage as ContentSdkImage,
  RichText as ContentSdkRichText,
  Field,
  ImageField,
  Link,
  LinkField,
  RichTextField,
  Text,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import clsx from 'clsx';
import AccentLine from '@/assets/icons/accent-line/AccentLine';
import { Quote } from '@/assets/icons/quote/Quote';
import { CommonStyles, LayoutStyles, PromoFlags } from '@/types/styleFlags';

interface Fields {
  PromoImageOne: ImageField;
  PromoImageTwo: ImageField;
  PromoImageThree: ImageField;
  PromoTitle: Field<string>;
  PromoDescription: RichTextField;
  PromoSubTitle: Field<string>;
  PromoMoreInfo: LinkField;
}

type PromoImageGroupProps = Partial<
  Pick<Fields, 'PromoImageOne' | 'PromoImageTwo' | 'PromoImageThree'>
> & {
  withShapes?: boolean;
  withShadows?: boolean;
};

export type PromoProps = ComponentProps & {
  params: { [key: string]: string };
  fields: Fields;
};

const isShadowClassActive = (val: boolean) => (val ? 'shadow-2xl' : '');

export const PromoContent = ({ ...props }) => {
  const isAccentLineVisible = !props?.params?.styles?.includes(CommonStyles.HideAccentLine);

  return (
    <div className="space-y-5">
      <div className="eyebrow">
        <Text field={props.fields.PromoSubTitle} />
      </div>

      <h2 className="inline-block max-w-md">
        <Text field={props.fields.PromoTitle} />
        {isAccentLineVisible && <AccentLine className="w-full max-w-xs" />}
      </h2>

      <div className="max-w-lg text-lg">
        <ContentSdkRichText field={props.fields.PromoDescription} />
      </div>

      <Link field={props.fields.PromoMoreInfo} className="arrow-btn" />
    </div>
  );
};

export const SingleImageContainer = ({
  PromoImageOne,
  withShapes,
  withShadows,
}: PromoImageGroupProps): JSX.Element => {
  const shadowClass = isShadowClassActive(withShadows ?? false);
  return (
    <>
      {withShapes && (
        <div className="bg-background-muted absolute top-0 left-0 z-0 aspect-6/5 w-2/3 rounded-2xl"></div>
      )}
      <div>
        <div className={clsx({ 'm-4 md:m-9 md:mb-6 xl:m-15 xl:mb-8': withShapes })}>
          {withShapes && (
            <div className="bg-background-muted absolute top-1/2 right-0 z-0 aspect-5/3 w-3/4 -translate-y-1/2 transform rounded-2xl"></div>
          )}
          <div
            className={`relative z-10 aspect-4/3 w-full max-w-4xl overflow-hidden rounded-2xl ${shadowClass}`}
          >
            <ContentSdkImage field={PromoImageOne} className="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </>
  );
};

export const MultipleImageContainer = ({
  PromoImageOne,
  PromoImageTwo,
  PromoImageThree,
  withShapes,
  withShadows,
}: PromoImageGroupProps): JSX.Element => {
  const shadowClass = isShadowClassActive(withShadows ?? false);
  const marginClass = withShapes ? 'mr-4' : '';

  return (
    <>
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <div className="flex flex-col gap-10 md:w-1/3">
          <div className="relative aspect-square overflow-visible rounded-2xl">
            <div
              className={`relative z-10 h-full w-full overflow-hidden rounded-2xl ${shadowClass}`}
            >
              <ContentSdkImage field={PromoImageTwo} className="h-full w-full object-cover" />
            </div>
          </div>
          <div className="relative aspect-2/3 overflow-visible rounded-2xl">
            <div
              className={`relative z-10 h-full w-full overflow-hidden rounded-2xl ${shadowClass}`}
            >
              <ContentSdkImage field={PromoImageThree} className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
        <div className="relative w-full md:w-2/3">
          {withShapes && (
            <div className="bg-background-muted absolute right-0 z-0 aspect-[495/422] w-3/4 rounded-2xl md:-top-10 xl:-top-15"></div>
          )}
          <div className={`relative aspect-3/2 overflow-visible rounded-2xl ${marginClass} z-10`}>
            <div
              className={`relative z-10 h-full w-full overflow-hidden rounded-2xl ${shadowClass}`}
            >
              <ContentSdkImage
                field={PromoImageOne}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const isPromoReversed = !props?.params?.styles?.includes(LayoutStyles.Reversed)
    ? ''
    : 'order-last';
  const showSingleImage = !props?.params?.styles?.includes(PromoFlags.ShowMultipleImages);
  const withShapes = !props?.params?.styles?.includes(PromoFlags.HidePromoShapes);
  const withShadows = !props?.params?.styles?.includes(PromoFlags.HidePromoShadows);

  const justifyContentClass = !showSingleImage ? 'justify-self-start' : '';
  const firstColumnSize = showSingleImage ? 'lg:col-span-6' : 'lg:col-span-7';
  const secondColumnSize = showSingleImage ? 'lg:col-span-6' : 'lg:col-span-5';

  return (
    <section className={`${props.params.styles} py-20`} id={id ? id : undefined}>
      <div className="container grid grid-cols-1 place-items-center gap-10 lg:grid-cols-12">
        <div className={`${isPromoReversed} col-span-full ${firstColumnSize} relative w-full`}>
          {showSingleImage ? (
            <SingleImageContainer
              PromoImageOne={props.fields.PromoImageOne}
              withShapes={withShapes}
              withShadows={withShadows}
            />
          ) : (
            <MultipleImageContainer
              PromoImageOne={props.fields.PromoImageOne}
              PromoImageTwo={props.fields.PromoImageTwo}
              PromoImageThree={props.fields.PromoImageThree}
              withShapes={withShapes}
              withShadows={withShadows}
            />
          )}
        </div>

        <div className={`col-span-full ${secondColumnSize} ${justifyContentClass}`}>
          <PromoContent {...props} />
        </div>
      </div>
    </section>
  );
};

export const WithFullImage = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const isPromoReversed = !props?.params?.styles?.includes(LayoutStyles.Reversed)
    ? ' flex-col'
    : 'flex-col-reverse';

  return (
    <section className={`${props.params.styles} py-20`} id={id ? id : undefined}>
      <div className={`container flex ${isPromoReversed}`}>
        <div className="relative my-10 aspect-[1232/608] overflow-hidden rounded-2xl">
          <ContentSdkImage
            field={props.fields.PromoImageTwo}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-5">
          <div className="text-foreground-light font-semibold uppercase">
            <Text field={props.fields.PromoSubTitle} />
          </div>

          <div className="grid-col-1 grid gap-5 md:grid-cols-2">
            <div className="font-bold">
              <h2 className="max-w-md">
                <Text field={props.fields.PromoTitle} />
              </h2>
            </div>

            <div className="flex max-w-md items-center">
              <ContentSdkRichText className="promo-text" field={props.fields.PromoDescription} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const WithQuote = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const withQuote = !props?.params?.styles?.includes(PromoFlags.HidePromoQuotes);
  const isReversed = !props?.params?.styles?.includes(LayoutStyles.Reversed);

  const classesWhenReversed = {
    container: isReversed ? 'container-align-left' : 'container-align-right',
    contentOrder: isReversed ? 'order-1 lg:order-2' : 'order-2 lg:order-1',
    imageTransform: isReversed
      ? '-translate-x-[10%] xl:-translate-x-[20%]'
      : 'translate-x-[10%] xl:translate-x-[15%]',
    quoteFlip: isReversed ? '' : 'lg:-scale-x-100',
  };

  return (
    <section
      className={`relative ${props.params.styles} z-10 overflow-hidden pb-15 xl:pb-[4%]`}
      id={id ? id : undefined}
    >
      {withQuote && (
        <div
          className={`absolute left-5 md:top-[10%] lg:top-[25%] lg:left-1/2 lg:-translate-x-1/2 ${classesWhenReversed.quoteFlip} } text-background-accent! z-20`}
        >
          <Quote className="h-10 md:h-20 lg:h-25 xl:h-30" />
        </div>
      )}
      <div className="bg-background">
        <div className={`${classesWhenReversed.container} `}>
          <div className={`grid grid-cols-1 lg:grid-cols-3 lg:gap-0`}>
            <div
              className={`relative mt-10 flex items-center justify-center lg:col-span-1 ${classesWhenReversed.contentOrder}`}
            >
              <div className="text-foreground! mb-5 max-w-sm">
                <PromoContent {...props} />
              </div>
            </div>

            <div
              className={`relative z-30 order-2 mb-2 aspect-2/1 w-full translate-y-[25%] scale-100 place-self-end lg:order-1 lg:col-span-2 lg:h-3/4 xl:scale-90 ${classesWhenReversed.imageTransform}`}
            >
              <ContentSdkImage
                field={props.fields.PromoImageOne}
                className="absolute inset-0 h-full w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ImageWithBottomTitle = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <section className={`${props.params.styles} py-20`} id={id ? id : undefined}>
      <div className="container flex justify-center">
        <Link
          field={props.fields.PromoMoreInfo}
          className="group relative block aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl"
        >
          <ContentSdkImage
            field={props.fields.PromoImageOne}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4">
            <p className="text-base font-semibold text-white md:text-lg">
              <Text field={props.fields.PromoTitle} />
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
};
