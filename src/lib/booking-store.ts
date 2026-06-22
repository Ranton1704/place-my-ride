import { create } from "zustand";

export type TripClass = "Standard" | "Confort" | "VIP";

export interface Trip {
  id: string;
  company: string;
  from: string;
  to: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  seatsLeft: number;
  totalSeats: number;
  vehicle: string;
  classe: TripClass;
}

export interface Passenger {
  fullName: string;
  phone: string;
  cin: string;
}

interface SearchParams {
  from: string;
  to: string;
  date: string;
  passengers: number;
}

interface BookingState {
  search: SearchParams;
  setSearch: (s: Partial<SearchParams>) => void;
  swapCities: () => void;
  selectedTrip: Trip | null;
  setTrip: (t: Trip | null) => void;
  selectedSeats: number[];
  toggleSeat: (n: number) => void;
  clearSeats: () => void;
  passengers: Passenger[];
  setPassenger: (i: number, p: Partial<Passenger>) => void;
}

const today = new Date().toISOString().slice(0, 10);

export const useBooking = create<BookingState>((set) => ({
  search: { from: "Antananarivo", to: "Antsirabe", date: today, passengers: 1 },
  setSearch: (s) => set((st) => ({ search: { ...st.search, ...s } })),
  swapCities: () =>
    set((st) => ({
      search: { ...st.search, from: st.search.to, to: st.search.from },
    })),
  selectedTrip: null,
  setTrip: (t) => set({ selectedTrip: t, selectedSeats: [] }),
  selectedSeats: [],
  toggleSeat: (n) =>
    set((st) => {
      const has = st.selectedSeats.includes(n);
      if (has) return { selectedSeats: st.selectedSeats.filter((s) => s !== n) };
      const max = st.search.passengers;
      if (st.selectedSeats.length >= max) {
        return { selectedSeats: [...st.selectedSeats.slice(1), n] };
      }
      return { selectedSeats: [...st.selectedSeats, n] };
    }),
  clearSeats: () => set({ selectedSeats: [] }),
  passengers: [],
  setPassenger: (i, p) =>
    set((st) => {
      const list = [...st.passengers];
      list[i] = { ...(list[i] ?? { fullName: "", phone: "", cin: "" }), ...p };
      return { passengers: list };
    }),
}));

export const CITIES = [
  "Antananarivo",
  "Antsirabe",
  "Toamasina",
  "Fianarantsoa",
  "Mahajanga",
  "Mahanoro",
];

export function generateTrips(from: string, to: string, date: string): Trip[] {
  const companies = ["KOP-V Express", "KOP-V Confort", "KOP-V Premium"];
  const classes: TripClass[] = ["Standard", "Confort", "VIP"];
  const vehicles = ["Bus 45 places", "Minibus 22 places", "Sprinter VIP 18 places"];
  const basePrices = [25000, 38000, 55000];
  const times = [
    ["05:30", "10:15"],
    ["07:00", "11:45"],
    ["09:15", "14:00"],
    ["12:00", "16:50"],
    ["14:30", "19:20"],
    ["18:00", "22:45"],
  ];
  return times.map((t, i) => {
    const ci = i % 3;
    return {
      id: `${from}-${to}-${date}-${i}`,
      company: companies[ci],
      from,
      to,
      date,
      departure: t[0],
      arrival: t[1],
      duration: "4h 45min",
      price: basePrices[ci] + (i % 2) * 2000,
      seatsLeft: [12, 5, 22, 3, 18, 9][i],
      totalSeats: [45, 22, 18, 45, 22, 18][i],
      vehicle: vehicles[ci],
      classe: classes[ci],
    };
  });
}

// Pre-occupied seats per trip (deterministic from id)
export function getOccupiedSeats(tripId: string, total: number): number[] {
  let h = 0;
  for (let i = 0; i < tripId.length; i++) h = (h * 31 + tripId.charCodeAt(i)) >>> 0;
  const occ: number[] = [];
  const n = Math.floor(total * 0.35);
  for (let i = 0; i < n; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const s = (h % total) + 1;
    if (!occ.includes(s)) occ.push(s);
  }
  return occ;
}