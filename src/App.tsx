import { useState } from "react"
import { Auth } from "./pages/Auth"


function App() {
  const [apiKey, setApiKey] = useState<string | null>(() => {
    return localStorage.getItem("apiKey");
  });

  const setApiKeyAndStore = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem("apiKey", key);
    } else {
      localStorage.removeItem("apiKey");
    }
  };

  return (
    <>
      {!apiKey && <Auth setApiKey={setApiKeyAndStore} />}
      {apiKey && <h1>Hello {apiKey}</h1>}
    </>
  )
}

export default App
