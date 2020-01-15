export type SeatConfiguration = {
  [key in SeatType]: {
    number: number;
    taken: number;
    seatsId: number;
  };
};

export type SeatType = "firstClass" | "businessClass" | "economyClass";
