import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ApiKeyContext } from "./context/Context.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();
const apiKey = import.meta.env.VITE_CONVAI_API_KEY;
createRoot(document.getElementById("root")!).render(
  <ApiKeyContext.Provider value={apiKey}>
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </QueryClientProvider>
    </StrictMode>
  </ApiKeyContext.Provider>
);
