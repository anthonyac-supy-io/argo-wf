export interface Brand {
  readonly id: string;
  readonly name: string;
  readonly createdAt: Date;
}
export interface BrandRequest {
  readonly name: string;
  readonly id: string;
  readonly createdAt: Date;
}