import React from "react";

const SplashScreen = () => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#0070f3",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999,
      fontSize: "2rem",
      flexDirection: "column"
    }}
  >
    <img src="/192IMAGE.png" alt="Logo" style={{ width: 96, height: 96, marginBottom: 24 }} />
    <span>Shop Management App</span>
  </div>
);

export default SplashScreen; 