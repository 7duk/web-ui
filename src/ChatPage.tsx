import { useState, useEffect, useCallback } from "react";
import ChatBubble, { useConvaiClient } from "convai-chatui-sdk";
import { useLocation } from "react-router-dom";
import { Paperclip, Upload } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { uploadFile, type ResponseBody } from "./api/FileApi";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import useRegisterWebSocket from "./websocket/websocket";
import { sendMessage } from "./api/MessageApi";

export default function ChatPage() {
  const location = useLocation();
  const { apiKey, characterId, userName } = location.state || {};
  const npcName = "ADMIN";
  const avatar = "https://models.readyplayer.me/6833f469886df41a167d695f";
  const socketId = localStorage.getItem("uniqueSocketId") ?? uuidv4();
  const { client } = useConvaiClient(
    characterId,
    apiKey,
    npcName,
    userName,
    avatar
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message] = useState<string>("電話番号0299929200の会社名は何ですか？");
  const [reply, setReply] = useState<string | null>(null);
  const handleReplyReceived = (newReply: string) => {
    console.log("📥 Reply received in ChatPage:", newReply);
    setReply(newReply);
  };
  useRegisterWebSocket(socketId, handleReplyReceived);

  useEffect(() => {
    client.setNpcText(reply);
    setReply(null);
  }, [reply]);

  useEffect(() => {
    sendMessageMutation.mutate({ message: client.userText });
  }, [client.userText]);

  // Mutation upload file
  const uploadMutation = useMutation<ResponseBody, AxiosError, File>({
    mutationFn: uploadFile,
  });

  const sendMessageMutation = useMutation<
    ResponseBody,
    AxiosError,
    { message: string }
  >({
    mutationFn: sendMessage,
  });

  // Xử lý toast khi mutation thành công/thất bại
  useEffect(() => {
    if (uploadMutation.isSuccess && uploadMutation.data) {
      toast.success(uploadMutation.data.message);
    } else if (uploadMutation.isError) {
      toast.error(uploadMutation.error?.message || "Đã xảy ra lỗi");
    }
  }, [
    uploadMutation.isSuccess,
    uploadMutation.isError,
    uploadMutation.data,
    uploadMutation.error,
  ]);

  // Xử lý chọn file
  const handleChooseFile = useCallback(() => {
    const fileInput = document.getElementById("file_upload");
    fileInput?.click();
  }, []);

  // Xử lý khi chọn file mới
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        setSelectedFile(file);
      }
    },
    []
  );

  // Xử lý upload file
  const handleUpload = useCallback(() => {
    if (selectedFile) {
      setSelectedFile(null);
      uploadMutation.mutate(selectedFile);
    }
  }, [selectedFile, uploadMutation]);

  const handleSendMessage = useCallback(() => {
    if (message) {
      sendMessageMutation.mutate({ message });
    }
  }, [message]);

  return (
    <>
      <ChatBubble
        chatHistory="Show"
        chatUiVariant="Sequential Line Chat"
        client={client}
      />
      <div className="flex flex-row w-full gap-2">
        <input
          type="file"
          id="file_upload"
          className="hidden"
          accept=".doc,.docx,.csv,.pdf"
          onChange={handleFileChange}
        />

        <button
          className="!bg-gray-700 text-white p-2 rounded flex flex-row gap-2 ml-auto mt-5"
          onClick={handleChooseFile}
        >
          <Upload />
          <span>Choose</span>
        </button>
        {selectedFile && (
          <div
            id="file_name"
            className="flex flex-row gap-2 mt-5 justify-center items-center"
          >
            <Paperclip />
            {selectedFile.name}
          </div>
        )}
        <button
          className="!bg-gray-700 text-white p-2 rounded flex flex-row gap-2 mt-5 mr-5 disabled:opacity-50 disabled:!cursor-not-allowed"
          disabled={!selectedFile}
          onClick={handleUpload}
        >
          <span>Upload</span>
        </button>
      </div>

      <div className="flex justify-end w-full mt-2">
        <button className="border border-slate-200" onClick={handleSendMessage}>
          Send Message
        </button>
      </div>
    </>
  );
}
