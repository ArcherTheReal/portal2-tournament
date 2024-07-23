import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route} from "react-router-dom";

import './App.css';

// components
import Home from "./components/pages/home";
import Loader from "./components/loader";

function App() {
  function devCheck() {
    const NODE_ENV = process.env.NODE_ENV;
    if (NODE_ENV == "development") {
      return true;
    } else {
      return false
    }
  }
  const [isDev, setIsDev] = React.useState(devCheck());
  let backendURL
  if (isDev) {
    backendURL = "http://localhost:8080"
  } else {
    backendURL = "http://localhost:8080"
  }

  const [load, setLoad] = React.useState(false);
  const [token, setToken] = React.useState("")
  useEffect(() => {
    fetch(`${backendURL}/api/v1/token`, {
      credentials: "include"
    })
    .then(r => r.json())
    .then(d => {
      if (d.success) {
        setToken(d.data.token)
      }
      setLoad(true)
    })
  })

  if (!load) {
    return (
      <Loader></Loader>
    )
  } else {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home token={token} backendURL={backendURL}></Home>}></Route>
          </Routes>
        </BrowserRouter>
      </>
    );

  }
}

export default App;
