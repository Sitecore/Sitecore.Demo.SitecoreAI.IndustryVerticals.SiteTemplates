declare module '.sitecore/sites.json' {
  type SiteInfo = {
    name: string;
    hostName: string;
    language: string;
    [key: string]: unknown;
  };

  const sites: SiteInfo[];
  export default sites;
}
