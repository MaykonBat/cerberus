import { AuthService } from '../../src/auth/auth.service';
import { JWT, Status } from 'commons';

export const jwtMock = {
  address: '0x123',
  name: 'Blue Alien',
  planId: 'Gold',
  status: Status.ACTIVE,
  userId: 'abc123',
} as JWT;

export const authServiceMock = {
  provide: AuthService,
  useValue: {
    createToken: jest.fn().mockResolvedValue('123456'),
    decodeToken: jest.fn().mockReturnValue(jwtMock),
    checkToken: jest.fn().mockResolvedValue(true),
  },
};
