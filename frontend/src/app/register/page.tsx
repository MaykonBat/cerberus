"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbars/AuthNavbar.js";
import FooterSmall from "@/components/Footers/FooterSmall.js";

import {getWallet} from "@/services/Web3Service";

type NewUser = {
    name: string;
    email: string;
    checkTos: boolean;
}

export default function Register() {
  const { push } = useRouter();

  const [user, setUser] = useState<NewUser>({
    name: "",
    email: "",
    checkTos: false
  });
  const [message, setMessage] = useState<string>("");

  function onUserChange(evt: React.ChangeEvent<HTMLInputElement>){
    setUser((prevState: any) => ({ ...prevState, [evt.target.id]: evt.target.value }));
  }

  async function register(){
    setMessage("Saving... wait...");

    if(!user.checkTos) {
      setMessage("You must read and accept the Terms of Service");
      return;
    }

    let wallet = localStorage.getItem("wallet");
    if(!wallet){
      try{
        wallet = await getWallet();
      } catch (err: any) {
        setMessage(err.message);
        return;
      }
    }

    console.log(wallet);

    //TODO: cadastrar via backend

    push("/register/activate?wallet=" + wallet);
  }

  function btnSaveClick() {
    register();
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
                        Sign up filling the form below. Your Metamask will
                        prompt to save.
                      </h6>
                    </div>
                    <form>
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={user ? user.name : ""}
                          onChange={onUserChange}
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Name"
                        />
                      </div>

                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="grid-password"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={user ? user.email : ""}
                          onChange={onUserChange}
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Email"
                        />
                      </div>

                      <div>
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            id="checkTos"
                            type="checkbox"
                            checked={user ? user.checkTos : false}
                            onChange={onUserChange}
                            className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                          />
                          <span className="ml-2 text-sm font-semibold text-blueGray-600">
                            I agree with the Privacy Policy
                          </span>
                        </label>
                      </div>

                      <div className="text-center mt-6">
                        <button
                          className="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 w-full"
                          type="button"
                          onClick={btnSaveClick}
                        >
                          Create Account
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
