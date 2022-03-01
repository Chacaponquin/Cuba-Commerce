import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ColorProvider from "./context/ColorContext";
import ProfileProvider from "./context/ProfileContext";
import "./global.css";

ReactDOM.render(
  <React.StrictMode>
    <ProfileProvider>
      <ColorProvider>
        <App />
      </ColorProvider>
    </ProfileProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
