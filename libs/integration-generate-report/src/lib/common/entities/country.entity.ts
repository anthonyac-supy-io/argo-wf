import { CountryAlpha2, Currency, IANATimezone } from '@supy.api/dictionaries';

export enum CountryState {
  active = 'active',
  deleted = 'deleted',
}

export interface Country {
  readonly id: string;
  readonly name: string;
  readonly code: CountryAlpha2;
  readonly vat?: number;
  readonly currency?: Currency;
  readonly state: CountryState;
  readonly ianaTimeZone?: IANATimezone;
}
