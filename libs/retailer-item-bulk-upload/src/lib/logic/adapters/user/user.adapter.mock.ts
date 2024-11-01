import { GetUserPayload, GetUserResponse, UserState } from './exchanges';

export const userAdapterMock = {
  getUserById: jest.fn<GetUserResponse, [id: GetUserPayload]>(({ id }) => ({
    id,
    firstName: 'John',
    lastName: 'Doe',
    photoUrl: 'https://example.com/johndoe.jpg',
    email: 'johndoe@example.com',
    phone: '1234567890',
    state: UserState.active,
    settings: {
      chat: true,
      order: true,
      showApproxPrice: false,
      sendNewOrderEmail: true,
    },
    createdAt: new Date('2022-01-01'),
    updatedAt: new Date('2022-01-02'),
  })),
};
