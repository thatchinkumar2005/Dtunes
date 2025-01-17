import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import AuthContextProvider from "./contexts/authContex.jsx";
import { store } from "./redux/store.js";
import { Toaster } from "react-hot-toast";
import SocketContextProvider from "./contexts/socketContext.jsx";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <AuthContextProvider>
            <SocketContextProvider>
              <Toaster
                toastOptions={{
                  style: {
                    background: "#2a2a2a",
                    color: "#F4F9F9",
                  },
                }}
              />
              <Routes>
                <Route path="*" element={<App />} />
              </Routes>
            </SocketContextProvider>
          </AuthContextProvider>
        </Provider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
