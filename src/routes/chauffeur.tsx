import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bus,
  MapPin,
  Clock,
  CheckCircle2,
  Timer,
  CalendarClock,
  Phone,
  Mail,
  IdCard,
  Star,
  Award,
  TrendingUp,
  Users,
  Route as RouteIcon,
  Wallet,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/chauffeur")({
  head: () => ({
    meta: [
      { title: "Espace Chauffeur — KOP-V" },
      {
        name: "description",
        content:
          "Tableau de bord chauffeur KOP-V : voyages, statistiques et profil professionnel.",
      },
      { property: "og:title", content: "Espace Chauffeur — KOP-V" },
      {
        property: "og:description",
        content: "Gérez vos voyages, votre profil et vos performances sur KOP-V.",
      },
    ],
  }),
  component: ChauffeurPage,
});

type TripStatus = "en_cours" | "arrive" | "a_venir";

interface DriverTrip {
  id: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  vehicle: string;
  plate: string;
  passengers: number;
  capacity: number;
  status: TripStatus;
  revenue: number;
}

const TRIPS: DriverTrip[] = [
  {
    id: "T-2041",
    from: "Antananarivo",
    to: "Antsirabe",
    date: "2026-07-02",
    departure: "07:00",
    arrival: "11:45",
    vehicle: "Sprinter VIP",
    plate: "5487 TAA",
    passengers: 16,
    capacity: 18,
    status: "en_cours",
    revenue: 880000,
  },
  {
    id: "T-2039",
    from: "Antananarivo",
    to: "Fianarantsoa",
    date: "2026-07-01",
    departure: "05:30",
    arrival: "13:10",
    vehicle: "Bus 45 places",
    plate: "2211 TAA",
    passengers: 42,
    capacity: 45,
    status: "arrive",
    revenue: 1050000,
  },
  {
    id: "T-2036",
    from: "Antsirabe",
    to: "Antananarivo",
    date: "2026-06-30",
    departure: "14:30",
    arrival: "19:20",
    vehicle: "Minibus 22 places",
    plate: "8834 TAA",
    passengers: 21,
    capacity: 22,
    status: "arrive",
    revenue: 798000,
  },
  {
    id: "T-2044",
    from: "Antananarivo",
    to: "Toamasina",
    date: "2026-07-03",
    departure: "06:00",
    arrival: "14:30",
    vehicle: "Bus 45 places",
    plate: "2211 TAA",
    passengers: 28,
    capacity: 45,
    status: "a_venir",
    revenue: 700000,
  },
  {
    id: "T-2045",
    from: "Antananarivo",
    to: "Mahajanga",
    date: "2026-07-05",
    departure: "18:00",
    arrival: "05:30",
    vehicle: "Sprinter VIP",
    plate: "5487 TAA",
    passengers: 12,
    capacity: 18,
    status: "a_venir",
    revenue: 660000,
  },
  {
    id: "T-2032",
    from: "Antananarivo",
    to: "Mahanoro",
    date: "2026-06-28",
    departure: "09:15",
    arrival: "16:40",
    vehicle: "Minibus 22 places",
    plate: "8834 TAA",
    passengers: 22,
    capacity: 22,
    status: "arrive",
    revenue: 836000,
  },
];

