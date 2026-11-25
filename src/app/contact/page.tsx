import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone, UserCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getTelHref, getWhatsAppHref, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact AVUTHAPURAM SHIVA REAL ESTATE | Ibrahimpatnam, Telangana",
  description:
    "Contact AVUTHAPURAM SHIVA REAL ESTATE in Ibrahimpatnam, Janardhan, Telangana for open plot buying, open plot selling, property information, and guided site visits.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[#111111] py-16 text-[#FFFFFF] sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Breadcrumbs
            dark
            items={[
              { label: "Home", href: "/" },
              { label: "Contact", href: "/contact" },
            ]}
          />
          <p className="text-xs font-semibold tracking-[0.24em] text-[#C6A46C] uppercase">
            Direct Consultation
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium leading-tight sm:text-5xl">
            Contact AVUTHAPURAM SHIVA REAL ESTATE
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#D4CFC5]">
            Connect with {siteConfig.founder}&apos;s advisory team for open plot enquiries,
            seller representations, and coordinated site visits in Ibrahimpatnam and Janardhan,
            Telangana.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-5">
            <div className="border border-[#E3DED4] bg-[#FFFFFF] p-7">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#8A672E] uppercase">
                Office &amp; Channels
              </p>
              <h2 className="mt-2 font-serif text-2xl font-medium text-[#111111]">
                Reach Our Advisory Desk
              </h2>

              <dl className="mt-6 space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <UserCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8A672E]" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.14em] text-[#57534E] uppercase">
                      Founder
                    </dt>
                    <dd className="mt-1 font-medium text-[#111111]">{siteConfig.founder}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#8A672E]" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.14em] text-[#57534E] uppercase">
                      Location
                    </dt>
                    <dd className="mt-1 text-[#111111]">{siteConfig.location.addressNote}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#8A672E]" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.14em] text-[#57534E] uppercase">
                      Phone (Click to Call)
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={getTelHref()}
                        className="font-medium text-[#111111] underline decoration-[#C6A46C] underline-offset-4 hover:text-[#8A672E]"
                      >
                        {siteConfig.contact.phoneDisplay}
                      </a>
                      {!siteConfig.contact.phoneConfigured && (
                        <span className="mt-1 block text-xs text-[#57534E]">
                          Placeholder — configure via `NEXT_PUBLIC_PHONE`.
                        </span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageCircle
                    className="mt-0.5 h-5 w-5 shrink-0 text-[#8A672E]"
                    aria-hidden="true"
                  />
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.14em] text-[#57534E] uppercase">
                      WhatsApp
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={getWhatsAppHref(
                          "Hello AVUTHAPURAM SHIVA REAL ESTATE, I would like to enquire about residential open plots in Ibrahimpatnam.",
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#111111] underline decoration-[#C6A46C] underline-offset-4 hover:text-[#8A672E]"
                      >
                        Start WhatsApp Conversation
                      </a>
                      {!siteConfig.contact.whatsappConfigured && (
                        <span className="mt-1 block text-xs text-[#57534E]">
                          Placeholder — configure via `NEXT_PUBLIC_WHATSAPP`.
                        </span>
                      )}
                    </dd>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#8A672E]" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-semibold tracking-[0.14em] text-[#57534E] uppercase">
                      Email
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${siteConfig.contact.email}`}
                        className="font-medium text-[#111111] underline decoration-[#C6A46C] underline-offset-4 hover:text-[#8A672E]"
                      >
                        {siteConfig.contact.email}
                      </a>
                      {!siteConfig.contact.emailConfigured && (
                        <span className="mt-1 block text-xs text-[#57534E]">
                          Placeholder — configure via `NEXT_PUBLIC_EMAIL`.
                        </span>
                      )}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-7">
            <EnquiryForm heading="Send a Consultation Request" />
          </div>
        </div>
      </section>
    </>
  );
}

