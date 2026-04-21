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
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';
import { LayoutStyles, PromoFlags } from '@/types/styleFlags';

interface Fields {
  PromoImageOne: ImageField;
  PromoTitle: Field<string>;
  PromoDescription: RichTextField;
  PromoSubTitle: Field<string>;
  PromoMoreInfo: LinkField;
}

export type PromoProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const isPromoReversed = props?.params?.styles?.includes(LayoutStyles.Reversed)
    ? 'order-last'
    : '';
  const hideShadow = props?.params?.styles?.includes(PromoFlags.HidePromoShadows);
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  return (
    <section className={`${props.params.styles || ''} py-10 lg:py-16`} id={id ? id : undefined}>
      <div className="container">
        <div
          className={`grid grid-cols-1 overflow-hidden rounded-lg border shadow transition-shadow hover:shadow-lg lg:grid-cols-2 ${hideShadow ? '' : 'shadow hover:shadow-lg'} `}
        >
          {/* Image Section */}
          <div className={`${isPromoReversed} relative h-full w-full`}>
            <ContentSdkImage
              field={props.fields.PromoImageOne}
              className="h-full w-full object-cover"
              width={600}
              height={400}
            />
          </div>

          {/* Text Section */}
          <div className="font-body relative flex flex-col justify-start p-6 py-8 lg:justify-center lg:p-20 lg:py-10">
            <div className="flex w-full flex-col">
              {(props.fields.PromoSubTitle?.value || isPageEditing) && (
                <div className="text-accent w-full text-sm font-semibold tracking-wide uppercase">
                  <Text field={props.fields.PromoSubTitle} className="w-full" />
                </div>
              )}
              <div className="w-full space-y-5">
                <Text field={props.fields.PromoTitle} tag="h3" className="w-full" />

                <div className="text-foreground w-full text-base">
                  <ContentSdkRichText field={props.fields.PromoDescription} />
                </div>

                {(props.fields.PromoMoreInfo?.value?.href || isPageEditing) && (
                  <Link field={props.fields.PromoMoreInfo} className="btn-primary" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const ImageOnly = (props: PromoProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;

  return (
    <section className={`${props.params.styles || ''} py-2`} id={id ? id : undefined}>
      <div className="container">
        <div className="overflow-hidden rounded-lg">
          <ContentSdkImage
            field={props.fields.PromoImageOne}
            className="h-full w-full object-cover"
            width={1200}
            height={675}
          />
        </div>
      </div>
    </section>
  );
};
