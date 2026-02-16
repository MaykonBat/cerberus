import { ChainId, Status } from "commons";
import { UserService } from "../../src/user/user.service";

export type userModel = { 
    address: string;
    name: string;
    email: string;
    id: string;
    activationCode: string;
    activationDate: Date;
    network: number;
    planId: string;
    privateKey: string;
    status: number;
}

export const newUserMock = {
    address: "0x123",
    name: "BlueAlien",
    email: "123@fkfms.com.br",
    id: "abc123",
    activationCode: "123456",
    activationDate: new Date(),
    network: ChainId.MAINNET,
    planId: "Gold",
    privateKey: "abc123",
    status: Status.NEW
} as userModel;

export const blockedUserMock = {
    ...newUserMock,
    status: Status.BLOCKED
}

export const activeUserMock = {
    ...newUserMock,
    status: Status.ACTIVE
}

export const bannedUserMock = {
    ...newUserMock,
    status: Status.BANNED
}

export const userServiceMock = {
    provide: UserService,
    useValue: {
        getUserByWallet: jest.fn().mockResolvedValue(activeUserMock),
        getUser: jest.fn().mockResolvedValue(activeUserMock),
        activateUser: jest.fn().mockResolvedValue(blockedUserMock),
        updateUser: jest.fn().mockResolvedValue(activeUserMock),
        addUser: jest.fn().mockResolvedValue(newUserMock),
        payUser: jest.fn().mockResolvedValue(activeUserMock),
    }
}