'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { JSX } from 'react';

/**
 * Re-initializes the Salesforce Data Cloud SDK on client-side route changes
 * so that sitemap-driven catalog/pageView events fire without a hard refresh.
 */
const SalesforceDataCloudRouteTracker = (): JSX.Element => {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Skip the initial mount — the SDK already fires on first load
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    if (process.env.NODE_ENV === 'development') return;
    if (!window.SalesforceInteractions || !window.__sfdc_dc_initialized) return;

    window.SalesforceInteractions.reinit()
      .then(() => console.debug('[SalesforceDataCloud] reinit after route change:', pathname))
      .catch((e) => console.debug('[SalesforceDataCloud] reinit failed:', e));
  }, [pathname]);

  return <></>;
};

export default SalesforceDataCloudRouteTracker;
