import React from "react"
import { useComponentProps, getPropsFromPackageJson, useUser, useLimioContext } from "@limio/sdk"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#000000"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
}

const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== 'string') return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const WelcomeName = () => {
  const props = useComponentProps(defaultProps)
  const { 
    welcomeText,
    fallbackText,
    showSubtext,
    subtextMessage,
    primaryColor__limio_color,
    backgroundColor__limio_color
  } = props

  const { attributes, loaded } = useUser()
  const { isInPageBuilder } = useLimioContext()
  
  // Get first name from user attributes and capitalize first letter
  const firstName = attributes?.firstName ? capitalizeFirstLetter(attributes.firstName) : null
  
  // Create welcome message
  const getWelcomeMessage = () => {
    if (firstName) {
      return `${welcomeText}, ${firstName}`
    }
    return fallbackText
  }

  // Show loading state until user data is loaded (unless in page builder)
  if (!loaded && !isInPageBuilder) {
    return (
      <div 
        className="wn-wrapper wn-loading"
        style={{ 
          "--wn-primary": primaryColor__limio_color || "#0080ff",
          "--wn-bg": backgroundColor__limio_color || "#ffffff",
          "--wn-contrast": getContrastColor(primaryColor__limio_color || "#0080ff")
        }}
      >
        <div className="wn-container">
          <div className="wn-content">
            <div className="wn-skeleton-text wn-skeleton-main"></div>
            {showSubtext && <div className="wn-skeleton-text wn-skeleton-sub"></div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="wn-wrapper"
      style={{ 
        "--wn-primary": primaryColor__limio_color || "#0080ff",
        "--wn-bg": backgroundColor__limio_color || "#ffffff",
        "--wn-contrast": getContrastColor(primaryColor__limio_color || "#0080ff")
      }}
    >
      <div className="wn-container">
        <div className="wn-content">
          <h1 className="wn-welcome-message">
            {getWelcomeMessage()}
          </h1>
          {showSubtext && subtextMessage && (
            <p className="wn-subtext">
              {subtextMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default WelcomeName