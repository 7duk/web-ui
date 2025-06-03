import { createContext, useContext } from "react";
export const ApiKeyContext = createContext<string | null>(null);
export const useApiKey = () => useContext(ApiKeyContext);
