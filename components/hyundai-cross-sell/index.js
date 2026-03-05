import React from "react"
import { useComponentProps, getPropsFromPackageJson, useCampaign, useBasket, sanitiseHTML } from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#000000"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
}

const HyundaiCrossSell = () => {
  const props = useComponentProps(defaultProps)
  const { 
    headline,
    subheadline,
    upgradesSectionTitle,
    upgradesDescription,
    addOnsSectionTitle,
    addOnsDescription,
    primaryColor__limio_color,
    showUpgrades,
    showAddOns,
    maxItemsPerSection
  } = props

  const { offers, addOns } = useCampaign()
  const { addOfferToBasket, addToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()

  // Get cross-sell upgrades from offers
  const crossSellUpgrades = React.useMemo(() => {
    if (!showUpgrades || !Array.isArray(offers)) return []
    
    const upgrades = []
    offers.forEach(offer => {
      const attributes = offer?.data?.attributes || {}
      
      // Look for cross_sell_addons__limio with item_type "offer" for upgrades
      if (attributes.cross_sell_addons__limio && Array.isArray(attributes.cross_sell_addons__limio)) {
        attributes.cross_sell_addons__limio.forEach(crossSellGroup => {
          if (crossSellGroup.item_type === "offer" && Array.isArray(crossSellGroup.items)) {
            crossSellGroup.items.forEach(item => {
              // Find the full offer data by ID
              const upgradeOffer = offers.find(o => o.id === item.id)
              if (upgradeOffer && !upgrades.find(u => u.id === item.id)) {
                upgrades.push(upgradeOffer)
              }
            })
          }
        })
      }
    })
    
    return upgrades.slice(0, parseInt(maxItemsPerSection) || 3)
  }, [offers, showUpgrades, maxItemsPerSection])

  // Get cross-sell add-ons from offers
  const crossSellAddOns = React.useMemo(() => {
    if (!showAddOns || !Array.isArray(offers)) return []
    
    const crossSellAddOnItems = []
    offers.forEach(offer => {
      const attributes = offer?.data?.attributes || {}
      
      // Look for cross_sell_addons__limio with item_type "add_on"
      if (attributes.cross_sell_addons__limio && Array.isArray(attributes.cross_sell_addons__limio)) {
        attributes.cross_sell_addons__limio.forEach(crossSellGroup => {
          if (crossSellGroup.item_type === "add_on" && Array.isArray(crossSellGroup.items)) {
            crossSellGroup.items.forEach(item => {
              // Find the add-on by ID
              const addOn = addOns?.find(a => a.id === item.id)
              if (addOn && !crossSellAddOnItems.find(c => c.id === item.id)) {
                crossSellAddOnItems.push(addOn)
              }
            })
          }
        })
      }
    })
    
    return crossSellAddOnItems.slice(0, parseInt(maxItemsPerSection) || 3)
  }, [offers, addOns, showAddOns, maxItemsPerSection])

  const handleAddToBasket = async (item, isAddOn = false) => {
    if (basketLoading) return
    
    try {
      const checkoutId = getCurrentBasketId()
      
      if (isAddOn) {
        if (!checkoutId) {
          await initiateCheckout({ order: { orderItems: [] } })
        }
        await addToBasket(item)
      } else {
        if (!checkoutId) {
          await initiateCheckout({ order: { orderItems: [{ offer: item }] } })
        } else {
          await addOfferToBasket({ offer: item })
        }
      }
      
      if (pageOptions?.pushToCheckout) {
        await navigateToCheckout()
      }
    } catch (error) {
      console.error('Error adding to basket:', error)
    }
  }

  const renderOfferCard = (offer, isUpgrade = false) => {
    const attributes = offer?.data?.attributes || {}
    const displayName = attributes.display_name__limio || offer?.name || 'Plan'
    const displayPrice = attributes.display_price__limio
    const description = attributes.upsell_display_description__limio || attributes.checkout_description__limio
    const features = attributes.offer_features__limio
    const ctaText = isUpgrade ? (attributes.upgrade_cta__limio || 'Upgrade') : (attributes.cta_text__limio || 'Add to Cart')

    return (
      <div key={offer?.id || Math.random()} className="hcs-item-card">
        <div className="hcs-item-header">
          <h3 className="hcs-item-title">{displayName}</h3>
          {displayPrice && (
            <div className="hcs-item-price" dangerouslySetInnerHTML={{ __html: sanitiseHTML(displayPrice) }} />
          )}
        </div>
        
        {description && (
          <div className="hcs-item-description" dangerouslySetInnerHTML={{ __html: sanitiseHTML(description) }} />
        )}
        
        {features && (
          <div className="hcs-item-features" dangerouslySetInnerHTML={{ __html: sanitiseHTML(features) }} />
        )}
        
        <button
          type="button"
          className="hcs-item-cta"
          onClick={() => handleAddToBasket(offer, false)}
          disabled={basketLoading}
        >
          {basketLoading ? 'Adding...' : ctaText}
        </button>
      </div>
    )
  }

  const renderAddOnCard = (addOn) => {
    const attributes = addOn?.data?.attributes || {}
    const displayName = attributes.display_name__limio || addOn?.name || 'Service'
    const displayPrice = attributes.display_price__limio
    const description = attributes.description__limio || attributes.checkout_description__limio
    const features = attributes.offer_features__limio
    const ctaText = attributes.cta_text__limio || 'Add Service'

    return (
      <div key={addOn?.id || Math.random()} className="hcs-item-card">
        <div className="hcs-item-header">
          <h3 className="hcs-item-title">{displayName}</h3>
          {displayPrice && (
            <div className="hcs-item-price" dangerouslySetInnerHTML={{ __html: sanitiseHTML(displayPrice) }} />
          )}
        </div>
        
        {description && (
          <div className="hcs-item-description" dangerouslySetInnerHTML={{ __html: sanitiseHTML(description) }} />
        )}
        
        {features && (
          <div className="hcs-item-features" dangerouslySetInnerHTML={{ __html: sanitiseHTML(features) }} />
        )}
        
        <button
          type="button"
          className="hcs-item-cta hcs-item-cta-secondary"
          onClick={() => handleAddToBasket(addOn, true)}
          disabled={basketLoading}
        >
          {basketLoading ? 'Adding...' : ctaText}
        </button>
      </div>
    )
  }

  // Don't render if no cross-sell items
  if ((!crossSellUpgrades.length && !crossSellAddOns.length) || (!showUpgrades && !showAddOns)) {
    return null
  }

  return (
    <div 
      className="hcs-wrapper"
      style={{ 
        "--hcs-primary": primaryColor__limio_color || "#0066CC",
        "--hcs-primary-tint": primaryColor__limio_color ? `color-mix(in srgb, ${primaryColor__limio_color} 6%, white)` : "#f0f8ff",
        "--hcs-contrast": getContrastColor(primaryColor__limio_color || "#0066CC")
      }}
    >
      <div className="hcs-container">
        <div className="hcs-header">
          <h2 className="hcs-headline">{headline}</h2>
          <p className="hcs-subheadline">{subheadline}</p>
        </div>

        {showUpgrades && crossSellUpgrades.length > 0 && (
          <div className="hcs-section">
            <div className="hcs-section-header">
              <h3 className="hcs-section-title">{upgradesSectionTitle}</h3>
              <p className="hcs-section-description">{upgradesDescription}</p>
            </div>
            <div className="hcs-items-grid">
              {crossSellUpgrades.map(upgrade => renderOfferCard(upgrade, true))}
            </div>
          </div>
        )}

        {showAddOns && crossSellAddOns.length > 0 && (
          <div className="hcs-section">
            <div className="hcs-section-header">
              <h3 className="hcs-section-title">{addOnsSectionTitle}</h3>
              <p className="hcs-section-description">{addOnsDescription}</p>
            </div>
            <div className="hcs-items-grid">
              {crossSellAddOns.map(addOn => renderAddOnCard(addOn))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HyundaiCrossSell