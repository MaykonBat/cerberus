"use client"

import React from "react";

export default function CardLineChart() {
  React.useEffect(() => {
    const tv = new TradingView.widget(
      {
      "autosize": true,
      "symbol": "BINANCE:BTCUSDT",
      "interval": "60",
      "timezone": "Etc/UTC",
      "theme": "dark",
      "style": "1",
      "locale": "br",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "container_id": "tradingview_d08aa"
    }
      );
  }, []);
  return (
    <>
      <div className="tradingview-widget-container">
        <div id="tradingview_d08aa" style={{height: 450}}></div>
      </div>
    </>
  );
}