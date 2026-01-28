import { Contract } from "ethers";
import {JWT} from "commons";
import { Plan } from "commons";
import { Status } from "commons";
import ConfigService from "./ConfigService";
import { BrowserProvider } from "ethers";
import ERC20_ABI from "../../../packages/commons/src/services/ERC20.json";

function getProvider() {
  if (!window.ethereum) throw new Error(`No MetaMask found!`);
  return new BrowserProvider(window.ethereum);
}

export async function getWallet(): Promise<string> {
  const provider = getProvider();
  const accounts = await provider.send("eth_requestAccounts", []);

  if(!accounts || !accounts.length) throw new Error(`MetaMask not allowed!`);

  const wallet = accounts[0];
  localStorage.setItem("wallet", wallet);
  return wallet;
}

export async function doLogin(): Promise<JWT | undefined> {

  const timestamp = Date.now();
  const message = ConfigService.getAuthMsg();
  const wallet = await getWallet();
  const provider = getProvider();
  const signer = await provider.getSigner();

  const challenge = await signer.signMessage(message);
  console.log(challenge);

  //TODO: enviar timestamp, wallet e challenge para o backend

  return {
    address: "0x3dC608b4eF45A6EA123AB6446fCC7e6235ef8848",
    name: "Blue Alien",
    planId: "Gold",
    status: Status.ACTIVE,
    userId: "123"
  } as JWT;
}

export async function startPayment(plan: Plan): Promise<boolean>{
  const provider = getProvider();
  const signer = await provider.getSigner();
  const tokenContract = new Contract(plan.tokenAddress, ERC20_ABI, signer);
  const tx = await tokenContract.approve(ConfigService.CERBERUS_PAY_CONTRACT, BigInt(plan.price) * 12n); //pré aprovado pra 12 anos
  await tx.wait();
  return true;
}