const STATUS_META: Record<
  TripStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  en_cours: {
    label: "En cours",
    className: "bg-primary/15 text-primary ring-1 ring-primary/30",
    icon: Timer,
  },
  arrive: {
    label: "Arrivé",
    className: "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30",
    icon: CheckCircle2,
  },
  a_venir: {
    label: "À venir",
    className: "bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/30",
    icon: CalendarClock,
  },
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " Ar";
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function ChauffeurPage() {
  const [status, setStatus] = useState<TripStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return TRIPS.filter((t) => {
      if (status !== "all" && t.status !== status) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !t.from.toLowerCase().includes(q) &&
          !t.to.toLowerCase().includes(q) &&
          !t.id.toLowerCase().includes(q) &&
          !t.plate.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [status, query]);

  const stats = useMemo(() => {
    const total = TRIPS.length;
    const done = TRIPS.filter((t) => t.status === "arrive").length;
    const upcoming = TRIPS.filter((t) => t.status === "a_venir").length;
    const revenue = TRIPS.filter((t) => t.status === "arrive").reduce(
      (s, t) => s + t.revenue,
      0,
    );
    const passengers = TRIPS.filter((t) => t.status === "arrive").reduce(
      (s, t) => s + t.passengers,
      0,
    );
    return { total, done, upcoming, revenue, passengers };
  }, []);

  const counts = {
    all: TRIPS.length,
    en_cours: TRIPS.filter((t) => t.status === "en_cours").length,
    a_venir: TRIPS.filter((t) => t.status === "a_venir").length,
    arrive: TRIPS.filter((t) => t.status === "arrive").length,
  };

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
              <span className="text-lg font-bold tracking-tight">KOP</span>
              <span className="text-lg font-light text-muted-foreground">—</span>
              <span className="text-lg font-bold tracking-tight text-primary">V</span>
            </div>
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <Link
              to="/"
              className="rounded-full px-3 py-1.5 text-muted-foreground hover:text-foreground"
            >
              Recherche
            </Link>
            <span className="rounded-full bg-primary px-3 py-1.5 font-medium text-primary-foreground">
              Espace chauffeur
            </span>
          </nav>
          <div className="text-xs text-muted-foreground">
            Support ·{" "}
            <span className="font-medium text-foreground">+261 34 00 000 00</span>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-6 px-6 py-8 lg:grid-cols-[1fr_340px]">
        <main className="min-w-0 space-y-6">
          {/* Dashboard header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Tableau de bord
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight">
                Bonjour, Rakoto Jean
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Voici l'aperçu de vos voyages et performances.
              </p>
            </div>
            <Button variant="outline" size="sm">
              Exporter le rapport
            </Button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard
              icon={RouteIcon}
              label="Voyages totaux"
              value={String(stats.total)}
              hint={`${stats.done} terminés`}
            />
            <StatCard
              icon={Users}
              label="Passagers transportés"
              value={String(stats.passengers)}
              hint="30 derniers jours"
            />
            <StatCard
              icon={Wallet}
              label="Revenus générés"
              value={formatPrice(stats.revenue)}
              hint="Voyages terminés"
            />
            <StatCard
              icon={TrendingUp}
              label="Taux d'occupation"
              value="87%"
              hint="+4% vs semaine passée"
            />
          </div>

          {/* Trips */}
          <section className="rounded-2xl border border-border bg-card shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
              <div>
                <h2 className="text-lg font-semibold">Mes voyages</h2>
                <p className="text-xs text-muted-foreground">
                  Suivez le statut de chacun de vos trajets.
                </p>
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Rechercher ville, ID, plaque…"
                  className="h-9 w-64 pl-9"
                />
              </div>
            </div>

            <div className="p-5">
              <Tabs value={status} onValueChange={(v) => setStatus(v as TripStatus | "all")}>
                <TabsList>
                  <TabsTrigger value="all">Tous ({counts.all})</TabsTrigger>
                  <TabsTrigger value="en_cours">
                    En cours ({counts.en_cours})
                  </TabsTrigger>
                  <TabsTrigger value="a_venir">À venir ({counts.a_venir})</TabsTrigger>
                  <TabsTrigger value="arrive">Arrivés ({counts.arrive})</TabsTrigger>
                </TabsList>

                <TabsContent value={status} className="mt-5 space-y-3">
                  {filtered.length === 0 && (
                    <p className="rounded-lg bg-muted px-4 py-8 text-center text-sm text-muted-foreground">
                      Aucun voyage ne correspond à votre filtre.
                    </p>
                  )}
                  {filtered.map((t) => (
                    <TripRow key={t.id} trip={t} />
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </main>

        {/* Profile sidebar */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="bg-primary px-5 py-4 text-primary-foreground">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">
                Profil chauffeur
              </p>
              <p className="mt-1 text-base font-semibold">Rakoto Jean</p>
            </div>

            <div className="flex flex-col items-center gap-2 border-b border-border px-5 py-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
                RJ
              </div>
              <p className="text-sm font-semibold">Chauffeur senior</p>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-1 text-xs font-semibold text-foreground">4.9</span>
              </div>
              <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-500/30">
                <CheckCircle2 className="h-3 w-3" /> Vérifié KOP-V
              </span>
            </div>

            <div className="space-y-3 border-b border-border p-5 text-sm">
              <InfoRow icon={IdCard} label="Matricule" value="KV-CH-0142" />
              <InfoRow icon={Phone} label="Téléphone" value="+261 34 12 345 67" />
              <InfoRow icon={Mail} label="Email" value="r.jean@kop-v.mg" />
              <InfoRow icon={MapPin} label="Base" value="Gare KOP-V, Tana" />
              <InfoRow icon={Award} label="Ancienneté" value="6 ans" />
            </div>

            <div className="grid grid-cols-2 gap-3 p-5">
              <MiniStat label="Km parcourus" value="128 450" />
              <MiniStat label="Sans incident" value="412 j" />
            </div>

            <div className="border-t border-border p-5">
              <Button className="w-full" size="sm">
                Modifier mon profil
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof Bus;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-xl font-bold tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function TripRow({ trip }: { trip: DriverTrip }) {
  const meta = STATUS_META[trip.status];
  const StatusIcon = meta.icon;
  const occ = Math.round((trip.passengers / trip.capacity) * 100);
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-muted/40">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Bus className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-semibold">
              {trip.from} <span className="text-muted-foreground">→</span> {trip.to}
            </p>
            <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground">
              {trip.id}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {formatDate(trip.date)} · {trip.departure} → {trip.arrival} · {trip.vehicle}{" "}
            ({trip.plate})
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Users className="h-3.5 w-3.5" />
        <span>
          {trip.passengers}/{trip.capacity}
        </span>
        <span className="text-[10px] text-muted-foreground/70">({occ}%)</span>
      </div>

      <div className="text-right">
        <p className="text-sm font-bold text-primary">{formatPrice(trip.revenue)}</p>
      </div>

      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.className}`}
      >
        <StatusIcon className="h-3.5 w-3.5" />
        {meta.label}
      </span>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Bus;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/60 p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold">{value}</p>
    </div>
  );
}