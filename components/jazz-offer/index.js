const React = require("react")
const { useCampaign, useBasket, useLimioContext } = require("@limio/sdk")
const { getCurrentBasketId } = require("@limio/shop/src/shop/checkout/basket")
const { useStaticProps } = require("./componentStaticProps")
require("./index.css")

function JazzOffer() {
  const props = useStaticProps()
  const { 
    headline, 
    subheadline, 
    primaryColor__limio_color: primaryColor,
    accentColor__limio_color: accentColor,
    featuresTitle,
    ctaLoadingText,
    noOfferSelectedText,
    sidebarTitle,
    enableAnimations,
    mostPopularText
  } = props
  
  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { isInPageBuilder } = useLimioContext() || {}
  
  const [selectedOfferId, setSelectedOfferId] = React.useState(null)
  
  React.useEffect(() => {
    if (offers.length > 0 && !selectedOfferId) {
      setSelectedOfferId(offers[0].id)
    }
  }, [offers, selectedOfferId])
  
  const selectedOffer = offers.find(offer => offer.id === selectedOfferId)
  
  const handleAddToBasket = async (offer) => {
    if (basketLoading) return
    const checkoutId = getCurrentBasketId()
    if (!checkoutId) {
      await initiateCheckout({ order: { orderItems: [{ offer }] } })
    } else {
      await addOfferToBasket({ offer })
    }
    if (pageOptions?.pushToCheckout) {
      await navigateToCheckout()
    }
  }

  // Generate network nodes with energy flow
  const generateNetworkData = () => {
    const nodes = []
    const connections = []
    
    // Create nodes in a subtle grid pattern
    for (let i = 0; i < 12; i++) {
      const x = (i % 4) * 25 + 10 + Math.random() * 15
      const y = Math.floor(i / 4) * 30 + 15 + Math.random() * 15
      nodes.push({
        id: i,
        x: Math.min(95, Math.max(5, x)),
        y: Math.min(95, Math.max(5, y)),
        delay: Math.random() * 3,
        hasEnergy: Math.random() > 0.7 // Only some nodes have energy flow
      })
    }
    
    // Create connections between nearby nodes
    nodes.forEach((node, i) => {
      nodes.slice(i + 1).forEach((otherNode, j) => {
        const distance = Math.sqrt(
          Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
        )
        if (distance < 35) {
          connections.push({
            id: `${i}-${j + i + 1}`,
            from: node,
            to: otherNode,
            delay: (node.delay + otherNode.delay) / 2,
            hasEnergyFlow: node.hasEnergy || otherNode.hasEnergy
          })
        }
      })
    })
    
    return { nodes, connections }
  }

  const [networkData] = React.useState(generateNetworkData)

  return (
    <div 
      className={`jo-wrapper ${isInPageBuilder ? "jo-wrapper--static" : ""}`}
      style={{
        "--jo-primary": primaryColor,
        "--jo-accent": accentColor,
        "--jo-primary-rgb": hexToRgb(primaryColor),
        "--jo-accent-rgb": hexToRgb(accentColor)
      }}
    >
      {/* Subtle Animated Network Background */}
      {enableAnimations && (
        <div className="jo-network-bg">
          <div className="jo-network-canvas">
            {/* Nodes */}
            {networkData.nodes.map((node) => (
              <div
                key={node.id}
                className={`jo-network-node ${node.hasEnergy ? "jo-network-node--energy" : ""}`}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  animationDelay: `${node.delay}s`
                }}
              />
            ))}
            
            {/* Connections */}
            <svg className="jo-network-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {networkData.connections.map((connection) => (
                <g key={connection.id}>
                  <line
                    x1={connection.from.x}
                    y1={connection.from.y}
                    x2={connection.to.x}
                    y2={connection.to.y}
                    className="jo-network-line"
                    style={{ animationDelay: `${connection.delay}s` }}
                  />
                  {connection.hasEnergyFlow && (
                    <circle
                      r="0.3"
                      className="jo-energy-particle"
                      style={{ animationDelay: `${connection.delay}s` }}
                    >
                      <animateMotion
                        dur={`${3 + Math.random() * 2}s`}
                        repeatCount="indefinite"
                        begin={`${connection.delay}s`}
                      >
                        <mpath href={`#path-${connection.id}`} />
                      </animateMotion>
                    </circle>
                  )}
                  <path
                    id={`path-${connection.id}`}
                    d={`M${connection.from.x},${connection.from.y} L${connection.to.x},${connection.to.y}`}
                    style={{ display: "none" }}
                  />
                </g>
              ))}
            </svg>
          </div>
        </div>
      )}

      <div className="jo-container">
        <header className="jo-header">
          <h1 className="jo-headline">{headline}</h1>
          <p className="jo-subheadline">{subheadline}</p>
        </header>
        
        <div className="jo-layout">
          {/* Compact Sidebar */}
          <div className="jo-sidebar">
            <h3 className="jo-sidebar-title">{sidebarTitle}</h3>
            <div className="jo-plan-list">
              {offers.map(offer => {
                const attrs = offer?.data?.attributes || offer?.attributes || {}
                const isSelected = offer.id === selectedOfferId
                const isBestValue = attrs.best_value__limio
                return (
                  <button
                    key={offer.id}
                    className={`jo-plan-item ${isSelected ? "jo-plan-item--active" : ""}`}
                    onClick={() => setSelectedOfferId(offer.id)}
                  >
                    {isBestValue && <div className="jo-popular-badge">{mostPopularText}</div>}
                    <div className="jo-plan-content">
                      <h4 className="jo-plan-name" dangerouslySetInnerHTML={{ __html: attrs.display_name__limio || offer.name }} />
                      <div className="jo-plan-price" dangerouslySetInnerHTML={{ __html: attrs.display_price__limio || "Contact for pricing" }} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Sleek Main Content */}
          <div className="jo-main-content">
            {selectedOffer ? (
              <div className="jo-offer-details">
                <div className="jo-offer-summary">
                  <h2 className="jo-offer-title" dangerouslySetInnerHTML={{ __html: selectedOffer?.data?.attributes?.display_name__limio || selectedOffer?.attributes?.display_name__limio || selectedOffer.name }} />
                  <div className="jo-price-display" dangerouslySetInnerHTML={{ __html: selectedOffer?.data?.attributes?.display_price__limio || selectedOffer?.attributes?.display_price__limio || "Contact for pricing" }} />
                  <div className="jo-price-details" dangerouslySetInnerHTML={{ __html: selectedOffer?.data?.attributes?.detailed_display_price__limio || selectedOffer?.attributes?.detailed_display_price__limio || "" }} />
                </div>
                
                {(selectedOffer?.data?.attributes?.offer_features__limio || selectedOffer?.attributes?.offer_features__limio) && (
                  <div className="jo-features-section">
                    <h3 className="jo-features-heading">{featuresTitle}</h3>
                    <div className="jo-feature-list" dangerouslySetInnerHTML={{ __html: selectedOffer?.data?.attributes?.offer_features__limio || selectedOffer?.attributes?.offer_features__limio }} />
                  </div>
                )}
                
                <div className="jo-action-section">
                  <button
                    className="jo-cta-button"
                    onClick={() => handleAddToBasket(selectedOffer)}
                    disabled={basketLoading}
                  >
                    {basketLoading ? ctaLoadingText : (selectedOffer?.data?.attributes?.cta_text__limio || selectedOffer?.attributes?.cta_text__limio || "Get Started")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="jo-empty-state">
                <div className="jo-empty-icon">⚡</div>
                <p className="jo-empty-message">{noOfferSelectedText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const hexToRgb = (hex) => {
  if (!hex) return "0, 0, 0"
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? 
    `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
    "0, 0, 0"
}

module.exports = JazzOffer
module.exports.default = JazzOffer