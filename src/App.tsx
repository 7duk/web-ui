import "./App.css";
import { Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import ChatPage from "./ChatPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/chat" element={<ChatPage />} />
    </Routes>
  );
}
