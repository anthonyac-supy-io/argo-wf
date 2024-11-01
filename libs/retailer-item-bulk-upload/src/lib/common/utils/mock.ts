import { faker } from '@faker-js/faker';

export function getRandomEnumValue<T extends object>(enumType: T): T[keyof T] {
  const enumValues: T[] = Object.values(enumType) as unknown as T[];
  const randomIndex = Math.floor(Math.random() * enumValues.length);

  return enumValues[randomIndex] as T[keyof T];
}

const SUPPLIERS_IDS:string[] = [];

export function getSupplierId(index: number):string {
  if (!SUPPLIERS_IDS[index]) {
    const id = faker.string.uuid();
    SUPPLIERS_IDS[index] = id;
  }

  return SUPPLIERS_IDS[index];
}
