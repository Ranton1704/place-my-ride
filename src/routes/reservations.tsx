import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  Bus,
  Calendar,
  MapPin,
  Search,
  Ticket,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  ArmchairIcon,
  User,
} from "lucide-react";

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Mes réservations — KOP-V" },
      {
        name: "description",
        content:
          "Consultez la liste de vos réservations KOP-V : trajets à venir, confirmés et passés.",
      },
    ],
  }),
  component: ReservationsPage,
});

type ResStatus = "confirmee" | "a_venir" | "terminee" | "annulee";

interface Reservation {
  id: string;
  ref: string;
  client: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  company: string;
  classe: "Standard" | "Confort" | "VIP";
  seats: number[];
  price: number;
  status: ResStatus;
  createdAt: string;
}

const RESERVATIONS: Reservation[] = [
  {
    id: "1",
    ref: "KOPV-2041",
    client: "Rakoto Jean",
    from: "Antananarivo",
    to: "Antsirabe",
    date: "2026-07-12",
    departure: "07:00",
    arrival: "11:45",
    company: "KOP-V Confort",
    classe: "Confort",
    seats: [12, 13],
    price: 76000,
    status: "a_venir",
    createdAt: "2026-07-01",
  },
  {
    id: "2",
    ref: "KOPV-2038",
    client: "Rasoa Miora",
    from: "Antananarivo",
    to: "Toamasina",
    date: "2026-07-08",
    departure: "05:30",
    arrival: "13:15",
    company: "KOP-V Premium",
    classe: "VIP",
    seats: [3],
    price: 55000,
    status: "confirmee",
    createdAt: "2026-06-28",
  },
  {
    id: "3",
    ref: "KOPV-1997",
    client: "Andry Nirina",
    from: "Fianarantsoa",
    to: "Antananarivo",
    date: "2026-06-20",
    departure: "09:15",
    arrival: "17:30",
    company: "KOP-V Express",
    classe: "Standard",
    seats: [22],
    price: 27000,
    status: "terminee",
    createdAt: "2026-06-10",
  },
  {
    id: "4",
    ref: "KOPV-1985",
    client: "Hery Randria",
    from: "Mahajanga",
    to: "Antananarivo",
    date: "2026-06-05",
    departure: "18:00",
    arrival: "06:45",
    company: "KOP-V Confort",
    classe: "Confort",
    seats: [8, 9],
    price: 80000,
    status: "terminee",
    createdAt: "2026-05-25",
  },
  {
    id: "5",
    ref: "KOPV-1972",
    client: "Voahangy Rabe",
    from: "Antananarivo",
    to: "Mahanoro",
    date: "2026-05-30",
    departure: "12:00",
    arrival: "20:15",
    company: "KOP-V Express",
    classe: "Standard",
    seats: [17],
    price: 25000,
    status: "annulee",
    createdAt: "2026-05-20",
  },
];

const STATUS_META: Record<
  ResStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  a_venir: {
    label: "À venir",
    className: "bg-accent text-accent-foreground",
    icon: Clock,
  },
  confirmee: {
    label: "Confirmée",
    className: "bg-primary/15 text-primary",
    icon: CheckCircle2,
  },
  terminee: {
    label: "Terminée",
    className: "bg-secondary text-secondary-foreground",
    icon: CheckCircle2,
  },
  annulee: {
    label: "Annulée",
    className: "bg-destructive/10 text-destructive",
    icon: XCircle,
  },
};

