import { Expose, Type } from "class-transformer";

export enum UomType {
  Base = 'Base',
  Product = 'Product',
}

export enum UomCategory {
  Volume = 'Volume',
  Weight = 'Weight',
  Length = 'Length',
  Quantity = 'Quantity',
}
export class Uom {
  @Expose()
  readonly id: string;

  @Expose()
  readonly name: string;

  @Expose()
  @Type(() => String)
  readonly type: UomType;

  @Expose()
  @Type(() => String)
  readonly category: UomCategory;

  @Expose()
  readonly conversionToAtom?: number;

  @Expose()
  readonly isPiece?: boolean;
}
