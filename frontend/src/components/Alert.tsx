"use client"

import { useState } from "react"

type Props = {
    isError: boolean;
    message: string | { message: string; };
}

function Alert(props: Props){

    const [showAlert, setShowAlert] = useState<boolean>(true);

    return (<>
      {showAlert ? (
        <div
          className={`text-white mt-3 px-6 py-4 border-0 rounded relative mb-5 ${props.isError ? "bg-red-500" : "bg-emerald-500"}`}
        >
          <span className="text-xl inline-block mr-5 align-middle">
            <i className="fas fa-bell" />
          </span>
          <span className="inline-block align-middle mr-8">
            <b className="capitalize"> { props.isError ? "Error!" : "Success!" } </b> 
            {
            typeof props.message === "string"
            ? JSON.stringify(props.message)
            : JSON.stringify(props.message.message)
            }
          </span>
          <button
            className="absolute bg-transparent text-2xl font-semibold leading-none right-0 top-0 mt-4 mr-6 p-5 pt-0 outline-none focus:outline-none"
            onClick={() => setShowAlert(false)}
          >
            <span>×</span>
          </button>
        </div>
      ) : null}
    </>)
}

export default Alert;