import { Contract } from "ethers";
import {JWT} from "commons";
import { Plan } from "commons";
import ConfigService from "./ConfigService";
import { BrowserProvider } from "ethers";
import ERC20_ABI from "../../../packages/commons/src/services/ERC20.json";
import { Auth, parseJwt, signIn } from "./AuthService";

function getProvider() {
  const { ethereum } = window as any;

  if (!ethereum) {
    throw new Error("No wallet found");
  }

  // if there is multiple providers
  if (ethereum.providers && Array.isArray(ethereum.providers)) {
    const metaMaskProvider = ethereum.providers.find(
      (provider: any) => provider.isMetaMask
    );

    if (metaMaskProvider) {
      return new BrowserProvider(metaMaskProvider);
    }
  }

  // fallback
  if (ethereum.isMetaMask) {
    return new BrowserProvider(ethereum);
  }

  throw new Error("MetaMask not found");
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

  const token = await signIn({
    secret: challenge,
    timestamp,
    wallet
  } as Auth);

  localStorage.setItem("token", token);
  console.log(token);

  return parseJwt(token);
}

export async function startPayment(plan: Plan): Promise<boolean>{
  const provider = getProvider();
  const signer = await provider.getSigner();
  const tokenContract = new Contract(plan.tokenAddress, ERC20_ABI, signer);
  const tx = await tokenContract.approve(ConfigService.CERBERUS_PAY_CONTRACT, BigInt(plan.price) * 12n); //pré aprovado pra 12 anos
  await tx.wait();
  return true;
}