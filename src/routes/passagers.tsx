import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useBooking } from "@/lib/booking-store";
import { User, Phone, IdCard, CheckCircle2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/passagers")({
  head: () => ({
    meta: [
      { title: "Informations passagers — KOP-V" },
      {
        name: "description",
        content: "Saisissez les informations des passagers pour finaliser votre réservation.",
      },
    ],
  }),
  component: PassengersPage,
});

interface PassengerForm {
  fullName: string;
  phone: string;
  cin: string;
}

function PassengersPage() {
  const navigate = useNavigate();
  const { selectedTrip, selectedSeats, search } = useBooking();
  const count = Math.max(search.passengers, selectedSeats.length, 1);

  const [forms, setForms] = useState<PassengerForm[]>(
    Array.from({ length: count }, () => ({ fullName: "", phone: "", cin: "" })),
  );
  const [errors, setErrors] = useState<Record<number, Partial<PassengerForm>>>({});

  if (!selectedTrip) {
    return (
      <AppLayout>
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <p className="text-base font-semibold text-foreground">Aucun voyage sélectionné</p>
          <Link
            to="/"
            className="mt-4 inline-flex rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            Retour à la recherche
          </Link>
        </div>
      </AppLayout>
    );
  }

  const update = (i: number, field: keyof PassengerForm, value: string) => {
    setForms((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  };

  const autofill = () => {
    setForms((prev) =>
      prev.map((p, i) =>
        i === 0 ? { fullName: "Rakoto Andrianina", phone: "0340000000", cin: "101234567890" } : p,
      ),
    );
    toast.success("Informations remplies depuis votre profil");
  };

  const validate = () => {
    const errs: Record<number, Partial<PassengerForm>> = {};
    forms.forEach((f, i) => {
      const e: Partial<PassengerForm> = {};
      if (f.fullName.trim().length < 3) e.fullName = "Nom requis (3+ caractères)";
      if (!/^[0-9+\s]{8,}$/.test(f.phone)) e.phone = "Numéro invalide";
      if (i === 0 && f.cin && f.cin.length < 10) e.cin = "CIN doit faire 12 chiffres";
      if (Object.keys(e).length) errs[i] = e;
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const submit = () => {
    if (!validate()) {
      toast.error("Veuillez compléter correctement les informations");
      return;
    }
    toast.success("Réservation confirmée ! Un email vous a été envoyé.");
  };

  return (
    <AppLayout>
      <section className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
              Étape 4 / 4
            </p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Informations des passagers
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ces informations figureront sur vos billets et seront vérifiées à l'embarquement.
            </p>
          </div>
          <button
            onClick={autofill}
            className="hidden items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 md:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Remplir avec mon profil
          </button>
        </div>

        <div className="space-y-4">
          {forms.map((f, i) => {
            const seat = selectedSeats[i];
            const err = errors[i] ?? {};
            return (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-5 md:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Passager {i + 1}
                        {i === 0 && (
                          <span className="ml-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                            Principal
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {seat ? `Siège n° ${seat}` : "Aucun siège"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <FormField
                    label="Nom complet"
                    icon={User}
                    value={f.fullName}
                    onChange={(v) => update(i, "fullName", v)}
                    placeholder="Ex. Rakoto Andrianina"
                    error={err.fullName}
                  />
                  <FormField
                    label="Téléphone"
                    icon={Phone}
                    value={f.phone}
                    onChange={(v) => update(i, "phone", v)}
                    placeholder="034 00 000 00"
                    type="tel"
                    error={err.phone}
                  />
                  {i === 0 && (
                    <FormField
                      label="Numéro CIN (long trajet)"
                      icon={IdCard}
                      value={f.cin}
                      onChange={(v) => update(i, "cin", v)}
                      placeholder="12 chiffres"
                      error={err.cin}
                      className="md:col-span-2"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-3 text-[11px] text-muted-foreground">
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
          En continuant, vous acceptez les conditions de transport et la politique d'annulation
          KOP-V.
        </div>

        <div className="flex items-center justify-between border-t border-border pt-5">
          <button
            onClick={() => navigate({ to: "/places" })}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            ← Retour aux places
          </button>
          <button
            onClick={submit}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            Confirmer et payer
          </button>
        </div>
      </section>
    </AppLayout>
  );
}

function FormField({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  className,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        className={`block rounded-xl border bg-background px-4 py-3 transition focus-within:ring-2 focus-within:ring-primary/15 ${
          error ? "border-destructive" : "border-border focus-within:border-primary"
        }`}
      >
        <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <Icon className="h-3 w-3 text-primary" />
          {label}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1 w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/60"
        />
      </label>
      {error && <p className="mt-1 pl-1 text-[11px] font-medium text-destructive">{error}</p>}
    </div>
  );
}