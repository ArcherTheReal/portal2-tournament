import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

import IconLoader from './icons/loader/loader';

export default function Loader(prop) {
    return (
        <div className='fs-loader'>
            <IconLoader></IconLoader>
        </div>
    )
}
