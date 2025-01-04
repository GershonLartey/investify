import { useEffect } from "react"

const TidioChat = () => {
  useEffect(() => {
    // Add Tidio Chat script
    const script = document.createElement("script")
    script.src = "//code.tidio.co/orwjszwsgpbe6dxduphlkcbotndwtbxt.js"
    script.async = true
    document.body.appendChild(script)

    // Configure Tidio position
    const configureTidio = () => {
      if (window.tidioChatApi) {
        window.tidioChatApi.on("ready", function() {
          const iframe = document.querySelector('iframe[src*="tidio"]')
          if (iframe) {
            // Position the chat widget above the navbar
            ;(iframe as HTMLElement).style.bottom = "4rem" // 4rem matches the navbar height
            ;(iframe as HTMLElement).style.zIndex = "50" // Ensure it's above other elements but below modals
          }
        })
      } else {
        setTimeout(configureTidio, 100)
      }
    }

    configureTidio()

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return null
}

export default TidioChat