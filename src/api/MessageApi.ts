import axios from "axios";

// Lấy các biến môi trường từ import.meta.env
const API_PROTOCOL = import.meta.env.VITE_API_PROTOCOL;
const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;
const API_PREFIX_ENDPOINT = import.meta.env.VITE_API_PREFIX_ENDPOINT;

// Xây dựng BASE_URL từ các phần
// Đảm bảo không có dấu '/' thừa hoặc thiếu
const BASE_URL = `${API_PROTOCOL}://${API_HOST}:${API_PORT}${API_PREFIX_ENDPOINT}`;

export interface ResponseBody {
  message?: string;
  error?: string;
}
export const sendMessage = async (data: {
  message: string;
}): Promise<ResponseBody> => {
  const socket_id = localStorage.getItem("uniqueSocketId");
  const payload = {
    message: data.message,
    socket_id: socket_id ?? "",
  };
  const response = await axios.post(`${BASE_URL}/query`, payload);
  return response.data;
};
