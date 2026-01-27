import React, { useState, useEffect } from "react";
import Pool from "../../../../packages/commons/dist/models/pool";

// components

export default function CardTopPools() {
  const [pools, setPools] = useState<Pool[]>([]);

  useEffect(() => {
    //TODO: carregar da API
  }, []);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 border-0">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full px-4 max-w-full flex-grow flex-1">
              <h3 className="font-semibold text-base text-blueGray-700">
                Top Pools
              </h3>
            </div>
          </div>
        </div>
        <div className="block w-full overflow-x-auto">
          {/* Projects table */}
          <table className="items-center w-full bg-transparent border-collapse">
            <thead>
              <tr>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Symbol
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Price0 Change 1h (%)
                </th>
                <th className="px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
                  Price1 Change 1h (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {
              pools && pools.map((p) => (
                  <tr>
                    <th className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {p.symbol} ({p.fee / 10000}%)
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <i className="fas fa-arrow-up text-emerald-500 mr-4"></i>
                      {p.price0Change_60}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <i className="fas fa-arrow-down text-red-500 mr-4"></i>
                      {p.price1Change_60}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/*
{
    id: "",
    exchange: 1,
    fee: 10000,
    lastUpdate: new Date(),
    lastUpdate_15: new Date(),
    lastUpdate_60: new Date(),
    network: 1,
    price0: "100",
    price0_15: "100",
    price0_60: "100",
    price0Change: 10,
    price0Change_15: 10,
    price0Change_60: 10,
    price1: "50",
    price1_15: "50",
    price1_60: "50",
    price1Change: 15,
    price1Change_15: 15,
    price1Change_60: 15,
    symbol: "BTCUSDT",
    symbol0: "BTC",
    symbol1: "USDT",
    token0: "",
    token1: ""
  }
*/