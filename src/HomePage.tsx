import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiKey } from "./context/Context";

export default function HomePage() {
  const characterId = "6fd40196-3787-11f0-9ef8-42010a7be01f";
  const apiKey = useApiKey();
  const [usesrName, setUsesrName] = useState("");
  const navigate = useNavigate();
  return (
    <>
      <div className="w-full h-full flex flex-col items-center justify-center gap-3">
        <div className="flex flex-row gap-3">
          <div className="flex items-center justify-center">
            <label htmlFor="userName">Username</label>
          </div>

          <input
            id="userName"
            className="border-1 rounded h-[40px] pl-1"
            type="text"
            value={usesrName}
            placeholder="Enter your name"
            onChange={(e) => setUsesrName(e.target.value)}
          />
        </div>

        <input
          className="bg-blue-500 text-white p-2 rounded"
          type="button"
          value="Submit"
          onClick={() => {
            navigate(`/chat`, {
              state: { apiKey, characterId, usesrName },
            });
          }}
        />
      </div>
    </>
  );
}
