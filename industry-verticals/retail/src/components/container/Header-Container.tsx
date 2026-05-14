import { ImageField, Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import React, { JSX } from 'react';
import { extractMediaUrl } from '@/helpers/extractMediaUrl';
import { ComponentProps } from 'lib/component-props';

interface HeaderContainerProps extends ComponentProps {
  params: ComponentProps['params'] & {
    BackgroundImage?: string;
    DynamicPlaceholderId: string;
  };
}

const HeaderContainer = ({ params, rendering }: HeaderContainerProps): JSX.Element => {
  const { page } = useSitecore();
  const {
    styles,
    RenderingIdentifier: id,
    BackgroundImage: backgroundImage,
    DynamicPlaceholderId,
  } = params;
  const phKey = `container-${DynamicPlaceholderId}`;

  const pageImageField = page.layout.sitecore.route?.fields?.Image as ImageField | undefined;
  const mediaUrl = extractMediaUrl(backgroundImage) || pageImageField?.value?.src;
  let backgroundStyle: { [key: string]: string } = {};
  if (mediaUrl) {
    backgroundStyle = {
      backgroundImage: `url('${mediaUrl}')`,
    };
  }

  return (
    <div className={`component container-default ${styles}`} id={id}>
      <div className="component-content" style={backgroundStyle}>
        <div className="row">
          <Placeholder name={phKey} rendering={rendering} />
        </div>
      </div>
    </div>
  );
};

export const Default = (props: HeaderContainerProps): JSX.Element => {
  const styles = props.params?.styles?.split(' ');

  return styles?.includes('container') ? (
    <div className="container-wrapper">
      <HeaderContainer {...props} />
    </div>
  ) : (
    <HeaderContainer {...props} />
  );
};
