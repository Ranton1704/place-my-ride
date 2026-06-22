import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { CITIES, useBooking } from "@/lib/booking-store";
import {
  ArrowLeftRight,
  Calendar,
  MapPin,
  Search,
  Users,
  ShieldCheck,
  Clock,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KOP-V — Réserver un voyage interurbain à Madagascar" },
      {
        name: "description",
        content:
          "Réservez votre trajet entre Antananarivo, Antsirabe, Toamasina et bien plus. Places garanties, paiement sécurisé, expérience moderne.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const navigate = useNavigate();
  const { search, setSearch, swapCities } = useBooking();

  return (
    <AppLayout>
      <section className="space-y-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Réservation
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Où souhaitez-vous voyager aujourd'hui&nbsp;?
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Choisissez votre itinéraire et trouvez un voyage fiable, à l'heure et confortable
            sur le réseau KOP-V.
          </p>
        </div>

        {/* Search card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-7">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr_1fr_auto] md:items-end">
            <Field label="Ville de départ" icon={MapPin}>
              <select
                value={search.from}
                onChange={(e) => setSearch({ from: e.target.value })}
                className="w-full bg-transparent text-sm font-semibold text-foreground outline-none"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <button
              type="button"
              onClick={swapCities}
              aria-label="Inverser"
              className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-primary transition hover:rotate-180 hover:border-primary hover:bg-primary/10"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>

            <Field label="Ville d'arrivée" icon={MapPin}>
              <select
                value={search.to}
                onChange={(e) => setSearch({ to: e.target.value })}
                className="w-full bg-transparent text-sm font-semibold text-foreground outline-none"
              >
                {CITIES.filter((c) => c !== search.from).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Date de départ" icon={Calendar}>
              <input
                type="date"
                value={search.date}
                onChange={(e) => setSearch({ date: e.target.value })}
                className="w-full bg-transparent text-sm font-semibold text-foreground outline-none"
              />
            </Field>

            <Field label="Passagers" icon={Users}>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setSearch({ passengers: Math.max(1, search.passengers - 1) })
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground hover:border-primary hover:text-primary"
                >
                  −
                </button>
                <span className="w-4 text-center text-sm font-semibold">
                  {search.passengers}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSearch({ passengers: Math.min(9, search.passengers + 1) })
                  }
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground hover:border-primary hover:text-primary"
                >
                  +
                </button>
              </div>
            </Field>
          </div>

          <button
            onClick={() => navigate({ to: "/resultats" })}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Search className="h-4 w-4" />
            Rechercher un voyage
          </button>
        </div>

        {/* Popular routes */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Trajets populaires
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { from: "Antananarivo", to: "Antsirabe", price: "à partir de 25 000 Ar" },
              { from: "Antananarivo", to: "Toamasina", price: "à partir de 45 000 Ar" },
              { from: "Antananarivo", to: "Fianarantsoa", price: "à partir de 38 000 Ar" },
            ].map((r) => (
              <button
                key={r.from + r.to}
                onClick={() => {
                  setSearch({ from: r.from, to: r.to });
                  navigate({ to: "/resultats" });
                }}
                className="group flex flex-col items-start gap-1.5 rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary hover:shadow-sm"
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <span>{r.from}</span>
                  <ArrowLeftRight className="h-3.5 w-3.5 text-primary" />
                  <span>{r.to}</span>
                </div>
                <span className="text-xs text-muted-foreground">{r.price}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trust */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Place garantie",
              desc: "Votre siège réservé est sécurisé jusqu'à l'embarquement.",
            },
            {
              icon: Clock,
              title: "Départs à l'heure",
              desc: "Discipline d'exploitation et ponctualité sur toutes nos lignes.",
            },
            {
              icon: Sparkles,
              title: "Service moderne",
              desc: "Réservation mobile, billets digitaux, suivi en temps réel.",
            },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className="rounded-xl border border-border bg-card p-4"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">{t.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </AppLayout>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-xl border border-border bg-background px-4 py-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3 text-primary" />
        {label}
      </span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
