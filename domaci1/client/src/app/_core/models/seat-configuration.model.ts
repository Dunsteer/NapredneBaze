export type SeatConfiguration = {
  [key in SeatType]: {
    number: number;
    taken: number;
  };
};

export type SeatType = "firstClass" | "businessClass" | "economyClass";