const FILTERS: { key: ResStatus | "all"; label: string }[] = [
  { key: "all", label: "Toutes" },
  { key: "a_venir", label: "À venir" },
  { key: "confirmee", label: "Confirmées" },
  { key: "terminee", label: "Terminées" },
  { key: "annulee", label: "Annulées" },
];

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " Ar";
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function ReservationsPage() {
  const [filter, setFilter] = useState<ResStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return RESERVATIONS.filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        r.ref.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q) ||
        r.from.toLowerCase().includes(q) ||
        r.to.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: RESERVATIONS.length };
    for (const r of RESERVATIONS) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, []);

  const totalSpent = RESERVATIONS.filter((r) => r.status !== "annulee").reduce(
    (s, r) => s + r.price,
    0,
  );

  return (
    <AppLayout>
      <div>
        {/* Hero */}
        <section className="mb-8 flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Espace client
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Mes réservations
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Retrouvez ici l'historique et le suivi de tous vos voyages réservés
              avec KOP-V.
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <div className="grid grid-cols-3 gap-3">
              <MiniKpi label="Total" value={String(RESERVATIONS.length)} icon={Ticket} />
              <MiniKpi
                label="À venir"
                value={String((counts["a_venir"] ?? 0) + (counts["confirmee"] ?? 0))}
                icon={Clock}
              />
              <MiniKpi label="Dépensé" value={formatPrice(totalSpent)} icon={CheckCircle2} />
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
            >
              <Plus className="h-3.5 w-3.5" />
              Réserver un voyage
            </Link>
          </div>
        </section>

        {/* Filters */}
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-1 rounded-lg bg-muted p-1">
            {FILTERS.map((f) => {
              const active = f.key === filter;
              const count = counts[f.key] ?? 0;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                    active
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.label}
                  <span
                    className={`rounded-full px-1.5 text-[10px] ${
                      active ? "bg-primary/15 text-primary" : "bg-background text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Référence, client ou ville…"
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-xs outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Reservation list */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-14 text-center">
            <Ticket className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-base font-semibold text-foreground">
              Aucune réservation trouvée
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Modifiez vos filtres ou lancez une nouvelle recherche de voyage.
            </p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" />
              Réserver un voyage
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => (
              <ReservationCard key={r.id} r={r} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function MiniKpi({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Ticket;
}) {
  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <p className="mt-1 text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

function ReservationCard({ r }: { r: Reservation }) {
  const meta = STATUS_META[r.status];
  const StatusIcon = meta.icon;
  return (
    <article className="group rounded-2xl border border-border bg-card p-5 transition hover:border-primary hover:shadow-md">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        {/* Ref + client */}
        <div className="flex items-center gap-3 md:w-56">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Ticket className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-xs font-semibold text-primary">{r.ref}</p>
            <p className="mt-0.5 flex items-center gap-1 truncate text-sm font-semibold text-foreground">
              <User className="h-3 w-3 text-muted-foreground" />
              {r.client}
            </p>
          </div>
        </div>

        {/* Route */}
        <div className="flex flex-1 items-center gap-4">
          <div className="text-right">
            <p className="text-lg font-bold tabular-nums text-foreground">{r.departure}</p>
            <p className="text-xs text-muted-foreground">{r.from}</p>
          </div>
          <div className="flex flex-1 flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(r.date)}
            </div>
            <div className="relative my-1 h-px w-full bg-border">
              <div className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
              <div className="absolute right-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-primary" />
            </div>
            <span className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {r.company} · {r.classe}
            </span>
          </div>
          <div className="text-left">
            <p className="text-lg font-bold tabular-nums text-foreground">{r.arrival}</p>
            <p className="text-xs text-muted-foreground">{r.to}</p>
          </div>
        </div>

        {/* Seats + price + status */}
        <div className="flex items-center justify-between gap-4 md:w-64 md:flex-col md:items-end">
          <div className="text-right">
            <p className="flex items-center justify-end gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
              <ArmchairIcon className="h-3 w-3" />
              Siège{r.seats.length > 1 ? "s" : ""}
            </p>
            <div className="mt-1 flex flex-wrap justify-end gap-1">
              {r.seats.map((s) => (
                <span
                  key={s}
                  className="inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-accent px-1.5 text-[11px] font-bold text-accent-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-primary">{formatPrice(r.price)}</p>
            <span
              className={`mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${meta.className}`}
            >
              <StatusIcon className="h-3 w-3" />
              {meta.label}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}