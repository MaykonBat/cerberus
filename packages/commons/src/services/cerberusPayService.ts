import {ethers} from "ethers";

import { abi as ABI } from "./CerberusPay.json"

import ConfigBase from "../config/configBase";

function getProvider() : ethers.JsonRpcProvider {
    return new ethers.JsonRpcProvider(ConfigBase.RPC_NODE);
}

function getContract() : ethers.Contract {
    const provider = getProvider();
    return new ethers.Contract(ConfigBase.CERBERUS_PAY_CONTRACT, ABI, provider);
}

 function getSigner() : ethers.Contract {
    const provider = getProvider();
    const signer = new ethers.Wallet(ConfigBase.ADMIN_PRIVATE_KEY, provider);
    console.log("BACKEND SIGNER:", signer.getAddress());
    return new ethers.Contract(ConfigBase.CERBERUS_PAY_CONTRACT, ABI, signer);
}

export function getCustomers() : Promise<string[]>{
    return getContract().getCustomers();
}

export function getCustomerNextPayment(customer: string) : Promise<number>{
    return getContract().payments(customer);
}

export async function pay(customer: string) : Promise<string> {
    console.log('[CHAIN] Paying customer:', customer);

    const contract = getSigner();
    console.log('[CHAIN] Contract:', contract.target);

    const nextPayment = await contract.payments(customer);
    console.log("Next Payment timestamp:", nextPayment.toString());
    console.log("Now:", Math.floor(Date.now() / 1000));
    
    const tx : ethers.TransactionResponse = await contract.pay(customer);
    console.log('[CHAIN] Tx sent:', tx.hash);

    const receipt = await tx.wait();

    console.log("Tx Status: ", receipt?.status);
    console.log("Logs: ", receipt?.logs.length);
    console.log('[CHAIN] Tx confirmed');

    return tx.hash;
}