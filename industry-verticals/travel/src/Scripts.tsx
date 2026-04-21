import { EditingScripts } from '@sitecore-content-sdk/nextjs';
// The BYOC bundle imports external (BYOC) components into the app and makes sure they are ready to be used
import BYOC from 'src/byoc';
import FEAASScripts from 'components/content-sdk/FEAASScripts';
import CdpPageView from 'components/content-sdk/CdpPageView';
import SalesforceDataCloudScript from 'components/salesforce-dc/SalesforceDataCloudScript';
import SalesforceDataCloudRouteTracker from 'components/salesforce-dc/SalesforceDataCloudRouteTracker';
import { JSX } from 'react';

const Scripts = (): JSX.Element => {
  return (
    <>
      <BYOC />
      <FEAASScripts />
      <CdpPageView />
      <SalesforceDataCloudScript />
      <SalesforceDataCloudRouteTracker />
      <EditingScripts />
    </>
  );
};

export default Scripts;
