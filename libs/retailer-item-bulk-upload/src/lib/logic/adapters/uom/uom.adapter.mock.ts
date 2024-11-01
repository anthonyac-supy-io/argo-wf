import { UomCategory, UomType } from '../../../common';
import { GetUomsResponse } from './exchanges';

export const uomAdapterMock = {
  getUoms: jest.fn<GetUomsResponse, undefined>(() => ({
    data: [
      {
        id: '1',
        name: 'Liter',
        type: UomType.Base,
        category: UomCategory.Volume,
        conversionToAtom: 1000,
      },
      {
        id: '2',
        name: 'Gallon',
        type: UomType.Product,
        category: UomCategory.Volume,
        conversionToAtom: 3785.41,
      },
      {
        id: '3',
        name: 'Kg',
        type: UomType.Base,
        category: UomCategory.Weight,
        conversionToAtom: 1000,
      },
      {
        id: '4',
        name: 'Piece',
        type: UomType.Base,
        category: UomCategory.Quantity,
        conversionToAtom: 1,
        isPiece:true
      },
    ],
    metadata: { count: 4, total: 4 },
  })),
};
