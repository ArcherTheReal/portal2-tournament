import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Home(prop) {
    const [token, backendURL] = [prop.token, prop.backendURL];

    return (
        <main>
            <span>Hi from Home!</span><br/>
        </main>
    )
}
