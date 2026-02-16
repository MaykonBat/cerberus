import { Test, TestingModule } from '@nestjs/testing';
import {
  activeUserMock,
  userServiceMock,
} from '../user/user.service.mock';
import { UserDTO } from 'src/user/user.dto';
import { Status } from 'commons';
import {
  ForbiddenException,
} from '@nestjs/common';
import { UserController } from '../../src/user/user.controller';
import { authServiceMock } from '../../test/auth/auth.service.mock';

describe('UserController Tests', () => {
  let userController: UserController;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [userServiceMock, authServiceMock],
    }).compile();

    userController = moduleFixture.get<UserController>(UserController);
  });

  it('Should be Defined', () => {
    expect(userController).toBeDefined();
  });

  it('Should get user by wallet', async () => {
    const result = await userController.getUser(
      'authorization',
      activeUserMock.address,
    );
    expect(result).toBeDefined();
    expect(result.address).toEqual(activeUserMock.address);
  });

  it('Should NOT get user by wallet', async () => {
    await expect(
      userController.getUser('authorization', '0x456'),
    ).rejects.toEqual(new ForbiddenException());
  });

  it('Should get user by id', async () => {
    const result = await userController.getUser(
      'authorization',
      activeUserMock.id,
    );
    expect(result).toBeDefined();
    expect(result.id).toEqual(activeUserMock.id);
  });

  it('Should NOT get user by id', async () => {
    await expect(
      userController.getUser('authorization', 'abc456'),
    ).rejects.toEqual(new ForbiddenException());
  });

  it('Should update user', async () => {
    const result = await userController.updateUser(
      activeUserMock.id,
      'authorization',
      { ...activeUserMock } as UserDTO,
    );
    expect(result).toBeDefined();
    expect(result.id).toEqual(activeUserMock.id);
  });

  it('Should NOT update user', async () => {
    await expect(
      userController.updateUser('abc456', 'authorization', {
        ...activeUserMock,
      } as UserDTO),
    ).rejects.toEqual(new ForbiddenException());
  });

  it('Should pay user', async () => {
    const result = await userController.pay('authorization');
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.ACTIVE);
  });
});
