import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../src/user/user.service';
import {
  activeUserMock,
  blockedUserMock,
  newUserMock,
  userModel,
} from './user.service.mock';
import { prismaMock } from '../db.mock';
import { UserDTO } from 'src/user/user.dto';
import { Status } from 'commons';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('UserService Tests', () => {
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    userService = moduleFixture.get<UserService>(UserService);
  });

  it('Should be Defined', () => {
    expect(userService).toBeDefined();
  });

  it('Should get User by wallet', async () => {
    prismaMock.users.findFirst.mockResolvedValue({
      ...newUserMock,
    } as userModel);

    const result = await userService.getUserByWallet(newUserMock.address);
    expect(result).toBeDefined();
    expect(result.address).toEqual(newUserMock.address);
  });

  it('Should NOT get User by wallet', async () => {
    prismaMock.users.findFirst.mockResolvedValue(null);

    await expect(
      userService.getUserByWallet(newUserMock.address),
    ).rejects.toEqual(new NotFoundException());
  });

  it('Should get User by id', async () => {
    prismaMock.users.findUnique.mockResolvedValue({
      ...newUserMock,
    } as userModel);

    const result = await userService.getUser(newUserMock.id);
    expect(result).toBeDefined();
    expect(result.id).toEqual(newUserMock.id);
  });

  it('Should NOT get User by ID', async () => {
    prismaMock.users.findUnique.mockResolvedValue(null);

    await expect(userService.getUser(newUserMock.id)).rejects.toEqual(
      new NotFoundException(),
    );
  });

  it('Should add User', async () => {
    prismaMock.users.create.mockResolvedValue({ ...newUserMock } as userModel);

    const result = await userService.addUser({ ...newUserMock } as UserDTO);
    expect(result).toBeDefined();
    expect(result.id).toBeTruthy();
  });

  it('Should NOT add User (update instead)', async () => {
    prismaMock.users.update.mockResolvedValue({
      ...newUserMock,
      activationCode: '654321',
      activationDate: new Date(),
    } as userModel);
    prismaMock.users.findFirst.mockResolvedValue({
      ...newUserMock,
    } as userModel);

    const result = await userService.addUser({ ...newUserMock } as UserDTO);
    expect(result).toBeDefined();
    expect(result.activationCode).not.toEqual(newUserMock.activationCode);
    expect(result.activationDate.getTime()).toBeGreaterThan(
      newUserMock.activationDate.getTime(),
    );
  });

  it('Should NOT add User (conflict)', async () => {
    prismaMock.users.findFirst.mockResolvedValue({
      ...activeUserMock,
    } as userModel);

    await expect(
      userService.addUser({ ...newUserMock } as UserDTO),
    ).rejects.toEqual(
      new ConflictException(
        `User already exists with the same wallet or email.`,
      ),
    );
  });

  it('Should pay User', async () => {
    prismaMock.users.update.mockResolvedValue({
      ...activeUserMock,
    } as userModel);
    prismaMock.users.findFirst.mockResolvedValue({
      ...blockedUserMock,
    } as userModel);

    const result = await userService.payUser(blockedUserMock.address);
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.ACTIVE);
  });

  it('Should NOT pay User', async () => {
    prismaMock.users.findFirst.mockResolvedValue({
      ...activeUserMock,
    } as userModel);

    await expect(userService.payUser(blockedUserMock.address)).rejects.toEqual(
      new ForbiddenException(),
    );
  });

  it('Should update User', async () => {
    prismaMock.users.update.mockResolvedValue({ ...newUserMock } as userModel);

    const result = await userService.updateUser(newUserMock.id, {
      ...newUserMock,
    } as UserDTO);
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.NEW);
  });

  it('Should activate User', async () => {
    prismaMock.users.update.mockResolvedValue({
      ...blockedUserMock,
    } as userModel);
    prismaMock.users.findFirst.mockResolvedValue({
      ...newUserMock,
    } as userModel);

    const result = await userService.activateUser(
      newUserMock.address,
      newUserMock.activationCode,
    );
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.BLOCKED);
  });

  it('Should NOT activate User (Activated)', async () => {
    prismaMock.users.findFirst.mockResolvedValue({
      ...activeUserMock,
    } as userModel);

    const result = await userService.activateUser(
      activeUserMock.address,
      activeUserMock.activationCode,
    );
    expect(result).toBeDefined();
    expect(result.status).toEqual(Status.ACTIVE);
  });

  it('Should NOT activate User (wrong code)', async () => {
    prismaMock.users.findFirst.mockResolvedValue({
      ...newUserMock,
      activationCode: '654321',
    } as userModel);

    await expect(
      userService.activateUser(newUserMock.address, newUserMock.activationCode),
    ).rejects.toEqual(new UnauthorizedException(`Wrong activation code.`));
  });

  it('Should NOT activate User (outdated code)', async () => {
    const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);
    prismaMock.users.findFirst.mockResolvedValue({
      ...newUserMock,
      activationDate: oneHourAgo,
    } as userModel);

    await expect(
      userService.activateUser(newUserMock.address, newUserMock.activationCode),
    ).rejects.toEqual(new UnauthorizedException(`Activation code expired.`));
  });
});
