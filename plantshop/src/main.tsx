// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import './index.css'
import App from './App.tsx'
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
async function enableMocking() {
    if (import.meta.env.DEV) {
        const { worker } = await import("./mocks/browser");
        await worker.start();
    }
}

enableMocking().then(() => {
    ReactDOM.createRoot(document.getElementById("root")!).render(
        <React.StrictMode>
            <BrowserRouter>
                    <Provider store={store}>
                      <App />
                    </Provider>
            </BrowserRouter>
        </React.StrictMode>
    );
});