"use client";

import React, { useEffect, useState } from "react";

import { getUser, updateUser } from "@/services/UserService";
import Sidebar from "@/components/Sidebar/Sidebar";
import AdminNavBar from "@/components/Navbars/AdminNavbar";
import FooterAdmin from "@/components/Footers/FooterAdmin";
import { User } from "commons";
import { getJwt } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import Alert from "@/components/Alert";

export default function Settings() {
  const { push } = useRouter();

  const [user, setUser] = useState<User>({} as User);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const jwt = getJwt();
    if (!jwt) {
      push("/");
      return;
    }

    getUser(jwt.address)
      .then((user) => setUser({ ...user, privateKey: "" }))
      .catch((err) => setError(err.response ? err.response.data : err.message));
  }, []);

  function onUserChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setUser((prevState: any) => ({
      ...prevState,
      [evt.target.id]: evt.target.value,
    }));
  }

  function btnSaveClick() {
    setIsLoading(true);
    const jwt = getJwt();
    if (!jwt) {
      push("/");
      return;
    }

    updateUser(jwt.userId, user)
      .then((result) => {
        setUser({ ...result, privateKey: "" });
        setIsLoading(false);
        setMessage("Settings saved successfully!");
      })
      .catch((err) => {
        setError(err.response ? err.response.data : err.message);
        setIsLoading(false);
      });
  }

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavBar pageName="settings" />
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap">
            <div className="w-full px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      My account
                    </h6>
                    <button
                      className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={btnSaveClick}
                    >
                      {isLoading ? "Saving..." : "Save Settings..."}
                    </button>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  {message || error ? (
                    <Alert
                      isError={!message}
                      message={error ? error : message}
                    />
                  ) : (
                    <></>
                  )}
                  <form>
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      User Information
                    </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
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
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={user.name || ""}
                            onChange={onUserChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Email address
                          </label>
                          <input
                            type="email"
                            id="email"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={user.email || ""}
                            onChange={onUserChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Plan
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            disabled={true}
                            value={user.planId || ""}
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      Wallet Information
                    </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Network
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            disabled={true}
                            defaultValue="Ethereum"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Exchange
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            disabled={true}
                            defaultValue="Uniswap V3"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={user.address || ""}
                            onChange={onUserChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Private Key
                          </label>
                          <input
                            type="password"
                            id="privateKey"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={user.privateKey || ""}
                            onChange={onUserChange}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
