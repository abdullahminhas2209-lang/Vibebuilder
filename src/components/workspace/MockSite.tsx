import type {
  DashboardPreview,
  MarketingPreview,
  MockPreviewConfig,
  StorePreview,
} from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Static preview-site renderer driven entirely by each project's
 * MockPreviewConfig. Styled with Klyro's editorial theme:
 * Fraunces headers, IBM Plex Sans body, IBM Plex Mono accents,
 * ink backgrounds, slate-line borders, and amber highlights.
 */

function SiteNavbar({ config }: { config: MockPreviewConfig }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-line bg-ink/95 backdrop-blur">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-sm bg-amber text-[#14161f] text-xs font-bold font-mono">
            {config.brand.charAt(0)}
          </span>
          <span className="font-serif text-sm font-bold tracking-tight text-cream">
            {config.brand}
          </span>
        </div>
        <span className="hidden gap-6 text-xs font-mono text-fog sm:flex">
          {config.nav.map((item) => (
            <span key={item} className="hover:text-cream cursor-pointer transition-colors">
              {item}
            </span>
          ))}
        </span>
        <span
          className={cn(
            "rounded-sm px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer",
            config.accent.primaryButton || "bg-amber text-[#14161f] hover:bg-amber-deep",
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
    <footer className="border-t border-slate-line bg-ink py-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 text-xs text-fog sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="font-serif font-semibold text-cream">{config.brand}</span>
          <span className="text-[11px] font-mono text-fog-dim">· Generated with Klyro</span>
        </div>
        <span className="flex gap-5 font-mono text-[11px]">
          {config.footerLinks.map((link) => (
            <span key={link} className="hover:text-cream cursor-pointer transition-colors">
              {link}
            </span>
          ))}
        </span>
        <span className="font-mono text-[11px] text-fog-dim">{config.footerNote}</span>
      </div>
    </footer>
  );
}

function MarketingSite({ config }: { config: MarketingPreview }) {
  return (
    <div className="min-h-full bg-ink font-sans text-cream">
      <SiteNavbar config={config} />
      <main>
        <section className="border-b border-slate-line bg-ink px-5 py-16 text-center sm:py-20">
          <p className="mx-auto inline-flex items-center rounded-sm border border-amber/30 bg-amber/10 px-3 py-1 font-mono text-[11px] font-medium tracking-wide uppercase text-amber">
            {config.badge}
          </p>
          <h1 className="mx-auto mt-4 max-w-xl font-serif text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
            {config.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fog font-sans">
            {config.subtext}
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <span
              className={cn(
                "rounded-sm px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
                config.accent.primaryButton || "bg-amber text-[#14161f] hover:bg-amber-deep",
              )}
            >
              {config.primaryCta}
            </span>
            <span className="rounded-sm border border-slate-line bg-ink-raised px-5 py-2.5 text-sm font-medium text-cream hover:bg-ink-raised/80 transition-colors cursor-pointer">
              {config.secondaryCta}
            </span>
          </div>
        </section>

        <section className="border-b border-slate-line bg-ink-raised/40 px-5 py-14">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="font-serif text-2xl font-semibold tracking-tight text-cream">
              {config.sectionTitle}
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {config.cards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-md border border-slate-line bg-ink p-4 transition-all hover:border-amber/40"
                >
                  <div
                    className={cn(
                      "h-28 rounded-sm border border-slate-line bg-gradient-to-br",
                      config.accent.swatch || "from-amber/20 to-ink-raised",
                    )}
                  />
                  <h3 className="mt-3 font-serif text-sm font-semibold text-cream">
                    {card.title}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-fog">{card.meta}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-5 py-16">
          <div className="rounded-md border border-slate-line bg-ink-raised px-6 py-14 text-center">
            <h2 className="font-serif text-2xl font-semibold text-cream">
              {config.ctaTitle}
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm text-fog">
              {config.ctaBody}
            </p>
            <span
              className={cn(
                "mt-7 inline-block rounded-sm px-6 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
                config.accent.primaryButton || "bg-amber text-[#14161f] hover:bg-amber-deep",
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
    <div className="min-h-full bg-ink font-sans text-cream">
      <SiteNavbar config={config} />
      <main className="mx-auto w-full max-w-5xl px-5 py-8">
        <div className="grid gap-4 sm:grid-cols-4">
          {config.metrics.map((metric) => (
            <div
              key={metric.label}
              className="rounded-md border border-slate-line bg-ink-raised p-4 transition-all hover:border-amber/30"
            >
              <p className="font-mono text-xs font-medium uppercase tracking-wider text-fog-dim">
                {metric.label}
              </p>
              <p className="mt-1.5 font-mono text-2xl font-bold tracking-tight text-cream">
                {metric.value}
              </p>
              <p className="mt-1 font-mono text-xs font-medium text-amber">
                {metric.delta}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-md border border-slate-line bg-ink-raised p-5">
          <div className="flex items-center justify-between border-b border-slate-line pb-3">
            <p className="font-serif text-sm font-semibold text-cream">
              {config.chartTitle}
            </p>
            <span className="font-mono text-xs text-fog-dim">Last 30 days</span>
          </div>
          <div className="relative mt-4">
            <svg
              viewBox="0 0 600 160"
              className="h-40 w-full overflow-visible"
              role="img"
              aria-label="Usage trend chart"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f2a93b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f2a93b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                fill="url(#chartGradient)"
                points="0,130 60,118 120,124 180,96 240,104 300,72 360,80 420,52 480,60 540,34 600,40 600,160 0,160"
              />
              <polyline
                fill="none"
                stroke={config.accent.chartStroke ?? "#f2a93b"}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,130 60,118 120,124 180,96 240,104 300,72 360,80 420,52 480,60 540,34 600,40"
              />
            </svg>
          </div>
        </div>

        <div className="mt-6 rounded-md border border-slate-line bg-ink-raised p-5">
          <p className="font-serif text-sm font-semibold text-cream">
            Recent activity
          </p>
          <ul className="mt-3 divide-y divide-slate-line/50">
            {config.activity.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-4 py-2.5 text-xs"
              >
                <span className="text-fog font-sans">{item.label}</span>
                <span className="truncate font-mono font-medium text-cream">
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
    <div className="min-h-full bg-ink font-sans text-cream">
      <SiteNavbar config={config} />
      <main>
        <section className="border-b border-slate-line bg-ink px-5 py-16 text-center">
          <h1 className="mx-auto max-w-xl font-serif text-3xl font-semibold tracking-tight text-cream sm:text-4xl">
            {config.headline}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-fog font-sans">
            {config.subtext}
          </p>
          <span
            className={cn(
              "mt-7 inline-block rounded-sm px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
              config.accent.primaryButton || "bg-amber text-[#14161f] hover:bg-amber-deep",
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
                className="rounded-md border border-slate-line bg-ink-raised p-4 transition-all hover:border-amber/40"
              >
                <div
                  className={cn(
                    "h-36 rounded-sm border border-slate-line bg-gradient-to-br",
                    config.accent.swatch || "from-amber/20 to-ink",
                  )}
                />
                <div className="mt-3 flex items-baseline justify-between">
                  <h3 className="font-serif text-sm font-semibold text-cream">
                    {product.name}
                  </h3>
                  <span className="font-mono text-sm font-medium text-amber">
                    {product.price}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-line bg-ink-raised/50 px-5 py-14 text-center">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-cream">
            {config.ctaTitle}
          </h2>
          <span
            className={cn(
              "mt-6 inline-block rounded-sm px-6 py-2.5 text-sm font-semibold transition-colors cursor-pointer",
              config.accent.primaryButton || "bg-amber text-[#14161f] hover:bg-amber-deep",
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
