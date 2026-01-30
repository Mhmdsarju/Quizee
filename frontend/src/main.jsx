import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { store } from './redux/store.js'
import { Provider } from "react-redux";
import { setupInterceptors } from './api/interceptors.js';
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


setupInterceptors(store);

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
    <QueryClientProvider client={queryClient}>
        <Provider store={store}>
            <App />
        </Provider>
    </QueryClientProvider>
)
