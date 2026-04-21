import Script from 'next/script';
import { JSX } from 'react';

/**
 * Loads and initializes the Salesforce Interactions SDK (Data Cloud Web SDK).
 *
 * Uses next/script with strategy="afterInteractive" to load the CDN script,
 * then calls SalesforceInteractions.init() via the onLoad callback.
 *
 * Disabled in development mode (mirrors CdpPageView.tsx pattern).
 */
const SalesforceDataCloudScript = (): JSX.Element | null => {
  const scriptUrl = process.env.NEXT_PUBLIC_SFDC_INTERACTIONS_SCRIPT_URL;

  if (process.env.NODE_ENV === 'development') {
    return null;
  }

  if (!scriptUrl) {
    return null;
  }

  const handleLoad = () => {
    if (!window.SalesforceInteractions) {
      console.debug('[SalesforceDataCloud] SDK global not found after script load');
      return;
    }

    const cookieDomain = window.location.hostname.replace(/^www\./, '');

    // Note: consents are not passed during init — the Data Cloud module
    // handles consent via the connector configuration on Salesforce's side.
    // If events are blocked, ask Altug for the correct consent provider/purpose name.
    window.SalesforceInteractions.init({
      cookieDomain,
    })
      .then(() => {
        window.__sfdc_dc_initialized = true;
        console.debug('[SalesforceDataCloud] SDK initialized');
      })
      .catch((e) => console.debug('[SalesforceDataCloud] init failed:', e));
  };

  return (
    <Script
      id="salesforce-interactions-sdk"
      src={scriptUrl}
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  );
};

export default SalesforceDataCloudScript;
