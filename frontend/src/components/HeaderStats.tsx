"use client";

import React, { useEffect, useState } from "react";

// components

import CardStats from "@/components/Cards/CardStats.js";
import { getActiveAutomations } from "@/services/AutomationService";
import { getClosedTrades } from "@/services/TradeService";

export default function HeaderStats() {
  const [activeAutomations, setActiveAutomations] = useState<number>(0);
  const [openedAutomations, setOpenedAutomations] = useState<number>(0);

  const [swapsToday, setSwapsToday] = useState<number>(0);
  const [dailyPerformance, setDailyPerformance] = useState<number>(0);

  const [swapsWeek, setSwapsWeek] = useState<number>(0);
  const [weeklyPerformance, setWeeklyPerformance] = useState<number>(0);

  const [monthlyPerformance, setMonthlyPerformance] = useState<number>(0);
  const [lastPerformance, setLastPerformance] = useState<number>(0);

  const DAY_IN_MS = 24 * 60 * 60 * 1000;

  useEffect(() => {
    getActiveAutomations()
      .then((automations) => {
        setActiveAutomations(automations.length);
        setOpenedAutomations(automations.filter((a) => a.isOpened).length);
      })
      .catch((err) =>
        console.error(
          err.response ? JSON.stringify(err.response.data) : err.message,
        ),
      );

    getClosedTrades(new Date(Date.now() - 60 * DAY_IN_MS))
      .then((trades) => {
        trades = trades.map((t) => {
          return {
            ...t,
            openDate: new Date(t.openDate!),
            closeDate: new Date(t.closeDate!),
          };
        });

        //card2
        const todayTrades = trades.filter(
          (t) => t.closeDate && t.closeDate > new Date(Date.now() - DAY_IN_MS),
        );
        if (todayTrades && todayTrades.length) {
          setSwapsToday(todayTrades.length);
          setDailyPerformance(
            todayTrades
              .filter((t) => t.pnl !== undefined)
              .map((t) => t.pnl || 0)
              .reduce((a, b) => a + b),
          );
        }

        //card3
        const weekTrades = trades.filter(
          (t) =>
            t.closeDate && t.closeDate > new Date(Date.now() - 7 * DAY_IN_MS),
        );
        if (weekTrades && weekTrades.length) {
          setSwapsToday(weekTrades.length);
          setDailyPerformance(
            weekTrades
              .filter((t) => t.pnl !== undefined)
              .map((t) => t.pnl || 0)
              .reduce((a, b) => a + b),
          );
        }

        //card4
        const thisMonthTrades = trades.filter(
          (t) =>
            t.closeDate && t.closeDate > new Date(Date.now() - 30 * DAY_IN_MS),
        );
        if (thisMonthTrades && thisMonthTrades.length) {
          setMonthlyPerformance(
            thisMonthTrades
              .filter((t) => t.pnl !== undefined)
              .map((t) => t.pnl || 0)
              .reduce((a, b) => a + b),
          );
        }

        const lastMonthTrades = trades.filter(
          (t) =>
            t.closeDate && t.closeDate > new Date(Date.now() - 30 * DAY_IN_MS),
        );
        if (lastMonthTrades && lastMonthTrades.length) {
          setLastPerformance(
            lastMonthTrades
              .filter((t) => t.pnl !== undefined)
              .map((t) => t.pnl || 0)
              .reduce((a, b) => a + b),
          );
        }
      })
      .catch((err) =>
        console.error(
          err.response ? JSON.stringify(err.response.data) : err.message,
        ),
      );
  }, []);

  return (
    <>
      {/* Header */}
      <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Active Automations"
                  statTitle={`${activeAutomations}`}
                  statDescripiron={`${openedAutomations} positions opened`}
                  statIconName="fa fa-robot"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Trading Day"
                  statTitle={`${swapsToday}`}
                  statArrow={dailyPerformance > 0 ? "up" : "down"}
                  statPercent={`${dailyPerformance.toFixed(2)}`}
                  statPercentColor={`${dailyPerformance > 0 ? "text-emerald-500" : "text-red-500"}`}
                  statDescripiron="Performance Today"
                  statIconName="fas fa-clock"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Trading Week"
                  statTitle={`${swapsWeek}`}
                  statArrow={weeklyPerformance > 0 ? "up" : "down"}
                  statPercent={`${weeklyPerformance.toFixed(2)}`}
                  statPercentColor={`${weeklyPerformance > 0 ? "text-emerald-500" : "text-red-500"}`}
                  statDescripiron="Performance This Week"
                  statIconName="fas fa-calendar"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="Trading Month"
                  statTitle={`${monthlyPerformance.toFixed(2)}%`}
                  statArrow={monthlyPerformance > 0 ? "up" : "down"}
                  statPercent={`${lastPerformance.toFixed(2)}`}
                  statPercentColor={`${lastPerformance > 0 ? "text-emerald-500" : "text-red-500"}`}
                  statDescripiron="Last Month"
                  statIconName="fas fa-percent"
                  statIconColor="bg-lightBlue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
