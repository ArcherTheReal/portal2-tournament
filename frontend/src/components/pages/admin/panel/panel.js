import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import ErrorPage from '../../404/404';

export default function AdminPanel(prop) {
    const [token, backendURL, isAdmin] = [prop.token, prop.backendURL, prop.isAdmin];

    if (!isAdmin) {
        return (
            <ErrorPage></ErrorPage>
        )
    }

    return (
        <main>
            <h1 style={{marginLeft: "20px"}}>Admin panel</h1>
        </main>
    )
}
