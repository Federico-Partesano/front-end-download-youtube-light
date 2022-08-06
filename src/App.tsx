import React, { useEffect, useState } from "react";
import "./App.scss";
import Home from "./pages/Home/Home";
import socketIOClient from "socket.io-client";
import { basicApi } from "./enviroument";
import { v4 as uuidv4 } from "uuid";
import { getCookie, setCookie } from "./utils/cookie";

export let socketConnection: ReturnType<typeof socketIOClient> | null = null;

function App() {
  const [alreadyConnected, setAlreadyConnected] = useState(false);
  useEffect(() => {
    !getCookie("idYoutubeLight") && setCookie("idYoutubeLight", uuidv4(), 3000);
    socketConnection = socketIOClient(basicApi).connect();
    socketConnection &&
      socketConnection.emit("conn", {
        message: "connected",
        id: getCookie("idYoutubeLight"),
      });

    socketConnection.on("disconnectClient", () => {
      setAlreadyConnected(true);
    });
    return () => {
      socketConnection!.disconnect();
    };
  }, []);

  const renderAlreadyConnectedMessage = () => 
  <div className="container-already-connected">
    <h1>Già collegato in un'altra tab</h1>
    <p>per questioni di stabilità a questa pagina si può accedere ad una tab alla volta.</p>
  </div>

  return (
    <div className="App">
      {alreadyConnected ? renderAlreadyConnectedMessage() : <Home />}
    </div>
  );
}

export default App;
