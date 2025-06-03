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
export const uploadFile = async (file: File): Promise<ResponseBody> => {
  const formData = new FormData();
  const socket_id = localStorage.getItem("uniqueSocketId");
  formData.append("file", file);
  formData.append("socket_id", socket_id ?? "");
  const response = await axios.post(`${BASE_URL}/upload`, formData);
  return response.data;
};
