import React, { useState, useMemo } from "react"
import { 
  useUser, 
  useSubscriptions, 
  useUserInvoices,
  useCampaign,
  useBasket,
  useLimioContext,
  formatDate,
  formatCurrency,
  useSchedule,
  useSubInfo,
  getCurrentOffer,
  sanitiseHTML,
  checkActiveOffers,
  getPriceForUserSubscription,
  getRenewalDateForUserSubscription
} from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { useComponentProps, getPropsFromPackageJson } from "@limio/sdk"
import { format, parseISO, isAfter, isBefore, addDays } from "date-fns"
import xss from "xss"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#000000"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
}

const sanitizeString = (str) => {
  return sanitiseHTML ? sanitiseHTML(str || "") : xss(str || "")
}

const SubscriptionDashboard = () => {
  const props = useComponentProps(defaultProps)
  const {
    dashboardTitle,
    welcomeMessage,
    primaryColor__limio_color,
    accentColor__limio_color,
    showUpgradeOptions,
    showInvoiceHistory,
    showPaymentMethods,
    showUsageMetrics,
    upgradeCtaText,
    cancelCtaText,
    emptyStateText,
    loadingText
  } = props

  const { attributes: user, loaded: userLoaded } = useUser()
  const { subscriptions } = useSubscriptions()
  const { invoices } = useUserInvoices()
  const { offers } = useCampaign()
  const { addOfferToBasket, initiateCheckout, navigateToCheckout, basketLoading, pageOptions } = useBasket()
  const { isInPageBuilder } = useLimioContext() || {}

  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState(null)
  const [expandedInvoice, setExpandedInvoice] = useState(null)

  // Process subscriptions
  const activeSubscriptions = useMemo(() => {
    if (!subscriptions) return []
    return subscriptions.filter(sub => sub.status === 'active')
  }, [subscriptions])

  // Auto-select first subscription if none selected
  const selectedSubscription = useMemo(() => {
    if (!activeSubscriptions.length) return null
    
    // If no subscription selected, select the first one
    if (!selectedSubscriptionId) {
      const firstSub = activeSubscriptions[0]
      setSelectedSubscriptionId(firstSub.id)
      return firstSub
    }
    
    // Find selected subscription
    const found = activeSubscriptions.find(sub => sub.id === selectedSubscriptionId)
    return found || activeSubscriptions[0]
  }, [activeSubscriptions, selectedSubscriptionId])

  // Get current offer for selected subscription
  const currentOffer = useMemo(() => {
    if (!selectedSubscription?.offers) return null
    const activeOffers = checkActiveOffers(selectedSubscription.offers, false)
    return activeOffers.find(offer => offer.data?.record_subtype !== 'discount')?.data?.offer || null
  }, [selectedSubscription])

  // Get upgrade offers for selected subscription
  const upgradeOffers = useMemo(() => {
    if (!currentOffer || !offers) return []
    
    // Get upgrade offer references from current offer
    const upgradeOfferRefs = currentOffer.data?.attributes?.upgrade_offers__limio || []
    
    // Match offers by ID or path
    const matchedOffers = offers.filter(offer => 
      upgradeOfferRefs.some(upgrade => 
        upgrade.id === offer.id || 
        upgrade.path === offer.path ||
        upgrade.path === offer.data?.path
      )
    )
    
    return matchedOffers.slice(0, 3) // Show max 3 upgrade options
  }, [currentOffer, offers])

  // Get invoices for selected subscription
  const subscriptionInvoices = useMemo(() => {
    if (!invoices || !selectedSubscription) return []
    return invoices
      .filter(invoice => 
        invoice.subscription_id === selectedSubscription.id || 
        invoice.subscription_reference === selectedSubscription.reference
      )
      .sort((a, b) => new Date(b.created) - new Date(a.created))
      .slice(0, 10)
  }, [invoices, selectedSubscription])

  // Handle upgrade selection
  const handleUpgrade = async (offer) => {
    if (basketLoading || !selectedSubscription) return
    
    try {
      const checkoutId = getCurrentBasketId()
      if (!checkoutId) {
        await initiateCheckout({ 
          order: { 
            orderItems: [{ 
              offer, 
              type: 'update_subscription',
              subscription: selectedSubscription 
            }] 
          } 
        })
      } else {
        await addOfferToBasket({ 
          offer, 
          type: 'update_subscription',
          subscription: selectedSubscription 
        })
      }
      
      if (pageOptions?.pushToCheckout) {
        await navigateToCheckout()
      }
    } catch (error) {
      console.error('Failed to initiate upgrade:', error)
    }
  }

  // Handle subscription selection
  const handleSubscriptionChange = (subscriptionId) => {
    setSelectedSubscriptionId(subscriptionId)
    setExpandedInvoice(null) // Reset expanded invoice when changing subscription
  }

  // Loading state
  if (!userLoaded) {
    return (
      <div className="sdt-wrapper sdt-loading">
        <div className="sdt-container">
          <div className="sdt-loading-content">
            <div className="sdt-loading-spinner"></div>
            <p>{loadingText}</p>
          </div>
        </div>
      </div>
    )
  }

  // Empty state
  if (!activeSubscriptions.length) {
    return (
      <div className="sdt-wrapper sdt-empty">
        <div className="sdt-container">
          <div className="sdt-empty-content">
            <div className="sdt-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2>{emptyStateText}</h2>
            <p>Start exploring our subscription options to get access to premium features.</p>
          </div>
        </div>
      </div>
    )
  }

  const selectedSubInfo = useSubInfo(selectedSubscription)
  const scheduleInfo = useSchedule(selectedSubscription)

  return (
    <div 
      className="sdt-wrapper"
      style={{
        "--sdt-primary": primaryColor__limio_color || "#424770",
        "--sdt-accent": accentColor__limio_color || "#635BFF",
        "--sdt-primary-contrast": getContrastColor(primaryColor__limio_color || "#424770"),
        "--sdt-accent-contrast": getContrastColor(accentColor__limio_color || "#635BFF")
      }}
    >
      <div className="sdt-container">
        {/* Header */}
        <div className="sdt-header">
          <div className="sdt-header-content">
            <h1 className="sdt-title">{dashboardTitle}</h1>
            <p className="sdt-subtitle">{welcomeMessage}</p>
          </div>
          {user?.firstName && (
            <div className="sdt-user-info">
              <div className="sdt-user-avatar">
                {user.firstName.charAt(0)}{user.lastName?.charAt(0) || ""}
              </div>
              <div className="sdt-user-details">
                <div className="sdt-user-name">{user.firstName} {user.lastName}</div>
                <div className="sdt-user-email">{user.email}</div>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Selector */}
        {activeSubscriptions.length > 1 && (
          <div className="sdt-subscription-selector">
            <label htmlFor="subscription-select" className="sdt-selector-label">
              Select Subscription:
            </label>
            <select 
              id="subscription-select"
              className="sdt-selector"
              value={selectedSubscription?.id || ''}
              onChange={(e) => handleSubscriptionChange(e.target.value)}
            >
              {activeSubscriptions.map((sub) => {
                const subOffer = (() => {
                  if (!sub?.offers) return null
                  const activeOffers = checkActiveOffers(sub.offers, false)
                  return activeOffers.find(offer => offer.data?.record_subtype !== 'discount')?.data?.offer || null
                })()
                
                return (
                  <option key={sub.id} value={sub.id}>
                    {subOffer?.data?.attributes?.display_name__limio || `Subscription ${sub.reference || sub.id}`}
                  </option>
                )
              })}
            </select>
          </div>
        )}

        {/* Navigation */}
        <nav className="sdt-nav">
          <button 
            className={`sdt-nav-item ${selectedTab === 'overview' ? 'sdt-nav-item-active' : ''}`}
            onClick={() => setSelectedTab('overview')}
            type="button"
          >
            Overview
          </button>
          {showUpgradeOptions && upgradeOffers.length > 0 && (
            <button 
              className={`sdt-nav-item ${selectedTab === 'upgrade' ? 'sdt-nav-item-active' : ''}`}
              onClick={() => setSelectedTab('upgrade')}
              type="button"
            >
              Upgrade
            </button>
          )}
          {showInvoiceHistory && subscriptionInvoices.length > 0 && (
            <button 
              className={`sdt-nav-item ${selectedTab === 'billing' ? 'sdt-nav-item-active' : ''}`}
              onClick={() => setSelectedTab('billing')}
              type="button"
            >
              Billing
            </button>
          )}
          <button 
            className={`sdt-nav-item ${selectedTab === 'settings' ? 'sdt-nav-item-active' : ''}`}
            onClick={() => setSelectedTab('settings')}
            type="button"
          >
            Settings
          </button>
        </nav>

        {/* Tab Content */}
        <div className="sdt-content">
          {selectedTab === 'overview' && (
            <div className="sdt-overview">
              {/* Current Subscription Card */}
              <div className="sdt-card sdt-subscription-card">
                <div className="sdt-card-header">
                  <h2>
                    {activeSubscriptions.length > 1 ? 'Selected Subscription' : 'Current Subscription'}
                  </h2>
                  <div className={`sdt-status sdt-status-${selectedSubscription.status}`}>
                    {selectedSubscription.status}
                  </div>
                </div>
                
                <div className="sdt-subscription-details">
                  {currentOffer && (
                    <div className="sdt-plan-info">
                      <h3>{currentOffer.data?.attributes?.display_name__limio || "Current Plan"}</h3>
                      {currentOffer.data?.attributes?.display_price__limio && (
                        <div 
                          className="sdt-price" 
                          dangerouslySetInnerHTML={{ 
                            __html: sanitizeString(currentOffer.data.attributes.display_price__limio) 
                          }} 
                        />
                      )}
                      {currentOffer.data?.attributes?.detailed_display_price__limio && (
                        <div 
                          className="sdt-price-detail" 
                          dangerouslySetInnerHTML={{ 
                            __html: sanitizeString(currentOffer.data.attributes.detailed_display_price__limio) 
                          }} 
                        />
                      )}
                    </div>
                  )}

                  <div className="sdt-subscription-meta">
                    <div className="sdt-meta-row">
                      <span className="sdt-meta-label">Started</span>
                      <span className="sdt-meta-value">
                        {formatDate ? formatDate(selectedSubscription.created, "DATE_MED") : 
                         format(parseISO(selectedSubscription.created), "MMM d, yyyy")}
                      </span>
                    </div>
                    
                    {(scheduleInfo?.termEndDate || selectedSubscription?.schedule?.[0]?.end) && (
                      <div className="sdt-meta-row">
                        <span className="sdt-meta-label">Next Billing</span>
                        <span className="sdt-meta-value">
                          {scheduleInfo?.termEndDate || 
                           (selectedSubscription?.schedule?.[0]?.end && 
                            (formatDate ? formatDate(selectedSubscription.schedule[0].end, "DATE_MED") : 
                             format(parseISO(selectedSubscription.schedule[0].end), "MMM d, yyyy"))
                           )}
                        </span>
                      </div>
                    )}
                    
                    {(scheduleInfo?.nextPaymentAmount || selectedSubscription?.schedule?.[0]?.amount) && (
                      <div className="sdt-meta-row">
                        <span className="sdt-meta-label">Next Amount</span>
                        <span className="sdt-meta-value">
                          {scheduleInfo?.nextPaymentAmount || 
                           (selectedSubscription?.schedule?.[0] && formatCurrency ? 
                            formatCurrency(selectedSubscription.schedule[0].amount, selectedSubscription.schedule[0].currency) :
                            `${selectedSubscription?.schedule?.[0]?.currency || ''} ${selectedSubscription?.schedule?.[0]?.amount || ''}`
                           )}
                        </span>
                      </div>
                    )}
                    
                    <div className="sdt-meta-row">
                      <span className="sdt-meta-label">Reference</span>
                      <span className="sdt-meta-value sdt-reference">
                        {selectedSubscription.reference || selectedSubscription.id}
                      </span>
                    </div>
                  </div>
                </div>

                {currentOffer?.data?.attributes?.offer_features__limio && (
                  <div className="sdt-features">
                    <h4>Plan Features</h4>
                    <div 
                      className="sdt-features-list"
                      dangerouslySetInnerHTML={{ 
                        __html: sanitizeString(currentOffer.data.attributes.offer_features__limio) 
                      }} 
                    />
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="sdt-card sdt-actions-card">
                <div className="sdt-card-header">
                  <h2>Quick Actions</h2>
                </div>
                
                <div className="sdt-actions">
                  {showUpgradeOptions && upgradeOffers.length > 0 && (
                    <button 
                      className="sdt-btn sdt-btn-primary"
                      onClick={() => setSelectedTab('upgrade')}
                      type="button"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 12V4m0 0l3 3m-3-3L5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {upgradeCtaText}
                    </button>
                  )}
                  
                  <button 
                    className="sdt-btn sdt-btn-secondary"
                    onClick={() => setSelectedTab('billing')}
                    type="button"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M2 4h12M2 4v8a1 1 0 001 1h10a1 1 0 001-1V4M2 4l1-1h10l1 1M6 7v2M10 7v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    View Billing
                  </button>
                  
                  <button 
                    className="sdt-btn sdt-btn-ghost"
                    onClick={() => setSelectedTab('settings')}
                    type="button"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 10a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12.9 8.3c.1-.1.1-.2.1-.3 0-.1 0-.2-.1-.3l-.6-.5c0-.2 0-.4-.1-.6l.5-.6c.1-.1.1-.2 0-.3l-1.1-1.1c-.1-.1-.2-.1-.3 0l-.6.5c-.2 0-.4-.1-.6-.1l-.5-.6c-.1-.1-.2-.1-.3-.1h-1.6c-.1 0-.2 0-.3.1l-.5.6c-.2 0-.4.1-.6.1l-.6-.5c-.1-.1-.2-.1-.3 0L3.9 6.1c-.1.1-.1.2 0 .3l.5.6c0 .2-.1.4-.1.6l-.6.5c-.1.1-.1.2-.1.3 0 .1 0 .2.1.3l.6.5c0 .2 0 .4.1.6l-.5.6c-.1.1-.1.2 0 .3l1.1 1.1c.1.1.2.1.3 0l.6-.5c.2 0 .4.1.6.1l.5.6c.1.1.2.1.3.1h1.6c.1 0 .2 0 .3-.1l.5-.6c.2 0 .4-.1.6-.1l.6.5c.1.1.2.1.3 0l1.1-1.1c.1-.1.1-.2 0-.3l-.5-.6c0-.2.1-.4.1-.6l.6-.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Settings
                  </button>
                </div>
              </div>

              {/* Usage Metrics (if enabled) */}
              {showUsageMetrics && (
                <div className="sdt-card sdt-usage-card">
                  <div className="sdt-card-header">
                    <h2>Usage This Month</h2>
                  </div>
                  <div className="sdt-usage-placeholder">
                    <p>Usage metrics would be displayed here with real data from your subscription service.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'upgrade' && showUpgradeOptions && (
            <div className="sdt-upgrade">
              <div className="sdt-section-header">
                <h2>Upgrade Your Plan</h2>
                <p>Choose a plan that better fits your needs</p>
              </div>
              
              <div className="sdt-upgrade-grid">
                {upgradeOffers.length > 0 ? upgradeOffers.map((offer) => {
                  const attributes = offer?.data?.attributes || {}
                  return (
                    <div key={offer.id} className="sdt-card sdt-upgrade-card">
                      <div className="sdt-upgrade-header">
                        <h3>{attributes.display_name__limio || "Upgrade Plan"}</h3>
                        {attributes.display_price__limio && (
                          <div 
                            className="sdt-upgrade-price"
                            dangerouslySetInnerHTML={{ 
                              __html: sanitizeString(attributes.display_price__limio) 
                            }} 
                          />
                        )}
                      </div>
                      
                      {attributes.offer_features__limio && (
                        <div 
                          className="sdt-upgrade-features"
                          dangerouslySetInnerHTML={{ 
                            __html: sanitizeString(attributes.offer_features__limio) 
                          }} 
                        />
                      )}
                      
                      <button
                        className="sdt-btn sdt-btn-primary sdt-upgrade-btn"
                        onClick={() => handleUpgrade(offer)}
                        disabled={basketLoading}
                        type="button"
                      >
                        {basketLoading ? "Processing..." : attributes.cta_text__limio || "Upgrade Now"}
                      </button>
                    </div>
                  )
                }) : (
                  <div className="sdt-card">
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--sdt-text-secondary)' }}>
                      <p>No upgrade options found.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedTab === 'billing' && showInvoiceHistory && (
            <div className="sdt-billing">
              <div className="sdt-section-header">
                <h2>Billing History</h2>
                <p>View and download your invoices</p>
              </div>
              
              {subscriptionInvoices.length > 0 ? (
                <div className="sdt-card sdt-invoices-card">
                  <div className="sdt-invoices-list">
                    {subscriptionInvoices.map((invoice, index) => (
                      <div key={invoice.id || index} className="sdt-invoice-item">
                        <div className="sdt-invoice-main">
                          <div className="sdt-invoice-info">
                            <span className="sdt-invoice-date">
                              {formatDate ? formatDate(invoice.created, "DATE_MED") : 
                               format(parseISO(invoice.created), "MMM d, yyyy")}
                            </span>
                            <span className="sdt-invoice-amount">
                              {invoice.total && invoice.currency ? 
                                (formatCurrency ? formatCurrency(invoice.total, invoice.currency) : 
                                 `${invoice.currency} ${invoice.total}`) : 
                                "—"}
                            </span>
                          </div>
                          <div className="sdt-invoice-actions">
                            <span className={`sdt-invoice-status sdt-status-${invoice.status || 'unknown'}`}>
                              {invoice.status || "Unknown"}
                            </span>
                            <button
                              className="sdt-btn-icon"
                              onClick={() => setExpandedInvoice(expandedInvoice === invoice.id ? null : invoice.id)}
                              type="button"
                              aria-label="View invoice details"
                            >
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 9l2 2 2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {expandedInvoice === invoice.id && (
                          <div className="sdt-invoice-details">
                            <div className="sdt-invoice-meta">
                              {invoice.reference && (
                                <div className="sdt-meta-row">
                                  <span className="sdt-meta-label">Reference</span>
                                  <span className="sdt-meta-value sdt-reference">{invoice.reference}</span>
                                </div>
                              )}
                              {invoice.description && (
                                <div className="sdt-meta-row">
                                  <span className="sdt-meta-label">Description</span>
                                  <span className="sdt-meta-value">{invoice.description}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="sdt-card sdt-empty-invoices">
                  <p>No billing history available</p>
                </div>
              )}
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="sdt-settings">
              <div className="sdt-section-header">
                <h2>Subscription Settings</h2>
                <p>Manage your subscription preferences</p>
              </div>
              
              <div className="sdt-settings-grid">
                <div className="sdt-card sdt-settings-card">
                  <div className="sdt-card-header">
                    <h3>Account Information</h3>
                  </div>
                  <div className="sdt-settings-content">
                    {user?.email && (
                      <div className="sdt-meta-row">
                        <span className="sdt-meta-label">Email</span>
                        <span className="sdt-meta-value">{user.email}</span>
                      </div>
                    )}
                    {user?.firstName && (
                      <div className="sdt-meta-row">
                        <span className="sdt-meta-label">Name</span>
                        <span className="sdt-meta-value">{user.firstName} {user.lastName || ""}</span>
                      </div>
                    )}
                    <div className="sdt-meta-row">
                      <span className="sdt-meta-label">Subscription ID</span>
                      <span className="sdt-meta-value sdt-reference">
                        {selectedSubscription.reference || selectedSubscription.id}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sdt-card sdt-settings-card">
                  <div className="sdt-card-header">
                    <h3>Subscription Status</h3>
                  </div>
                  <div className="sdt-settings-content">
                    <div className="sdt-meta-row">
                      <span className="sdt-meta-label">Status</span>
                      <span className={`sdt-status sdt-status-${selectedSubscription.status}`}>
                        {selectedSubscription.status}
                      </span>
                    </div>
                    {selectedSubInfo?.isGift && (
                      <div className="sdt-meta-row">
                        <span className="sdt-meta-label">Type</span>
                        <span className="sdt-meta-value">Gift Subscription</span>
                      </div>
                    )}
                    {selectedSubscription?.mode && (
                      <div className="sdt-meta-row">
                        <span className="sdt-meta-label">Environment</span>
                        <span className="sdt-meta-value">{selectedSubscription.mode}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="sdt-card sdt-danger-card">
                  <div className="sdt-card-header">
                    <h3>Danger Zone</h3>
                  </div>
                  <div className="sdt-settings-content">
                    <p>Cancel your subscription. This action cannot be undone.</p>
                    <button className="sdt-btn sdt-btn-danger" type="button">
                      {cancelCtaText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SubscriptionDashboard