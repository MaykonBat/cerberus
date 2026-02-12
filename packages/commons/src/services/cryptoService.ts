const aes = require("aes-js");
//import { ethers } from "ethers";
import ConfigBase from "../config/configBase";

function getKey() {
    const key = aes.utils.utf8.toBytes(ConfigBase.AES_KEY);
    if (key.length !== 32)
        throw new Error("Invalid key size for AES. Must be 32 bytes");
    return key;
}

export function encrypt(text: string): string {
    const key = getKey();
    const bytesInfo = aes.utils.utf8.toBytes(text);
    const aesCtr = new aes.ModeOfOperation.ctr(key);
    const encryptedBytes = aesCtr.encrypt(bytesInfo);
    return aes.utils.hex.fromBytes(encryptedBytes);
}

export function decrypt(encryptedHex: string): string {
    const key = getKey();
    const encryptedBytes = aes.utils.hex.toBytes(encryptedHex);
    const aesCtr = new aes.ModeOfOperation.ctr(key);
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    return aes.utils.utf8.fromBytes(decryptedBytes);
}

/*
export async function sign(privateKey: string, message: string): Promise<string> {
    const wallet = new ethers.Wallet(privateKey);
    return wallet.signMessage(message);
}

export function verify(originalMessage: string, signature: string): string {
    return ethers.verifyMessage(originalMessage, signature);
}
*/