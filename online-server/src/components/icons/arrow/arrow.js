import React, { useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";

import "../icons.css"

export default function IconArrow(prop) {
    return (
        <svg className='icon__arrow' xmlns="http://www.w3.org/2000/svg" height={prop.size} viewBox="0 -960 960 960" width={prop.size} fill="#FFFFFF"><path d="M459-381 314-526q-3-3-4.5-6.5T308-540q0-8 5.5-14t14.5-6h304q9 0 14.5 6t5.5 14q0 2-6 14L501-381q-5 5-10 7t-11 2q-6 0-11-2t-10-7Z"/></svg>
    )
}
