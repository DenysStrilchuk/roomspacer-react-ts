import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import './index.css';
import { router } from './router';
import {store} from "./store";
import {GoogleOAuthProvider} from "@react-oauth/google";

const client="3136741747-83ecomobkj1bhb7uvk9h4ftv5l3c75rg.apps.googleusercontent.com";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <GoogleOAuthProvider clientId={client}>
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
    </GoogleOAuthProvider>
);
