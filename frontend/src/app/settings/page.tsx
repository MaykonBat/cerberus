"use client";

import React from "react";

// components

import CardSettings from "@/components/Cards/CardSettings";
import Sidebar from "@/components/Sidebar/Sidebar";
import AdminNavBar from "@/components/Navbars/AdminNavbar";
import FooterAdmin from "@/components/Footers/FooterAdmin";

export default function Settings() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavBar pageName="settings" />
        <div className="relative bg-blueGray-800 md:pt-32 pb-32 pt-12"></div>
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <div className="flex flex-wrap">
            <div className="w-full px-4">
              <CardSettings />
            </div>
          </div>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
