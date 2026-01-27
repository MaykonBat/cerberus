import React, { useState, useEffect } from "react";
import { generateAvatarURL } from "@cfx-kit/wallet-avatar";

const UserDropdown = () => {
  const [wallet, setWallet] = useState<string>("");

  useEffect(() => {
    const wallet = localStorage.getItem("wallet");
    setWallet(wallet ? wallet : "");
  }, []);

  return (
    <>
      <a className="text-blueGray-500 block" href="/settings">
        <div className="items-center flex">
          <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
            <img
              alt={wallet}
              className="w-full rounded-full align-middle border-none shadow-lg"
              src={generateAvatarURL(wallet)}
            />
          </span>
        </div>
      </a>
    </>
  );
};

export default UserDropdown;
