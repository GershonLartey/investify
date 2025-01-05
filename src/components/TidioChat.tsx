import { useEffect } from "react";

const TidioChat = () => {
  useEffect(() => {
    // Add Tidio Chat script
    const script = document.createElement("script");
    script.src = "//code.tidio.co/orwjszwsgpbe6dxduphlkcbotndwtbxt.js";
    script.async = true;
    document.body.appendChild(script);

    // Configure Tidio position
    const configureTidio = () => {
      if (window.tidioChatApi) {
        window.tidioChatApi.on("ready", function() {
          const iframe = document.querySelector('iframe[src*="tidio"]');
          if (iframe) {
            (iframe as HTMLElement).style.bottom = "100px"; // Move it up above navbar
            (iframe as HTMLElement).style.zIndex = "30"; // Lower z-index than navbar
          }
        });
      } else {
        setTimeout(configureTidio, 100);
      }
    };

    configureTidio();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default TidioChat;