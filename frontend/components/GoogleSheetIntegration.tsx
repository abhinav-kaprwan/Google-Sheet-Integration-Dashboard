import { useState } from "react";

export default function GoogleSheetIntegration() {
  const [sheetUrl, setSheetUrl] = useState("");
  const [sheetId, setSheetId] = useState("");

  const extractSheetId = () => {
    const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      setSheetId(match[1]);
    } else {
      alert("Invalid Google Sheet URL");
    }
  };

  const sendToBackend = async () => {
    if (!sheetId) {
      alert("No Sheet ID found!");
      return;
    }

    const response = await fetch("/api/table/fetch-sheet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sheetId }),
    });

    const data = await response.json();
    console.log("Sheet Data:", data);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Paste Google Sheet link here"
        className="border p-2 w-full"
        value={sheetUrl}
        onChange={(e) => setSheetUrl(e.target.value)}
      />
      <button className="bg-blue-500 text-white p-2 mt-2" onClick={extractSheetId}>
        Extract Sheet ID
      </button>

      {sheetId && (
        <div className="mt-2">
          <p>Sheet ID: {sheetId}</p>
          <button className="bg-green-500 text-white p-2 mt-2" onClick={sendToBackend}>
            Fetch Data
          </button>
        </div>
      )}
    </div>
  );
}