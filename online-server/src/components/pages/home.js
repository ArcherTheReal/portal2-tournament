import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Home(prop) {
    const [token, backendURL] = [prop.token, prop.backendURL];
    const [username, setUsername] = React.useState("")

    useEffect(() => {
        if (token !== "") {
            fetch(`${backendURL}/api/v1/users/whoami`, {
                credentials: "include"
            })
            .then(r => r.json())
            .then(d => {
                setUsername(d.data.name)
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
        <div>
            <span>Hi from Home!</span><br/>
            {username != "" ? 
            <div>
                <span>Hello {username}</span>
                <button onClick={logout}>log out</button>
            </div>
            : <div>
                <button onClick={login}>log in</button>
            </div>}
        </div>
    )
}
