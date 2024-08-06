import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import "./header.css"
import logo from "../imgs/ffo-icon-crop.png"

// icons
import IconLogin from './icons/login/login';
import IconLogout from './icons/logout/logout';

export default function Header(prop) {
    const [token, backendURL] = [prop.token, prop.backendURL];
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

    function logout() {
        fetch(`${backendURL}/api/v1/auth/logout`, {
            credentials: "include"
        })
        .then(r => r.json())
        .then(d => {
            window.location.reload()
        })
    }

    function login() {
        window.location = `${backendURL}/api/v1/auth/login`
    }

    return (
        <header>
            <Link to={"/"}><section className='logo'>
                <img src={logo}></img>
                <h1>FFO Tournament</h1>
            </section></Link>

            <section className='right'>
                <div className='nav'>
                    {isAdmin ? <Link to={"/admin/panel"}>Admin</Link> : null}
                    <Link to={"/vote"}>Vote</Link>
                    <Link to={"/stream"}>Stream</Link>
                    <Link to={"/about"}>About</Link>
                </div>
                <div className='auth'>
                    {isLoggedIn ?
                    <button onClick={logout}>
                        <span>Logout</span>
                        <IconLogout></IconLogout>
                    </button>
                    :
                    <button onClick={login}>
                        <span>Login</span>
                        <IconLogin></IconLogin>
                    </button>}
                </div>
            </section>
        </header>
    )
}
