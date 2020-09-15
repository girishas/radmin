/**
 * Rct Page Loader
 */
import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const RctPageLoader = () => (
    <div className="page-loader d-flex justify-content-center mb-30 loader-overlay" style={{  display: "block",
        position: "fixed"}}>
        <CircularProgress />
    </div>
);

export default RctPageLoader;
