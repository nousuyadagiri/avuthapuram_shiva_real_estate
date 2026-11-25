import { cacheLife } from "next/cache";
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getTelHref, getWhatsAppHref, siteConfig } from "@/config/site";
import { BrandLogo } from "@/components/BrandLogo";

export async function SiteFooter() {
  "use cache";
  cacheLife("days");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#292929] bg-[#111111] text-[#F8F7F4]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <div>
              <BrandLogo variant="dark" compact />
              <p className="mt-2.5 text-xs tracking-[0.2em] text-[#C6A46C] uppercase">
                Founded by {siteConfig.founder}
              </p>
            </div>
            <p className="text-sm leading-relaxed text-[#D4CFC5]">
              Specialized advisory for open plot buying, open plot selling, and
              residential land properties across Ibrahimpatnam, Janaharsha Dream
              City, and Telangana.
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#C6A46C] uppercase">
              Navigation
            </h2>
            <ul className="space-y-3 text-sm text-[#D4CFC5]">
              <li>
                <Link href="/" className="hover:text-[#FFFFFF]">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FFFFFF]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-[#FFFFFF]">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#FFFFFF]">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FFFFFF]">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#C6A46C] uppercase">
              Specializations
            </h2>
            <ul className="space-y-3 text-sm text-[#D4CFC5]">
              <li>
                <Link href="/services#buying" className="hover:text-[#FFFFFF]">
                  Open Plot Buying Assistance
                </Link>
              </li>
              <li>
                <Link href="/services#selling" className="hover:text-[#FFFFFF]">
                  Open Plot Selling Assistance
                </Link>
              </li>
              <li>
                <Link
                  href="/services#information"
                  className="hover:text-[#FFFFFF]"
                >
                  Property Information &amp; Review
                </Link>
              </li>
              <li>
                <Link
                  href="/services#site-visits"
                  className="hover:text-[#FFFFFF]"
                >
                  Site Visit Coordination
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-[#C6A46C] uppercase">
              Connect
            </h2>
            <ul className="space-y-3 text-sm text-[#D4CFC5]">
              <li className="flex items-start gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#C6A46C]"
                  aria-hidden="true"
                />
                <span>{siteConfig.location.addressNote}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone
                  className="h-4 w-4 shrink-0 text-[#C6A46C]"
                  aria-hidden="true"
                />
                <a href={getTelHref()} className="hover:text-[#FFFFFF]">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle
                  className="h-4 w-4 shrink-0 text-[#C6A46C]"
                  aria-hidden="true"
                />
                <a
                  href={getWhatsAppHref(
                    "Hello AVUTHAPURAM SHIVA REAL ESTATE, I would like to connect regarding residential open plots.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FFFFFF]"
                >
                  WhatsApp Enquiry
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  className="h-4 w-4 shrink-0 text-[#C6A46C]"
                  aria-hidden="true"
                />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="hover:text-[#FFFFFF]"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
            {siteConfig.socials.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-4 border-t border-[#292929] pt-4 text-xs tracking-[0.14em] uppercase">
                {siteConfig.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C6A46C] hover:text-[#FFFFFF]"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-[#292929] pt-8 text-xs text-[#A8A29E] sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.brandName}. All rights reserved. Location:
            Ibrahimpatnam, Janaharsha Dream City, Telangana.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <span>
              Sample development listings are clearly marked and non-binding.
            </span>
            <Link
              href="/admin"
              className="text-[#D4CFC5] underline-offset-4 hover:underline"
            >
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
