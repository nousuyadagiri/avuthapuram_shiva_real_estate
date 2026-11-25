import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center lg:px-8">
      <p className="text-xs font-semibold tracking-[0.24em] text-[#8A672E] uppercase">
        404 &bull; Page Not Found
      </p>
      <h1 className="mt-4 font-serif text-4xl font-medium text-[#111111] sm:text-5xl">
        The requested page could not be located.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-[#57534E] sm:text-base">
        The property listing or page may have moved or been unpublished. Explore available
        listings or return to the AVUTHAPURAM SHIVA REAL ESTATE home page.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center bg-[#111111] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#FFFFFF] uppercase hover:bg-[#292929]"
        >
          Return Home
        </Link>
        <Link
          href="/properties"
          className="inline-flex min-h-[48px] items-center border border-[#111111] px-6 py-3 text-xs font-semibold tracking-[0.16em] text-[#111111] uppercase hover:bg-[#FFFFFF]"
        >
          Browse Properties
        </Link>
      </div>
    </section>
  );
}

