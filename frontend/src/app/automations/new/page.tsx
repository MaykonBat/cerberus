"use client";

import React, { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import AdminNavBar from "@/components/Navbars/AdminNavbar";
import FooterAdmin from "@/components/Footers/FooterAdmin";
import { Automation, ChainId, Condition, Exchange, Pool } from "commons";
import { useRouter, useSearchParams } from "next/navigation";
import Alert from "@/components/Alert";
import RadioGroup from "@/components/RadioGroup";
import PoolInput from "./PoolInput";
import ConditionInput from "./ConditionInput";
import { addAutomation, updateAutomation, getAutomation } from "@/services/AutomationService";

import {ethers} from "ethers";
import Toast from "@/components/Toast";

export default function NewAutomation() {
  const { push } = useRouter();

  const queryString = useSearchParams();

  const automationId = queryString.get("id");

  const DEFAULT_AUTOMATION = {
    isOpened: false,
    isActive: false,
    network: ChainId.MAINNET,
    exchange: Exchange.Uniswap,
  } as Automation;

  const [automation, setAutomation] = useState<Automation>(DEFAULT_AUTOMATION);
  const [pool, setPool] = useState<Pool>({} as Pool);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!automationId) return;

    getAutomation(automationId)
      .then(automation => setAutomation(automation))
      .catch(err => setError(err.response ? JSON.stringify(err.response.data) : err.message))
  }, [automationId]);

  function btnSaveClick() {
    if (!automation.name) {
      setError("The automation name is required.");
      return;
    }
    if (!automation.poolId) {
      setError("The automation pool is required.");
      return;
    }

    if (
      !confirm(
        "This action will consume some wei ('approve' function). Are you sure?",
      )
    )
      return;

    setError("");
    setIsLoading(true);

    let promise: Promise<Automation>;

    if (automationId) promise = updateAutomation(automationId, automation);
    else promise = addAutomation(automation);

    promise
      .then((automation) => push("/automations"))
      .catch((err) => {
        setIsLoading(false);
        setError(
          err.response ? JSON.stringify(err.response.data) : err.message,
        );
      });
  }

  function onPoolChange(pool: Pool | null) {
    setAutomation((prevState: any) => ({
      ...prevState,
      poolId: pool ? pool.id : null,
    }));
    setPool(pool || ({} as Pool));
  }

  function onOpenConditionChange(condition: Condition) {
    setAutomation((prevState: any) => ({
      ...prevState,
      openCondition: condition,
    }));
  }

  function onCloseConditionChange(condition: Condition) {
    setAutomation((prevState: any) => ({
      ...prevState,
      closeCondition: condition,
    }));
  }

  function getDecimals(){
    let decimals: number = 18;

    if(pool && pool.decimals0 && pool.decimals1)
      decimals = automation.isOpened ? pool.decimals0 : pool.decimals1;

    return decimals;
  }

  function formatAmount(){
    if(!automation || !automation.nextAmount) return "0";

    const decimals = getDecimals();
    return ethers.formatUnits(automation.nextAmount, decimals) || "0";
  }

  function onAmountChange(evt: React.ChangeEvent<HTMLInputElement>){
    const decimals = getDecimals();
    const amountInWei = ethers.parseUnits(evt.target.value, decimals);
    setAutomation((prevState: any) => ({
      ...prevState,
      nextAmount: amountInWei.toString()
    }));
  }

  function onAutomationChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setAutomation((prevState: any) => ({
      ...prevState,
      [evt.target.id]: evt.target.value,
    }));
  }

  function getAmountToolTip(){
    if(!pool || !automation) return "";
    return automation.isOpened
        ? `(${pool.symbol0 || "Symbol0"} to sell)`
        : `(${pool.symbol1 || "Symbol1"} to buy ${pool.symbol0 || "Symbol0"})`;
  }

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavBar pageName="Automations" />
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap">
            <div className="w-full px-4">
              <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
                <div className="rounded-t bg-white mb-0 px-6 py-6">
                  <div className="text-center flex justify-between">
                    <h6 className="text-blueGray-700 text-xl font-bold">
                      {automationId ? "Edit " : "New "}Automation
                    </h6>
                    <button
                      className="bg-blueGray-700 active:bg-blueGray-600 text-white font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={btnSaveClick}
                    >
                      {isLoading ? "Saving..." : "Save Automation"}
                    </button>
                  </div>
                </div>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  {error ? <Alert isError={!!error} message={error} /> : <></>}
                  <form>
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      General
                    </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="name"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            value={automation.name || ""}
                            onChange={onAutomationChange}
                          />
                        </div>
                      </div>
                    </div>
                    <RadioGroup
                      id="isActive"
                      textOn="Automation On"
                      textOff="Automation Off"
                      isOn={automation.isActive}
                      onChange={onAutomationChange}
                    />
                    <div className="mt-3">
                      <RadioGroup
                        id="isOpened"
                        textOn="Is Opened"
                        textOff="Is Closed"
                        isOn={automation.isOpened}
                        onChange={onAutomationChange}
                      />
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      Pool
                    </h6>
                    <PoolInput
                      poolId={automation.poolId}
                      onError={setError}
                      onChange={onPoolChange}
                    />

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      Strategy
                    </h6>

                    <ConditionInput
                      id="openCondition"
                      title="Open Condition"
                      symbol0={pool.symbol0}
                      symbol1={pool.symbol1}
                      condition={automation.openCondition}
                      onChange={onOpenConditionChange}
                    />

                    <div className="w-full lg:w-3/12 px-4">
                      <div className="relative w-full mb-3">
                        <label
                          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                          htmlFor="nextAmount"
                        >
                          Trade Amount {getAmountToolTip()}
                        </label>
                        <input
                          type="text"
                          id="nextAmount"
                          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          value={formatAmount()}
                          onChange={onAmountChange}
                        />
                      </div>
                    </div>
                    <ConditionInput
                      id="closeCondition"
                      title="Close Condition"
                      symbol0={pool.symbol0}
                      symbol1={pool.symbol1}
                      condition={automation.closeCondition}
                      onChange={onCloseConditionChange}
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
          <FooterAdmin />
        </div>
      </div>
      <Toast />
    </>
  );
}
