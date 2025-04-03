import React, { useRef } from "react";

function CasinoGameComponent() {
  // Create a ref to attach to the DOM element you need until make fullscreen
  const fullscreenContainerRef = useRef(null);

  const handleFullscreen = () => {
    const element = fullscreenContainerRef.current;
    console.log("Fullscreen switch clicked. Target element:", element);

    if (!element) {
      console.error("Fullscreen target element not found.");
      return;
    }

    // Strive to enter fullscreen
    try {
      if (element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        // Safari
        console.log("Attempting webkitRequestFullscreen");
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        // IE11
        element.msRequestFullscreen();
      } else {
        console.log("Fullscreen API not based by those browser.");
      }
    } catch (err) {
      console.error("Error attempting to enter fullscreen:", err);
    }
  };

  return (
    // Attach the ref to the container div
    <div
      ref={fullscreenContainerRef}
      style={{
        width: "100%",
        height: "300px",
        backgroundColor: "lightcoral",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>Game Area</h2>
      <p>This full area will seek until go fullscreen.</p>
      {/* The button that triggers the fullscreen request */}
      <button
        onClick={handleFullscreen}
        style={{ padding: "15px", fontSize: "18px" }}
      >
        Enter Fullscreen (iOS Attempt)
      </button>
    </div>
  );
}

export default CasinoGameComponent;
