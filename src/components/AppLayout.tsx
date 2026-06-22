import { Link, useRouterState } from "@tanstack/react-router";
import { type ReactNode } from "react";
import { useBooking } from "@/lib/booking-store";
import { Bus, MapPin, Calendar, Users, ArmchairIcon, UserCircle2, Check } from "lucide-react";

const STEPS = [
  { key: "search", label: "Recherche", path: "/", icon: MapPin },
  { key: "results", label: "Voyages", path: "/resultats", icon: Bus },
  { key: "seats", label: "Places", path: "/places", icon: ArmchairIcon },
  { key: "passengers", label: "Passagers", path: "/passagers", icon: UserCircle2 },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " Ar";
}

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { search, selectedTrip, selectedSeats } = useBooking();

  const stepIndex = STEPS.findIndex((s) => s.path === pathname);
  const currentStep = stepIndex === -1 ? 0 : stepIndex;

  const total = selectedTrip ? selectedTrip.price * Math.max(selectedSeats.length, 1) : 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Bus className="h-5 w-5" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold tracking-tight text-foreground">KOP</span>
              <span className="text-lg font-light text-muted-foreground">—</span>
              <span className="text-lg font-bold tracking-tight text-primary">V</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const active = i === currentStep;
              const done = i < currentStep;
              return (
                <div key={s.key} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : done
                          ? "bg-secondary text-secondary-foreground"
                          : "text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
                    <span>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`mx-1 h-px w-4 ${i < currentStep ? "bg-primary" : "bg-border"}`}
                    />
                  )}
                </div>
              );
            })}
          </nav>
          <div className="text-xs text-muted-foreground">
            Aide ? <span className="font-medium text-foreground">+261 34 00 000 00</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_340px]">
        <main className="min-w-0">{children}</main>

        {/* Right vertical sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="bg-primary px-5 py-4 text-primary-foreground">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
                Récapitulatif
              </p>
              <p className="mt-1 text-base font-semibold">Votre voyage</p>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Trajet
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {search.from} → {search.to}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Date
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {new Date(search.date).toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Passagers
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {search.passengers} {search.passengers > 1 ? "personnes" : "personne"}
                  </p>
                </div>
              </div>

              {selectedTrip && (
                <>
                  <div className="border-t border-dashed border-border" />
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Compagnie
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {selectedTrip.company}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {selectedTrip.departure} → {selectedTrip.arrival} · {selectedTrip.classe}
                    </p>
                  </div>
                </>
              )}

              {selectedSeats.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Sièges
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {selectedSeats
                      .slice()
                      .sort((a, b) => a - b)
                      .map((s) => (
                        <span
                          key={s}
                          className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-accent px-2 text-xs font-bold text-accent-foreground"
                        >
                          {s}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {selectedTrip && (
                <>
                  <div className="border-t border-border" />
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Total
                    </span>
                    <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                </>
              )}

              {!selectedTrip && (
                <p className="rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground">
                  Sélectionnez un voyage pour voir le détail et le prix total.
                </p>
              )}
            </div>

            <div className="border-t border-border bg-muted/40 px-5 py-3">
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Place garantie · Paiement sécurisé · Annulation possible jusqu'à 24h avant
                départ.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}