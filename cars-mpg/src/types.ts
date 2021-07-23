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

// fix for @tensorflow/tfjs-vis overriding ReactElement type
declare global {
  namespace React {
    interface ReactElement {
      nodeName: any
      attributes: any
      children: any
    }
  }
}
