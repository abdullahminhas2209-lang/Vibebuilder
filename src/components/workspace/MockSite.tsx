import type {
  DashboardPreview,
  MarketingPreview,
  MockPreviewConfig,
  StorePreview,
} from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Static preview-site renderer driven entirely by each project's
 * MockPreviewConfig. Purely visual — represents what a generated project
 * would look like and contains no real functionality.
 */

function SiteNavbar({ config }: { config: MockPreviewConfig }) {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
        <span className="text-sm font-semibold tracking-tight text-stone-900">
          {config.brand}
        </span>
        <span className="hidden gap-6 text-xs text-stone-500 sm:flex">
          {config.nav.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </span>
        <span
          className={cn(
            "rounded-full px-3.5 py-1.5 text-xs font-medium",
            config.accent.primaryButton,
          )}
        >
          {config.navCta}
        </span>
      </nav>
    </header>
  );
}

function SiteFooter({ config }: { config: MockPreviewConfig }) {
  return (
    <footer className="border-t border-stone-100 py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-semibold text-stone-900">{config.brand}</span>
        <span className="flex gap-5">
          {config.footerLinks.map((link) => (
            <span key={link}>{link}</span>
          ))}
        </span>
        <span>{config.footerNote}</span>
      </div>
    </footer>
  );
}

function MarketingSite({ config }: { config: MarketingPreview }) {
  return (
    <div className="min-h-full bg-white font-sans text-stone-900">
      <SiteNavbar config={config} />
      <main>
        <section
          className={cn("px-5 py-16 text-center sm:py-20", config.accent.darkSurface)}
        >
          <p
            className={cn(
              "text-[11px] font-medium tracking-[0.2em] uppercase",
              config.accent.accentText,
            )}
          >
            {config.badge}
          </p>
          <h1 className="mx-auto mt-4 max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {config.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-400">
            {config.subtext}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <span
              className={cn(
                "rounded-full px-5 py-2.5 text-sm font-medium",
                config.accent.primaryButton,
              )}
            >
              {config.primaryCta}
            </span>
            <span className="rounded-full border border-stone-700 px-5 py-2.5 text-sm text-stone-200">
              {config.secondaryCta}
            </span>
          </div>
        </section>

        <section
          className={cn("border-y border-stone-100 px-5 py-14", config.accent.softSurface)}
        >
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="text-2xl font-semibold tracking-tight">
              {config.sectionTitle}
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {config.cards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-2xl border border-stone-200 bg-white p-4"
                >
                  <div
                    className={cn(
                      "h-28 rounded-xl bg-gradient-to-br",
                      config.accent.swatch,
                    )}
                  />
                  <h3 className="mt-3 text-sm font-medium">{card.title}</h3>
                  <p className="mt-1 text-xs text-stone-500">{card.meta}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-5 py-16">
          <div
            className={cn("rounded-3xl px-6 py-14 text-center", config.accent.darkSurface)}
          >
            <h2 className="text-2xl font-semibold text-white">{config.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm text-stone-400">
              {config.ctaBody}
            </p>
            <span
              className={cn(
                "mt-7 inline-block rounded-full px-6 py-2.5 text-sm font-medium",
                config.accent.primaryButton,
              )}
            >
              {config.ctaButton}
            </span>
          </div>
        </section>
      </main>
      <SiteFooter config={config} />
    </div>
  );
}

function DashboardSite({ config }: { config: DashboardPreview }) {
  return (
    <div className="min-h-full bg-stone-50 font-sans text-stone-900">
      <SiteNavbar config={config} />
      <main className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {config.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-stone-200 bg-white p-4"
            >
              <p className="text-xs text-stone-500">{metric.label}</p>
              <p className="mt-1.5 text-2xl font-semibold tracking-tight">
                {metric.value}
              </p>
              <p className="mt-1 text-xs font-medium text-emerald-600">
                {metric.delta}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-medium">{config.chartTitle}</p>
          <svg
            viewBox="0 0 600 160"
            className="mt-4 h-36 w-full"
            role="img"
            aria-label="Usage trend chart"
          >
            <polyline
              fill="none"
              stroke={config.accent.chartStroke ?? "#6366f1"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              points="0,130 60,118 120,124 180,96 240,104 300,72 360,80 420,52 480,60 540,34 600,40"
            />
          </svg>
        </div>

        <div className="mt-6 rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-sm font-medium">Recent activity</p>
          <ul className="mt-3 space-y-2.5">
            {config.activity.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-4 text-xs"
              >
                <span className="text-stone-600">{item.label}</span>
                <span className="truncate font-medium text-stone-900">
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter config={config} />
    </div>
  );
}

function StoreSite({ config }: { config: StorePreview }) {
  return (
    <div className="min-h-full bg-white font-sans text-stone-900">
      <SiteNavbar config={config} />
      <main>
        <section
          className={cn("px-5 py-16 text-center", config.accent.darkSurface)}
        >
          <h1 className="mx-auto max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {config.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-stone-400">
            {config.subtext}
          </p>
          <span
            className={cn(
              "mt-7 inline-block rounded-full px-5 py-2.5 text-sm font-medium",
              config.accent.primaryButton,
            )}
          >
            {config.navCta}
          </span>
        </section>

        <section className="mx-auto w-full max-w-5xl px-5 py-14">
          <div className="grid gap-5 sm:grid-cols-3">
            {config.products.map((product) => (
              <article
                key={product.name}
                className="rounded-2xl border border-stone-200 p-4"
              >
                <div
                  className={cn(
                    "h-36 rounded-xl bg-gradient-to-br",
                    config.accent.swatch,
                  )}
                />
                <div className="mt-3 flex items-baseline justify-between">
                  <h3 className="text-sm font-medium">{product.name}</h3>
                  <span className="text-sm text-stone-500">
                    {product.price}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          className={cn("border-y px-5 py-14 text-center", config.accent.softSurface)}
        >
          <h2 className="text-2xl font-semibold tracking-tight">
            {config.ctaTitle}
          </h2>
          <span
            className={cn(
              "mt-6 inline-block rounded-full px-6 py-2.5 text-sm font-medium",
              config.accent.primaryButton,
            )}
          >
            {config.ctaButton}
          </span>
        </section>
      </main>
      <SiteFooter config={config} />
    </div>
  );
}

export function MockSite({ config }: { config: MockPreviewConfig }) {
  switch (config.variant) {
    case "dashboard":
      return <DashboardSite config={config} />;
    case "store":
      return <StoreSite config={config} />;
    default:
      return <MarketingSite config={config} />;
  }
}
