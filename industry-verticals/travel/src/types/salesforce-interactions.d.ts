/**
 * Type declarations for the Salesforce Interactions SDK (Data Cloud Web SDK).
 * The global SalesforceInteractions object is attached to window by the CDN script:
 *   https://cdn.c360a.salesforce.com/beacon/c360a/{tenant-id}/scripts/c360a.min.js
 */

interface SalesforceInteractionsConsent {
  provider: string;
  status: 'OptIn' | 'OptOut';
}

interface SalesforceInteractionsInitConfig {
  consents?: SalesforceInteractionsConsent[];
  cookieDomain?: string;
}

interface SalesforceInteractionsInteraction {
  name: string;
  [key: string]: unknown;
}

interface SalesforceInteractionsUser {
  identities?: Record<string, string>;
  attributes?: Record<string, unknown>;
  eventType?: string;
}

interface SalesforceInteractionsSendEventPayload {
  interaction: SalesforceInteractionsInteraction;
  user?: SalesforceInteractionsUser;
}

interface SalesforceInteractionsLog {
  setLoggingLevel(level: number): void;
  getLoggingLevel(): number;
}

interface SalesforceInteractionsSDK {
  init(config?: SalesforceInteractionsInitConfig): Promise<void>;
  reinit(): Promise<void>;
  sendEvent(payload: SalesforceInteractionsSendEventPayload): Promise<void>;
  updateConsents(consents: SalesforceInteractionsConsent[]): void;
  getAnonymousId(): string | undefined;
  log: SalesforceInteractionsLog;
}

declare global {
  interface Window {
    SalesforceInteractions?: SalesforceInteractionsSDK;
    __sfdc_dc_initialized?: boolean;
  }
  // eslint-disable-next-line no-var
  var SalesforceInteractions: SalesforceInteractionsSDK | undefined;
}

export {};
