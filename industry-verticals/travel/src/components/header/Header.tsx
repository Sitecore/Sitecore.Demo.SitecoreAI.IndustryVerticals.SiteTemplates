'use client';

import React, { JSX, useEffect, useState } from 'react';
import { ComponentProps } from '@/lib/component-props';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { Drawer, DrawerTrigger, DrawerContent, DrawerClose } from '@/shadcn/components/ui/drawer';
import { Menu, Search, X } from 'lucide-react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PreviewSearch from '../non-sitecore/search/PreviewSearch';
import { PREVIEW_WIDGET_ID } from '@/constants/search';
import { useUser } from '@auth0/nextjs-auth0/client';
import { trackAuthEvent } from '@/lib/auth-events';
import { event as cdpEvent, identity as cdpIdentity } from '@sitecore-cloudsdk/events/browser';

export type HeaderProps = ComponentProps & {
  params: { [key: string]: string };
};

export const Default = (props: HeaderProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, DynamicPlaceholderId } = props.params;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();
  const userLabel = user?.name || user?.email || 'My account';

  // Close search when route changes
  useEffect(() => {
    setIsSearchOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const cdpTrackedKey = 'cdp_login_tracked';
    if (!isLoading && user?.sub && !sessionStorage.getItem(cdpTrackedKey)) {
      sessionStorage.setItem(cdpTrackedKey, '1');

      trackAuthEvent({ type: 'session_detected', userId: user.sub });

      // CDP: identify user by email (links anonymous guest to known profile)
      if (user.email) {
        const email = (user.email as string).toLowerCase().trim();
        cdpIdentity({
          channel: 'WEB',
          currency: 'USD',
          email,
          identifiers: [{ provider: 'email', id: email }],
        }).catch((e) => console.debug(e));
      }

      // CDP: custom LOGIN event
      cdpEvent({ type: 'LOGIN', channel: 'WEB' }).catch((e) => console.debug(e));

      // Salesforce Data Cloud: identity + login events
      // The SDK loads via next/script (afterInteractive) which may not be ready
      // when this useEffect fires after an Auth0 redirect. Wait up to 5s for it.
      const sendSfdcEvents = () => {
        if (user.email) {
          const sfEmail = (user.email as string).toLowerCase().trim();
          // Contact-point email (profile event)
          window
            .SalesforceInteractions!.sendEvent({
              interaction: { name: 'Login' },
              user: {
                attributes: {
                  email: sfEmail,
                  eventType: 'contactPointEmail',
                },
              },
            })
            .catch((e) =>
              console.debug('[SalesforceDataCloud] contactPointEmail event failed:', e)
            );
        }

        // Identity profile event
        window
          .SalesforceInteractions!.sendEvent({
            interaction: { name: 'Login' },
            user: {
              attributes: {
                firstName: (user.given_name as string) || '',
                lastName: (user.family_name as string) || '',
                eventType: 'identity',
                isAnonymous: 0,
              },
            },
          })
          .catch((e) => console.debug('[SalesforceDataCloud] identity event failed:', e));
      };

      const isSfdcReady = () => !!(window.SalesforceInteractions && window.__sfdc_dc_initialized);

      if (isSfdcReady()) {
        sendSfdcEvents();
      } else {
        let attempts = 0;
        const waitForSdk = setInterval(() => {
          attempts++;
          if (isSfdcReady()) {
            clearInterval(waitForSdk);
            sendSfdcEvents();
          } else if (attempts >= 20) {
            clearInterval(waitForSdk);
          }
        }, 250);
      }
    }
  }, [isLoading, user]);

  const handleLogout = () => {
    sessionStorage.removeItem('cdp_login_tracked');
    trackAuthEvent({ type: 'logout_initiated', userId: user?.sub });
    cdpEvent({ type: 'LOGOUT', channel: 'WEB' }).catch((e) => console.debug(e));

    // Salesforce Data Cloud: logout event
    if (window.SalesforceInteractions) {
      window.SalesforceInteractions.sendEvent({
        interaction: { name: 'Logout' },
      }).catch((e) => console.debug('[SalesforceDataCloud] Logout event failed:', e));
    }
  };

  return (
    <div className={`component header bg-background border-b ${styles}`} id={id}>
      <div className="container flex items-center gap-4 py-4 lg:gap-6">
        <div className="header-block *:shrink max-lg:w-full max-lg:justify-between lg:shrink-0">
          <Placeholder name={`header-left-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>
        <div className="hidden! lg:flex! lg:shrink lg:basis-full">
          <Placeholder name={`header-nav-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div>

        {/* Search Button */}
        <button
          onClick={() => setIsSearchOpen(!isSearchOpen)}
          className="text-gray-700 transition-colors hover:text-blue-600"
        >
          <Search className="size-5" />
        </button>

        {/* <div className="header-block hidden! lg:flex! lg:shrink-0">
          <Placeholder name={`header-right-${DynamicPlaceholderId}`} rendering={props.rendering} />
        </div> */}

        {!isLoading && (
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            {user ? (
              <>
                <span className="text-sm">{userLabel}</span>
                <Link
                  href="/auth/logout"
                  onClick={handleLogout}
                  className="text-sm font-medium hover:underline"
                >
                  Logout
                </Link>
              </>
            ) : (
              <Link href="/auth/login" className="text-sm font-medium hover:underline">
                Login
              </Link>
            )}
          </div>
        )}

        {/* Mobile Drawer Trigger */}
        <div className="lg:hidden">
          <Drawer direction="left">
            <DrawerTrigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="text-foreground hover:text-foreground-light p-2 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
            </DrawerTrigger>

            <DrawerContent className="bg-background-accent w-xl! max-w-full! p-5">
              <div className="flex h-full flex-col">
                <div className="mb-14 flex items-center justify-between self-end">
                  <DrawerClose asChild>
                    <button type="button" aria-label="Close menu">
                      <X className="h-5 w-5" />
                    </button>
                  </DrawerClose>
                </div>

                <div className="mb-6 flex flex-col gap-y-6 px-12">
                  <Placeholder
                    name={`header-nav-${DynamicPlaceholderId}`}
                    rendering={props.rendering}
                  />
                </div>
                <div className="flex flex-col gap-y-6 px-12">
                  <Placeholder
                    name={`header-right-${DynamicPlaceholderId}`}
                    rendering={props.rendering}
                  />
                  {!isLoading && (
                    <div className="flex flex-col gap-y-3">
                      {user ? (
                        <>
                          <span className="text-sm">{userLabel}</span>
                          <Link
                            href="/auth/logout"
                            onClick={handleLogout}
                            className="text-sm font-medium hover:underline"
                          >
                            Logout
                          </Link>
                        </>
                      ) : (
                        <Link href="/auth/login" className="text-sm font-medium hover:underline">
                          Login
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-border bg-background absolute top-full right-0 left-0 z-50 border-b shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <div className="flex items-center gap-2">
              <PreviewSearch
                rfkId={PREVIEW_WIDGET_ID}
                isOpen={isSearchOpen}
                setIsSearchOpen={setIsSearchOpen}
              />

              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-foreground-muted hover:text-foreground p-3 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
