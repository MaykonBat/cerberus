"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import Navbar from "@/components/Navbars/AuthNavbar.js";
import FooterSmall from "@/components/Footers/FooterSmall.js";
import {User} from "commons";
import {Plan} from "commons";
import {Status} from "commons";

import { startPayment } from "@/services/Web3Service";
import { ethers } from "ethers";
import { getJwt, signOut } from "@/services/AuthService";
import { getUser, payUser } from "@/services/UserService";

export default function Activate() {
  const { push } = useRouter();

  const [user, setUser] = useState<User>({} as User);
  const [plan, setPlan] = useState<Plan>({
      name: "Gold",
      id: "Gold",
      tokenSymbol: "WETH",
      tokenAddress: "0xb16F35c0Ae2912430DAc15764477E179D9B9EbEa",
      price: ethers.parseEther("0.001").toString(),
      maxAutomations: 10,
  });
  const [message, setMessage] = useState<string>("");

  const params = useParams();

  
  let wallet: string = "";
  if (params.wallet) {
    if (typeof params.wallet === "string") {
      wallet = params.wallet;
    } else if (Array.isArray(params.wallet) && params.wallet.length > 0) {
      wallet = params.wallet[0];
    }
  } else {
    setMessage("Wallet não encontrada");
  }

  //const wallet: string = typeof params.wallet === "string" ? params.wallet : params.wallet[0];

  useEffect(() => {
    setMessage("Loading payment info...");

    const jwt = getJwt();

    if(!wallet || !jwt || jwt.address.toUpperCase() !== wallet.toUpperCase()){
      signOut();
      return;
    }

    getUser(jwt.address)
    .then(user => {
      if(user.status === Status.ACTIVE){
        push("/dashboard");
        return;
      }

      if(user.status !== Status.BLOCKED){
        signOut();
        return;
      }

      setUser(user);
      setMessage("");
    })
    .catch(err => setMessage(err.response ? JSON.stringify(err.response.data) : err.message));
  }, [wallet]);

  function btnPayClick() {
    setMessage("Please, authorize our recurring charges (monthly, 1 year authorization). Cancel anytime.");
    
    startPayment(plan)
      .then(result => {
        setMessage("Payment authorized. Starting the 1st month charge... wait...");
        return payUser();
      })
      .then(result => push("/dashboard"))
      .catch(err => setMessage(err.response ? JSON.stringify(err.response.data) : err.message));
  }

  return (
    <>
      <Navbar transparent />
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage: "url('/img/register_bg_2.png')",
            }}
          ></div>
          <div className="container mx-auto px-4 h-full">
            <div className="flex content-center items-center justify-center h-full">
              <div className="w-full lg:w-4/12 px-4">
                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                  <div className="rounded-t mb-0 px-6 py-6">
                    <div className="flex content-center items-center justify-center mb-5">
                      <img src="/img/cerberus.png" width={128} />
                    </div>
                    <div className="text-center mb-3">
                      <h6 className="text-blueGray-500 text-sm font-bold">
                        Below is your plan details.
                      </h6>
                    </div>
                    <form>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          User
                        </label>
                        <div>
                          {user.name}
                          <br />
                          {user.address}
                        </div>
                      </div>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Plan
                        </label>
                        <select
                          id="planId"
                          value={plan.id}
                          onChange={(evt) =>
                            setPlan({ ...plan, id: evt.target.value })
                          }
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value={plan.id}>Gold</option>
                        </select>
                      </div>

                      <div className="mt-3">
                        This plan costs{" "}
                        <strong>
                          {plan.tokenSymbol} {`${ethers.formatEther(plan.price)}`}/mo
                        </strong>{" "}
                        and gives you full access to our platform and{" "}
                        <strong>{plan.maxAutomations}</strong> automations.
                      </div>

                      <div className="mt-3">
                        Your las payment was: <strong>Never</strong>
                      </div>

                      <div className="text-center mt-6">
                        <button
                          className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 w-full"
                          type="button"
                          onClick={btnPayClick}
                        >
                          Pay Now!
                        </button>
                        <div>{message}</div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <FooterSmall absolute />
        </section>
      </main>
    </>
  );
}
