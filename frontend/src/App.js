import React, { useEffect } from "react"
import { BrowserRouter, Routes, Route} from "react-router-dom";

import './App.css';

// components
import Home from "./components/pages/home/home";
import Loader from "./components/loader";
import Header from "./components/header";
import ErrorPage from "./components/pages/404/404";
import AdminPanel from "./components/pages/admin/panel/panel";

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

  const [username, setUsername] = React.useState("")
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState("");

  useEffect(() => {
        if (token !== "") {
            fetch(`${backendURL}/api/v1/users/whoami`, {
                credentials: "include"
            })
            .then(r => r.json())
            .then(d => {
                setUsername(d.data.name)
                if (d.data.name != "") {
                    setIsAdmin(d.data.admin);
                    setIsLoggedIn(true);
              }
            })
        }
  })

  if (!load) {
    return (
      <Loader></Loader>
    )
  } else {
    return (
      <>
        <BrowserRouter>
          <Header token={token} backendURL={backendURL}></Header>
          <Routes>
            <Route index element={<Home token={token} backendURL={backendURL}></Home>}></Route>

            <Route path="/admin/panel" element={<AdminPanel token={token} backendURL={backendURL} isAdmin={isAdmin}></AdminPanel>}></Route>
            <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
          </Routes>
        </BrowserRouter>
      </>
    );

  }
}

export default App;
