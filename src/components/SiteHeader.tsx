"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import { getTelHref, getWhatsAppHref, siteConfig } from "@/config/site";
import { BrandLogo } from "@/components/BrandLogo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const hasBeenVisibleRef = useRef(false);

  const isCurrent = useCallback(
    (href: string) => {
      if (href === "/") return pathname === "/";
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  const closeDrawer = useCallback(() => {
    const dialog = dialogRef.current;
    const scroller = scrollerRef.current;
    if (!dialog || !dialog.open) return;

    if (scroller) {
      scroller.scrollTo({ left: 0, behavior: "auto" });
      // Fallback safety close if reduced motion or instant jump completes before observer fires
      window.setTimeout(() => {
        if (dialog.open && scroller.scrollLeft < 4) {
          dialog.close();
          setDrawerOpen(false);
        }
      }, 320);
    } else {
      dialog.close();
      setDrawerOpen(false);
    }
  }, []);

  const openDrawer = useCallback(async () => {
    const dialog = dialogRef.current;
    const scroller = scrollerRef.current;
    if (!dialog || !scroller) return;

    hasBeenVisibleRef.current = false;

    if (!dialog.open) {
      dialog.showModal();
    }

    if (typeof CSS !== "undefined" && !CSS.supports("scroll-initial-target", "nearest")) {
      scroller.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    }

    const targetLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    scroller.scrollTo({ left: targetLeft, behavior: "auto" });
    setDrawerOpen(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    const scroller = scrollerRef.current;
    const sheet = sheetRef.current;
    if (!dialog || !scroller || !sheet) return;

    const visibleThreshold = Math.max(0.01, 1 / (window.innerWidth || 390));

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.at(-1);
        if (!entry) return;
        if (entry.intersectionRatio >= visibleThreshold && dialog.open) {
          hasBeenVisibleRef.current = true;
        }
        if (
          hasBeenVisibleRef.current &&
          entry.intersectionRatio < visibleThreshold &&
          dialog.open
        ) {
          hasBeenVisibleRef.current = false;
          dialog.close();
          setDrawerOpen(false);
        } else if (entry.intersectionRatio >= 0.99 && dialog.open) {
          setDrawerOpen(true);
        }
      },
      { root: dialog, threshold: [visibleThreshold, 0.99] },
    );

    observer.observe(sheet);

    let cleanupScrollListener: (() => void) | undefined;
    if (typeof CSS !== "undefined" && !CSS.supports("animation-timeline: scroll()")) {
      const handleScroll = () => {
        const width = sheet.offsetWidth || 1;
        const ratio = Math.min(1, Math.max(0, scroller.scrollLeft / width));
        dialog.style.setProperty("--drawer-backdrop", String(ratio));
      };
      scroller.addEventListener("scroll", handleScroll, { passive: true });
      cleanupScrollListener = () => scroller.removeEventListener("scroll", handleScroll);
    }

    const handleCancel = (event: Event) => {
      if (event.cancelable) {
        event.preventDefault();
        closeDrawer();
      } else {
        setDrawerOpen(false);
      }
    };

    const handleClose = () => {
      setDrawerOpen(false);
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("close", handleClose);

    return () => {
      observer.disconnect();
      cleanupScrollListener?.();
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("close", handleClose);
    };
  }, [closeDrawer]);

  // Close drawer automatically on route change
  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog?.open) {
      dialog.close();
      setDrawerOpen(false);
    }
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E3DED4] bg-[#FFFFFF]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
          <Link
            href="/"
            className="group flex items-center focus-visible:outline-2 focus-visible:outline-[#C6A46C]"
            aria-label="AVUTHAPURAM SHIVA REAL ESTATE — Home"
          >
            <BrandLogo variant="light" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const active = isCurrent(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative py-2 text-xs font-medium tracking-[0.16em] uppercase transition-colors ${
                        active
                          ? "text-[#111111] after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:bg-[#C6A46C]"
                          : "text-[#57534E] hover:text-[#111111]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={getTelHref()}
              className="inline-flex min-h-[44px] items-center gap-2 border border-[#E3DED4] px-4 py-2 text-xs font-medium tracking-[0.12em] text-[#111111] uppercase transition-colors hover:border-[#111111]"
            >
              <Phone className="h-3.5 w-3.5 text-[#8A672E]" aria-hidden="true" />
              <span>Call Advisory</span>
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center bg-[#111111] px-5 py-2 text-xs font-medium tracking-[0.14em] text-[#FFFFFF] uppercase transition-colors hover:bg-[#292929]"
            >
              Enquire Now
            </Link>
          </div>

          <button
            ref={openBtnRef}
            type="button"
            onClick={openDrawer}
            aria-label="Open navigation menu"
            aria-expanded={drawerOpen}
            aria-controls="mobile-navigation-drawer"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-[#E3DED4] bg-[#FFFFFF] px-3 text-[#111111] transition-colors hover:border-[#111111] lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span className="ml-2 text-xs font-medium tracking-[0.14em] uppercase">Menu</span>
          </button>
        </div>
      </header>

      {/* Native <dialog> mobile navigation drawer with scroll-snap swipe dismissal */}
      <dialog
        ref={dialogRef}
        id="mobile-navigation-drawer"
        aria-label="Mobile navigation"
        className="as-drawer fixed inset-0 m-0 h-dvh w-screen max-w-none max-h-none border-0 bg-transparent p-0 lg:hidden"
        onClick={(event) => {
          if (sheetRef.current && !sheetRef.current.contains(event.target as Node)) {
            closeDrawer();
          }
        }}
      >
        <div ref={scrollerRef} className="as-drawer-scroller h-full w-full">
          <nav
            ref={sheetRef}
            aria-label="Mobile primary"
            className="as-drawer-sheet h-full bg-[#111111] text-[#FFFFFF]"
          >
            <div className="flex items-center justify-between border-b border-[#292929] bg-[#111111] px-6 py-5">
              <BrandLogo variant="dark" compact />
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close navigation menu"
                autoFocus
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center border border-[#292929] bg-[#111111] text-[#FFFFFF] transition-colors hover:border-[#C6A46C] hover:text-[#C6A46C]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <ul className="flex flex-col divide-y divide-[#292929] px-6 py-4">
              {NAV_LINKS.map((link) => {
                const active = isCurrent(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => {
                        dialogRef.current?.close();
                        setDrawerOpen(false);
                      }}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-[52px] items-center justify-between text-sm font-medium tracking-[0.15em] uppercase transition-colors ${
                        active ? "text-[#C6A46C]" : "text-[#F8F7F4] hover:text-[#C6A46C]"
                      }`}
                    >
                      <span>{link.label}</span>
                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[#C6A46C]" aria-hidden="true" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-3 border-t border-[#292929] px-6 py-6">
              <p className="text-xs tracking-[0.14em] text-[#D4CFC5] uppercase">
                {siteConfig.location.displayLine}
              </p>
              <a
                href={getTelHref()}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 border border-[#C6A46C] px-4 py-3 text-xs font-medium tracking-[0.14em] text-[#C6A46C] uppercase"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                <span>Call {siteConfig.contact.phoneDisplay}</span>
              </a>
              <a
                href={getWhatsAppHref(
                  "Hello AVUTHAPURAM SHIVA REAL ESTATE, I would like to enquire about open plots in Ibrahimpatnam.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-[48px] w-full items-center justify-center bg-[#C6A46C] px-4 py-3 text-xs font-semibold tracking-[0.14em] text-[#111111] uppercase"
              >
                WhatsApp Enquiry
              </a>
            </div>
          </nav>
        </div>
      </dialog>
    </>
  );
}

