import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.scss";
import Home from "./pages/Home/Home";
import socketIOClient, { Socket } from "socket.io-client";
import { basicApi } from "./enviroument";

export let socketConnection: ReturnType<typeof socketIOClient> | null = null;

function App() {
  useEffect(() => {
    socketConnection = socketIOClient(basicApi).connect();
    socketConnection && socketConnection.emit("conn", { message: "connected" });
    return () => {
      socketConnection!.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
}

export default App;
