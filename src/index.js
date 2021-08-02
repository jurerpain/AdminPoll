import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App'
import Providers from "./Providers";
import './index.scss';

const Root = () => {
    return (
        <Providers>
            <App/>
        </Providers>
    )
}
ReactDOM.render(<Root/>, document.getElementById('root'));
