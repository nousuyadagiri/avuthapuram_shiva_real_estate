import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { getBreadcrumbSchema, type BreadcrumbItem } from "@/lib/seo/schema";

export function Breadcrumbs({
  items,
  dark = false,
}: {
  items: BreadcrumbItem[];
  dark?: boolean;
}) {
  const schema = getBreadcrumbSchema(items);

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs tracking-[0.12em] uppercase">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {idx > 0 && (
                  <ChevronRight
                    className={`h-3.5 w-3.5 ${dark ? "text-[#C6A46C]" : "text-[#8A672E]"}`}
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className={dark ? "text-[#F8F7F4]" : "text-[#111111] font-medium"}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className={`transition-colors ${
                      dark
                        ? "text-[#D4CFC5] hover:text-[#C6A46C]"
                        : "text-[#57534E] hover:text-[#111111]"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

