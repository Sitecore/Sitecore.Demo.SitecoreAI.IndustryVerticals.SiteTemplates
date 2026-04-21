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

interface Fields {
  Eyebrow: Field<string>;
  Headline: Field<string>;
  OfferDetails: RichTextField;
  PriceText: Field<string>;
  CtaLink: LinkField;
  OfferImage: ImageField;
}

export type PersonalizeOfferCardProps = ComponentProps & {
  fields: Fields;
};

export const Default = (props: PersonalizeOfferCardProps): JSX.Element => {
  const id = props.params.RenderingIdentifier;
  const { page } = useSitecore();
  const isPageEditing = page.mode.isEditing;

  return (
    <section className={`${props.params.styles || ''} py-10 lg:py-16`} id={id ? id : undefined}>
      <div className="container">
        <div className="mx-auto max-w-md overflow-hidden rounded-lg border shadow transition-shadow hover:shadow-lg">
          {/* Image Section */}
          <div className="relative h-48 w-full">
            <ContentSdkImage
              field={props.fields.OfferImage}
              className="h-full w-full object-cover"
              width={448}
              height={192}
            />
          </div>

          {/* Text Section */}
          <div className="font-body flex flex-col gap-4 p-6">
            {(props.fields.Eyebrow?.value || isPageEditing) && (
              <div className="text-accent text-sm font-semibold tracking-wide uppercase">
                <Text field={props.fields.Eyebrow} />
              </div>
            )}

            <Text field={props.fields.Headline} tag="h3" />

            <div className="text-foreground text-base">
              <ContentSdkRichText field={props.fields.OfferDetails} />
            </div>

            {(props.fields.PriceText?.value || isPageEditing) && (
              <div className="text-accent text-xl font-bold">
                <Text field={props.fields.PriceText} />
              </div>
            )}

            {(props.fields.CtaLink?.value?.href || isPageEditing) && (
              <Link field={props.fields.CtaLink} className="btn-primary" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
