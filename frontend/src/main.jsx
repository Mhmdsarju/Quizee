import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {store}  from './redux/store.js'
import {Provider} from "react-redux";
import { setupInterceptors } from './api/interceptors.js';
import "./index.css";

setupInterceptors(store);

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
    <App />
    </Provider>
)
