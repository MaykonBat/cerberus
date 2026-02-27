"use client";

import React, { useState, useEffect } from "react";
import { Pool } from "commons";
import FeeInput from "./FeeInput";

import Select from "react-select";
import { getPool, getPoolSymbols } from "@/services/PoolService";

type Props = {
  poolId: string | null;
  onError: (msg: string) => void;
  onChange: (pool: Pool | null) => void;
};

export type SelectionOption = {
  value: string;
  label: string;
};

function PoolInput(props: Props) {
  const [symbol, setSymbol] = useState<string>("");
  const [symbols, setSymbols] = useState<SelectionOption[]>();

  useEffect(() => {
    getPoolSymbols()
      .then((symbols) => {
        const options = [{ value: "ANY", label: "ANY" }];
        options.push(
          ...symbols.map((s) => {
            return { value: s, label: s };
          }),
        );

        setSymbols(options);

        if (props.poolId) return getPool(props.poolId);
        else return;
      })
      .then((pool) => {
        pool ? setSymbol(pool.symbol) : setSymbol("ANY");
        props.onChange(pool || null);
      })
      .catch((err) =>
        props.onError(
          err.response ? JSON.stringify(err.response.data) : err.message,
        ),
      );
  }, [props.poolId]);

  function onSymbolChange(symbol: string | undefined) {
    setSymbol(symbol || "ANY");

    if (!symbol || symbol === "ANY") {
      props.onChange(null);
      return;
    }
  }

  function onPoolChange(pool: Pool | undefined){
    props.onChange(pool || null);
  }

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-3/12 px-4">
          <div className="relative w-full mb-3">
            <label
              htmlFor="network"
              className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
            >
              Network
            </label>
            <input
              type="text"
              id="network"
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value="Ethereum"
              disabled={true}
            ></input>
          </div>
        </div>
        <div className="w-full lg:w-3/12 pr-4">
          <div className="relative w-full mb-3">
            <label
              htmlFor="exchange"
              className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
            >
              Exchange
            </label>
            <input
              type="text"
              id="exchange"
              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
              value="Uniswap V3"
              disabled={true}
            ></input>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-3/12 px-4">
          <div className="relative w-full mb-3">
            <label
              htmlFor="selectSymbol"
              className="block uppercase text-blueGray-600 text-sm font-bold mb-2"
            >
              Symbol
            </label>
            <Select
              id="selectSymbol"
              instanceId="selectSymbol"
              value={{ value: symbol, label: symbol }}
              onChange={(option) => onSymbolChange(option?.value)}
              getOptionLabel={(f: SelectionOption) => f.label}
              getOptionValue={(f: SelectionOption) => f.value}
              isSearchable={true}
              options={symbols}
              className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
            />
          </div>
        </div>
        <div className="w-full lg:w-3/12 pr-4">
            <div className="relative w-full mb-3">
                {
                    symbol && symbol !== "ANY"
                    ? <FeeInput poolId={props.poolId} symbol={symbol} onChange={onPoolChange} onError={props.onError}/>
                    : <></>
                }
            </div>
        </div>
      </div>
    </>
  );
}

export default PoolInput;
