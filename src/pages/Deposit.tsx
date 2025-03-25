import { useState } from "react";

function App() {
  const [url, setUrl] = useState("https://example.com");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">React Vite iFrame Example</h1>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter a URL"
        className="border p-2 rounded w-96 mb-4"
      />
      <div className="border rounded-lg overflow-hidden w-full max-w-3xl h-96">
        <iframe
          src={url}
          title="Embedded Website"
          className="w-full h-full border-none"
        ></iframe>
      </div>
    </div>
  );
}

export default App;
