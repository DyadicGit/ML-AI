export type Car = {
  passedemissions: string;
  mpg: number;
  cylinders: number;
  displacement: number;
  horsepower: number;
  weight: number;
  acceleration: number;
  modelyear: number;
  carname: string;
};
export type ToUnion<T extends any[]> = T[number];
