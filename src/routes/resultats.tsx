import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { generateTrips, useBooking, type Trip, type TripClass } from "@/lib/booking-store";
import { ArrowRight, Clock, Bus, Filter, SlidersHorizontal } from "lucide-react";

export const Route = createFileRoute("/resultats")({
  head: () => ({
    meta: [
      { title: "Voyages disponibles — KOP-V" },
      {
        name: "description",
        content:
          "Comparez les voyages KOP-V disponibles : horaires, classes de confort, prix et places restantes.",
      },
    ],
  }),
  component: ResultsPage,
});

const CLASS_DOTS: Record<TripClass, string> = {
  Standard: "bg-secondary text-secondary-foreground",
  Confort: "bg-accent text-accent-foreground",
  VIP: "bg-primary text-primary-foreground",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " Ar";
}

function ResultsPage() {
  const navigate = useNavigate();
  const { search, setTrip } = useBooking();
  const [sort, setSort] = useState<"time" | "price" | "duration">("time");
  const [classFilter, setClassFilter] = useState<TripClass | "all">("all");

  const trips = useMemo(() => {
    const list = generateTrips(search.from, search.to, search.date);
    const filtered = classFilter === "all" ? list : list.filter((t) => t.classe === classFilter);
    return [...filtered].sort((a, b) => {
      if (sort === "price") return a.price - b.price;
      if (sort === "duration") return a.duration.localeCompare(b.duration);
      return a.departure.localeCompare(b.departure);
    });
  }, [search, sort, classFilter]);

  const select = (t: Trip) => {
    setTrip(t);
    navigate({ to: "/places" });
  };

  return (
    <AppLayout>
      <section className="space-y-6">
        <div className="flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Étape 2 / 4
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              {search.from} → {search.to}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {trips.length} voyages disponibles · {new Date(search.date).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <button
            onClick={() => navigate({ to: "/" })}
            className="hidden text-xs font-medium text-primary hover:underline md:inline"
          >
            ← Modifier la recherche
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Trier
          </div>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(["time", "price", "duration"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  sort === s ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {s === "time" ? "Horaire" : s === "price" ? "Prix" : "Durée"}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            Classe
          </div>
          <div className="flex gap-1 rounded-lg bg-muted p-1">
            {(["all", "Standard", "Confort", "VIP"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setClassFilter(c)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition ${
                  classFilter === c ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
              >
                {c === "all" ? "Toutes" : c}
              </button>
            ))}
          </div>
        </div>

        {/* Trip list */}
        <div className="space-y-3">
          {trips.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center">
              <p className="text-base font-semibold text-foreground">Aucun voyage trouvé</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Essayez d'élargir vos filtres ou de choisir une autre date.
              </p>
            </div>
          ) : (
            trips.map((t) => (
              <article
                key={t.id}
                className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  <div className="flex items-center gap-3 md:w-48">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                      <Bus className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.company}</p>
                      <p className="text-xs text-muted-foreground">{t.vehicle}</p>
                    </div>
                  </div>

                  <div className="flex flex-1 items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold tabular-nums text-foreground">
                        {t.departure}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.from}</p>
                    </div>
                    <div className="flex flex-1 flex-col items-center">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {t.duration}
                      </div>
                      <div className="relative my-1 h-px w-full bg-border">
                        <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
                        <div className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
                      </div>
                      <span
                        className={`mt-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${CLASS_DOTS[t.classe]}`}
                      >
                        {t.classe}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="text-xl font-bold tabular-nums text-foreground">
                        {t.arrival}
                      </p>
                      <p className="text-xs text-muted-foreground">{t.to}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 md:flex-col md:items-end md:justify-center">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">{formatPrice(t.price)}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {t.seatsLeft <= 5 ? (
                          <span className="font-semibold text-destructive">
                            Plus que {t.seatsLeft} places
                          </span>
                        ) : (
                          <>{t.seatsLeft} places restantes</>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => select(t)}
                      className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
                    >
                      Choisir
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </AppLayout>
  );
}