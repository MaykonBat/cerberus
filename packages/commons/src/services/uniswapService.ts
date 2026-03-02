import axios from "axios";
import ConfigBase from "../config/configBase";
import { PoolData, SwapData, TokenData } from "./uniswapTypes";
import { User } from "../models/user";
import { ethers } from "ethers";
import { TransactionResponse } from "ethers";
import Automation from "../models/automation";
import Pool from "../models/pool";
import { TransactionReceipt } from "ethers";

const ABI_ERC20 = require("./ERC20.json");
const ABI_UNISWAP = require("./Uniswap.json");

export async function getTokens(skip: number): Promise<TokenData[]> {
  const query = `
        {
            tokens(first: 1000, skip: ${skip})
            {
                symbol,
                id,
                decimals,
                name
            }
        }
    `;

  const { data } = await axios.post(ConfigBase.UNISWAP_GRAPH_URL, { query });
  return data.data ? (data.data.tokens as TokenData[]) : [];
}

export async function getTopPools(
  count: number = 20,
  skip: number = 0,
): Promise<PoolData[]> {
  const query = `
        {
            pools(first: ${count}, skip: ${skip}, orderBy: volumeUSD, orderDirection: desc)
            {
                id,
                volumeUSD,
                feeTier,
                token0Price,
                token1Price,
                token0 {
                    symbol, 
                    id,
                    decimals
                },
                token1 {
                    symbol,
                    id,
                    decimals
                }
            }
        }
    `;

  const { data } = await axios.post(ConfigBase.UNISWAP_GRAPH_URL, { query });
  return data.data ? (data.data.pools as PoolData[]) : [];
}

export async function preApprove(
  user: User,
  tokenToApprove: string,
  amountInWei: string,
) {
  if (!user.privateKey) throw new Error(`User doesn't have private key.`);

  const provider = new ethers.JsonRpcProvider(ConfigBase.RPC_NODE);
  const signer = new ethers.Wallet(user.privateKey, provider);

  const tokenContract = new ethers.Contract(tokenToApprove, ABI_ERC20, signer);

  const tx: TransactionResponse = await tokenContract.approve(
    ConfigBase.UNISWAP_ROUTER,
    amountInWei,
  );
  console.log("[COMMONS] Approve Tx: " + tx.hash);

  await tx.wait();
}

export async function approve(
  tokenContract: ethers.Contract,
  amountInWei: string | bigint,
) {
  const tx: TransactionResponse = await tokenContract.approve(
    ConfigBase.UNISWAP_ROUTER,
    amountInWei,
  );
  console.log("[COMMONS] Approve Tx: " + tx.hash);

  await tx.wait();
}

export async function getAllowance(
  tokenAddress: string,
  wallet: string,
): Promise<bigint> {
  const provider = new ethers.JsonRpcProvider(ConfigBase.RPC_NODE);
  const tokenContract = new ethers.Contract(tokenAddress, ABI_ERC20, provider);
  return tokenContract.allowance(wallet, ConfigBase.UNISWAP_ROUTER);
}

export async function swap(
  user: User,
  automation: Automation,
  pool: Pool,
): Promise<SwapData | null> {
  if (!user.privateKey) return null;

  const provider = new ethers.JsonRpcProvider(ConfigBase.RPC_NODE);
  const signer = new ethers.Wallet(user.privateKey, provider);

  const routerContract = new ethers.Contract(
    ConfigBase.UNISWAP_ROUTER,
    ABI_UNISWAP,
    signer,
  );
  const token0Contract = new ethers.Contract(pool.token0, ABI_ERC20, signer);
  const token1Contract = new ethers.Contract(pool.token1, ABI_ERC20, signer);

  const condition = automation.isOpened
    ? automation.closeCondition
    : automation.openCondition;
  if (!condition) return null;

  const isPrice0Condition = condition.field.indexOf("price0") !== -1;
  const [tokenIn, tokenOut] = isPrice0Condition
    ? [token1Contract, token0Contract]
    : [token0Contract, token1Contract];

  const amountIn = BigInt(automation.nextAmount);

  const allowance = await getAllowance(tokenIn.target.toString(), user.address);
  if (allowance < amountIn) await approve(tokenIn, amountIn);

  const params = {
    tokenIn: tokenIn.target,
    tokenOut: tokenOut.target,
    fee: pool.fee,
    recipient: user.address,
    deadline: Math.floor(Date.now() / 1000) + 10,
    amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  console.log(params);

  const nonce = await provider.getTransactionCount(user.address, "latest");
  console.log("[COMMONS] Using nonce:", nonce);

  const tx: TransactionResponse = await routerContract.exactInputSingle(
    params,
    {
      nonce,
      from: user.address,
      gasPrice: ethers.parseUnits("25", "gwei"),
      gasLimit: 250000,
    },
  );

  console.log("Swap Tx Id: " + tx.hash);

  let amountOutWei: bigint = 0n;

  try {
    const receipt: TransactionReceipt | null = await tx.wait();
    if (!receipt) throw new Error(`Swap Error. Tx Id: ${tx.hash}`);

    amountOutWei = ethers.toBigInt(receipt.logs[0].data);
    if (!amountOutWei) throw new Error(`Swap Error. Tx Id: ${tx.hash}`);
  } catch (err: any) {
    console.error(err);
    throw new Error(`Swap Error. Tx Id: ${tx.hash}`);
  }

  console.log(`Swap Success! Tx Id: ${tx.hash}. Amount Out: ${amountOutWei}`);

  return {
    tokenIn: tokenIn.target.toString(),
    tokenOut: tokenOut.target.toString(),
    amountIn: amountIn.toString(),
    amountOut: amountOutWei.toString(),
    price: isPrice0Condition ? pool.price0 : pool.price1,
  } as SwapData;
}
