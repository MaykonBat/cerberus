"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Navbar from "@/components/Navbars/AuthNavbar.js";
import FooterSmall from "@/components/Footers/FooterSmall.js";
import { activate, signOut } from "@/services/AuthService";

export default function Activate() {
  const { push } = useRouter();

  const searchParams = useSearchParams();

  const [code, setCode] = useState<string>(searchParams.get("code") || "");
  const [wallet, setWallet] = useState<string>(
    searchParams.get("wallet") || "",
  );
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    if (code && code.length === 6 && wallet) {
      activate(wallet, code)
        .then((token) => {
          localStorage.setItem("token", token);
          push("/pay/" + wallet);
        })
        .catch((err) =>
          setMessage(
            err.response ? JSON.stringify(err.response.data) : err.message,
          ),
        );
      return;
    } else if (!wallet) {
      const address = localStorage.getItem("wallet");
      if (address) setWallet(address);
      else signOut();
    }
  }, [code, wallet]);

  function btnActivateClick() {
    if (!code || code.length < 6) {
      setMessage("The activation code must have 6 digits.");
      return;
    }

    setMessage("Activating... wait...");
    const address = localStorage.getItem("wallet");
    if (address) {
      activate(wallet, code)
        .then((token) => {
          localStorage.setItem("token", token);
          push("/pay/" + wallet);
        })
        .catch((err) =>
          setMessage(
            err.response ? JSON.stringify(err.response.data) : err.message,
          ),
        );
    } else signOut();
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
                        We sent you a code by email right now. Fill below the 6
                        numbers.
                      </h6>
                    </div>
                    <form>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Code
                        </label>
                        <input
                          type="number"
                          id="code"
                          value={code}
                          onChange={(evt) => setCode(evt.target.value)}
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="000000"
                        />
                      </div>

                      <div className="text-center mt-6">
                        <button
                          className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 w-full"
                          type="button"
                          onClick={btnActivateClick}
                        >
                          Activate Account
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
