import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getOccupiedSeats, useBooking } from "@/lib/booking-store";
import { Clock, Info, ArrowRight, Armchair } from "lucide-react";

export const Route = createFileRoute("/places")({
  head: () => ({
    meta: [
      { title: "Choix des places — KOP-V" },
      {
        name: "description",
        content: "Sélectionnez vos places dans le véhicule. Verrouillage temporaire de 10 minutes.",
      },
    ],
  }),
  component: SeatsPage,
});

function SeatsPage() {
  const navigate = useNavigate();
  const { selectedTrip, search, selectedSeats, toggleSeat } = useBooking();
  const [timeLeft, setTimeLeft] = useState(10 * 60);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  if (!selectedTrip) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-base font-semibold text-foreground">Aucun voyage sélectionné</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Veuillez d'abord choisir un voyage.
          </p>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Retour à la recherche
          </Link>
        </div>
      </AppLayout>
    );
  }

  const total = selectedTrip.totalSeats;
  const occupied = getOccupiedSeats(selectedTrip.id, total);

  // Layout: 2 + aisle + 2 seats per row → adjust if 18 (1+aisle+2 = 3 cols, 6 rows)
  const cols = total <= 18 ? 3 : 4;
  const aisleAfter = cols === 3 ? 0 : 1; // index after which to insert aisle
  const rows = Math.ceil(total / cols);

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  const enoughSelected = selectedSeats.length === search.passengers;

  return (
    <AppLayout>
      <section className="space-y-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
            Étape 3 / 4
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Choisissez vos places
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {selectedTrip.company} · {selectedTrip.vehicle} · départ {selectedTrip.departure}
          </p>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3 rounded-xl border border-accent bg-accent/40 px-4 py-3">
          <Clock className="h-4 w-4 text-accent-foreground" />
          <p className="text-xs text-accent-foreground">
            Vos places sont réservées temporairement pendant
            <span className="mx-1 font-mono font-bold">
              {mm}:{ss}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_220px]">
          {/* Seat map */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mx-auto max-w-xs">
              {/* Vehicle frame */}
              <div className="rounded-t-[3rem] rounded-b-2xl border-2 border-border bg-background p-5">
                {/* Driver */}
                <div className="mb-5 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
                    🚗
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Avant
                  </span>
                </div>

                {/* Seats grid */}
                <div className="space-y-2">
                  {Array.from({ length: rows }).map((_, r) => (
                    <div
                      key={r}
                      className="grid items-center gap-2"
                      style={{
                        gridTemplateColumns:
                          cols === 3
                            ? "1fr 16px 1fr 1fr"
                            : "1fr 1fr 16px 1fr 1fr",
                      }}
                    >
                      {Array.from({ length: cols + 1 }).map((__, idx) => {
                        // gap column position
                        const gapIdx = aisleAfter + 1;
                        if (idx === gapIdx) {
                          return <div key={`g-${r}-${idx}`} className="h-8" />;
                        }
                        const seatPosInRow = idx > gapIdx ? idx - 1 : idx;
                        const seatNum = r * cols + seatPosInRow + 1;
                        if (seatNum > total)
                          return <div key={`e-${r}-${idx}`} className="h-9" />;
                        const isOccupied = occupied.includes(seatNum);
                        const isSelected = selectedSeats.includes(seatNum);
                        return (
                          <button
                            key={seatNum}
                            disabled={isOccupied}
                            onClick={() => toggleSeat(seatNum)}
                            className={`group relative flex h-9 items-center justify-center rounded-md text-[11px] font-bold transition ${
                              isOccupied
                                ? "cursor-not-allowed bg-destructive/80 text-destructive-foreground opacity-70"
                                : isSelected
                                  ? "scale-105 bg-[var(--seat-selected)] text-white shadow-md ring-2 ring-[var(--seat-selected)]/30"
                                  : "bg-[var(--seat-free)] text-[var(--seat-free-fg)] hover:scale-105 hover:shadow"
                            }`}
                          >
                            {seatNum}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-[11px]">
              <LegendDot color="var(--seat-free)" label="Disponible" />
              <LegendDot color="var(--seat-selected)" label="Sélectionné" />
              <LegendDot color="var(--seat-occupied)" label="Occupé" />
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Sélection
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {selectedSeats.length} / {search.passengers} place
                {search.passengers > 1 ? "s" : ""}
              </p>
              {selectedSeats.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
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
              ) : (
                <p className="mt-2 text-xs text-muted-foreground">
                  Touchez un siège pour le sélectionner.
                </p>
              )}
            </div>

            <div className="flex gap-2 rounded-xl border border-border bg-muted/40 p-3 text-[11px] text-muted-foreground">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
              <p>
                Le verrouillage des sièges expire après 10 minutes pour éviter le surbooking.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
              <Armchair className="h-3.5 w-3.5 text-primary" />
              {total} sièges au total
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-5">
          <button
            onClick={() => navigate({ to: "/resultats" })}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            ← Retour
          </button>
          <button
            disabled={!enoughSelected}
            onClick={() => navigate({ to: "/passagers" })}
            className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:opacity-90"
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </AppLayout>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <span
        className="inline-block h-4 w-4 rounded-md"
        style={{ backgroundColor: color }}
      />
      {label}
    </div>
  );
}