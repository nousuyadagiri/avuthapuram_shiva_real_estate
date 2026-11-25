import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, Compass, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Us | Founder Avuthapuram Shiva",
  description:
    "Learn about AVUTHAPURAM SHIVA REAL ESTATE, founded by Avuthapuram Shiva in Ibrahimpatnam, Janaharsha Dream City, Telangana—specializing in open plot buying, selling, and residential land properties.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#111111] py-16 text-[#FFFFFF] sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Breadcrumbs
            dark
            items={[
              { label: "Home", href: "/" },
              { label: "About Us", href: "/about" },
            ]}
          />
          <p className="text-xs font-semibold tracking-[0.24em] text-[#C6A46C] uppercase">
            Corporate Profile
          </p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-medium leading-tight sm:text-5xl">
            About AVUTHAPURAM SHIVA REAL ESTATE
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[#D4CFC5]">
            A focused residential land advisory in Ibrahimpatnam, Janaharsha
            Dream City, Telangana, built around honest property representation
            and long-term land security.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden border border-[#E3DED4]">
              <Image
                src="/images/plot-enclave.jpg"
                alt="Landscaped residential plot enclave entrance representing AVUTHAPURAM SHIVA REAL ESTATE land standards"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-6 lg:col-span-6">
            <p className="text-xs font-semibold tracking-[0.22em] text-[#8A672E] uppercase">
              Company Introduction
            </p>
            <h2 className="font-serif text-3xl font-medium text-[#111111] sm:text-4xl">
              Focused Exclusively on Open Plots &amp; Residential Land
            </h2>
            <p className="text-sm leading-relaxed text-[#292929] sm:text-base">
              AVUTHAPURAM SHIVA REAL ESTATE operates out of{" "}
              {siteConfig.location.displayLine}. Unlike generalist brokerages
              that split attention across commercial leases and high-rise
              resales, our practice is dedicated to open plot buying, open plot
              selling, and residential land properties across Ibrahimpatnam and
              the wider Hyderabad region in Telangana.
            </p>
            <p className="text-sm leading-relaxed text-[#57534E] sm:text-base">
              Land is a foundational family asset. Every client engagement is
              structured around clear parcel specifications, physical site
              inspections, and verified documentation review before any
              commitment is made.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E3DED4] bg-[#FFFFFF] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#8A672E] uppercase">
                Leadership
              </p>
              <h2 className="mt-2 font-serif text-3xl font-medium text-[#111111] sm:text-4xl">
                Founder: {siteConfig.founder}
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#57534E] sm:text-base">
                AVUTHAPURAM SHIVA REAL ESTATE was established by{" "}
                {siteConfig.founder} with a straightforward mandate: bring
                corporate clarity, respectful client communication, and factual
                diligence to residential open plot transactions in Ibrahimpatnam
                and Janaharsha Dream City.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
              <div className="border border-[#E3DED4] bg-[#F8F7F4] p-7">
                <Compass
                  className="h-5 w-5 text-[#8A672E]"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-serif text-2xl font-medium text-[#111111]">
                  Our Vision
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#57534E]">
                  To be the most trusted corporate reference for open plots in
                  Ibrahimpatnam and residential land across Telangana—recognized
                  for factual transparency and unhurried client advisory.
                </p>
              </div>

              <div className="border border-[#E3DED4] bg-[#F8F7F4] p-7">
                <Award className="h-5 w-5 text-[#8A672E]" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-2xl font-medium text-[#111111]">
                  Our Mission
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#57534E]">
                  To connect open plot buyers and landowners through structured
                  parcel information, accompanied site visits, and clear
                  documentation checks without inflated claims.
                </p>
              </div>

              <div className="border border-[#E3DED4] bg-[#F8F7F4] p-7 sm:col-span-2">
                <ShieldCheck
                  className="h-5 w-5 text-[#8A672E]"
                  aria-hidden="true"
                />
                <h3 className="mt-4 font-serif text-2xl font-medium text-[#111111]">
                  Business Accuracy Commitment
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#57534E]">
                  AVUTHAPURAM SHIVA REAL ESTATE publishes verified plot prices,
                  approvals, and statutory records only when formally supplied
                  and confirmed for a property. Sample entries during site setup
                  are always explicitly labeled, and street-level office address
                  details in Ibrahimpatnam, Janaharsha Dream City remain clearly
                  noted until finalized.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 border border-[#E3DED4] bg-[#111111] p-8 text-[#FFFFFF] sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="font-serif text-2xl font-medium sm:text-3xl">
              Ready to discuss a plot requirement in Telangana?
            </h2>
            <p className="mt-2 text-sm text-[#D4CFC5]">
              Connect with AVUTHAPURAM SHIVA REAL ESTATE for buying, selling, or
              site visit coordination.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex min-h-[48px] shrink-0 items-center gap-2 bg-[#C6A46C] px-7 py-3 text-xs font-semibold tracking-[0.16em] text-[#111111] uppercase hover:bg-[#D5B784]"
          >
            <span>Speak With Us</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
