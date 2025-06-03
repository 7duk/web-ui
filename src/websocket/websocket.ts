import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface WebSocketMessage {
  event: string;
  data: MessageResponse;
}

interface MessageResponse {
  message: string;
  status: string;
  socket_id: string;
}

const useRegisterWebSocket = (socketId: string) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [registrationSent, setRegistrationSent] = useState(false);

  const WS_PROTOCOL = import.meta.env.VITE_WS_PROTOCOL || "ws";
  const WS_HOST = import.meta.env.VITE_WS_HOST || "localhost";
  const WS_PORT = import.meta.env.VITE_WS_PORT || "8765";
  const WS_URL = `${WS_PROTOCOL}://${WS_HOST}:${WS_PORT}`;

  const sendRegistration = (ws: WebSocket) => {
    if (ws.readyState === WebSocket.OPEN) {
      const registrationMessage = {
        type: "register",
        socket_id: socketId,
      };
      ws.send(JSON.stringify(registrationMessage));
      setRegistrationSent(true);
      console.log("📤 Registration sent:", registrationMessage);
    }
  };

  useEffect(() => {
    console.log("🔌 WebSocket connecting to:", WS_URL);
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    setRegistrationSent(false);

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnected(true);

      // Gửi thông tin đăng ký sau khi kết nối
      sendRegistration(ws);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WebSocketMessage;
        console.log("📩 Message received:", message.data);
        const response = message.data as MessageResponse;
        console.log("📩 Message response:", response);
        toast.success(response.message);
        localStorage.setItem("uniqueSocketId", response.socket_id);
      } catch (err) {
        console.log(err);
        console.error("❌ Error parsing message:", event.data);
        toast.error("Error parsing message");
      }
    };

    ws.onclose = (event) => {
      console.log("🔌 WebSocket disconnected", event.code, event.reason);
      setConnected(false);
      setRegistrationSent(false);
      localStorage.removeItem("uniqueSocketId");
    };

    ws.onerror = (err) => {
      console.error("⚠️ WebSocket error:", err);
      localStorage.removeItem("uniqueSocketId");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [WS_URL]); // Sửa dependency

  // Method để manually resend registration nếu cần
  const resendRegistration = () => {
    if (wsRef.current && connected) {
      sendRegistration(wsRef.current);
    }
  };

  return {
    registrationSent,
    resendRegistration,
  };
};

export default useRegisterWebSocket;
