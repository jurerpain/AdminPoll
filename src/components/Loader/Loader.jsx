import React from 'react';

const Loader = ({LoaderId = 3}) =>{

    return(
        <div className="loader-box">
            <div className={`loader-${LoaderId}`}></div>
        </div>
    )
}
export default Loader;