import React, { useState, useMemo, useEffect } from "react"
import { 
  useUser, 
  useSubscriptions, 
  useBasket, 
  useCampaign,
  useLimioContext,
  useComponentProps,
  getPropsFromPackageJson,
  sanitiseHTML
} from "@limio/sdk"
import { getCurrentBasketId } from "@limio/shop/src/shop/checkout/basket"
import { format, parseISO, isValid } from "date-fns"
import * as R from "ramda"
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

const formatDate = (dateString, dateFormat) => {
  if (!dateString) return "—"
  try {
    const date = parseISO(dateString)
    return isValid(date) ? format(date, dateFormat) : "—"
  } catch (error) {
    return "—"
  }
}

const formatCurrency = (amount, currency) => {
  if (!amount && amount !== 0) return "—"
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount / 100)
  } catch (error) {
    return `${currency || '$'} ${(amount / 100).toFixed(2)}`
  }
}

const getSubscriptionStatus = (subscription) => {
  if (!subscription) return "Unknown"
  
  const status = subscription.status?.toLowerCase()
  if (status === "active") return "Active"
  if (status === "cancelled") return "Cancelled"
  if (status === "expired") return "Expired"
  if (status === "pending") return "Pending"
  if (status === "paused") return "Paused"
  return "Unknown"
}

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "active": return "#28a745"
    case "cancelled": return "#dc3545"
    case "expired": return "#6c757d"
    case "pending": return "#ffc107"
    case "paused": return "#17a2b8"
    default: return "#6c757d"
  }
}

const getCurrentOffer = (subscription) => {
  if (!subscription?.offers || !Array.isArray(subscription.offers)) return null
  
  // Filter out discount offers and find current active standard offer
  const standardOffers = subscription.offers.filter(offer => 
    offer.record_subtype !== "discount"
  )
  
  if (standardOffers.length === 0) return null
  
  // Find the current active offer based on dates
  const now = new Date()
  const currentOffer = standardOffers.find(offer => {
    const start = offer.start ? parseISO(offer.start) : null
    const end = offer.end ? parseISO(offer.end) : null
    
    if (start && end) {
      return now >= start && now <= end
    } else if (start) {
      return now >= start
    } else if (end) {
      return now <= end
    }
    return true // No date constraints
  })
  
  return currentOffer || standardOffers[0]
}

const SubscriberDashboard = () => {
  const props = useComponentProps(defaultProps)
  const { 
    dashboardTitle,
    welcomeMessage__limio_richtext,
    primaryColor__limio_color,
    accentColor__limio_color,
    showPaymentMethods,
    showBillingHistory,
    showUsageMetrics,
    showNotifications,
    maxSubscriptions,
    dateFormat,
    emptyStateMessage,
    ctaText,
    ctaUrl,
    supportEmail,
    supportPhone,
    quickActions
  } = props

  const { attributes: userAttributes, loginStatus, loaded: userLoaded, token } = useUser()
  const { subscriptions } = useSubscriptions()
  const { offers } = useCampaign()
  const { 
    orderItems, 
    basketLoading, 
    addOfferToBasket, 
    initiateCheckout, 
    navigateToCheckout,
    pageOptions 
  } = useBasket()
  const { isInPageBuilder } = useLimioContext() || {}

  const [activeTab, setActiveTab] = useState("overview")
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true
  })

  // Safe data extraction - use mock data in page builder
  const userEmail = userAttributes?.email || userAttributes?.user_email || (isInPageBuilder ? "demo@example.com" : "")
  const userName = userAttributes?.first_name || userAttributes?.given_name || userAttributes?.name || (isInPageBuilder ? "Demo" : "")
  const userLastName = userAttributes?.last_name || userAttributes?.family_name || (isInPageBuilder ? "User" : "")
  const displayName = userName || userLastName ? `${userName} ${userLastName}`.trim() : userEmail

  // Process subscriptions - use mock data in page builder
  const activeSubscriptions = useMemo(() => {
    if (!Array.isArray(subscriptions)) {
      // Provide mock data in page builder for preview
      if (isInPageBuilder) {
        return [
          {
            id: "demo-sub-1",
            reference: "SUB-001",
            name: "Premium Plan",
            displayName: "Premium Plan",
            displayPrice: "$29.99/month",
            nextBillingDate: "2024-04-15T00:00:00Z",
            created: "2023-10-15T00:00:00Z",
            status: "Active",
            currentOffer: {
              data: {
                attributes: {
                  display_name__limio: "Premium Plan",
                  display_price__limio: "$29.99/month",
                  price__limio: [{ value: 2999, currencyCode: "USD" }]
                }
              }
            }
          },
          {
            id: "demo-sub-2", 
            reference: "SUB-002",
            name: "Basic Plan",
            displayName: "Basic Plan", 
            displayPrice: "$9.99/month",
            nextBillingDate: "2024-04-20T00:00:00Z",
            created: "2023-09-01T00:00:00Z",
            status: "Active",
            currentOffer: {
              data: {
                attributes: {
                  display_name__limio: "Basic Plan",
                  display_price__limio: "$9.99/month", 
                  price__limio: [{ value: 999, currencyCode: "USD" }]
                }
              }
            }
          }
        ].slice(0, parseInt(maxSubscriptions) || 10)
      }
      return []
    }
    
    return subscriptions
      .filter(sub => sub && getSubscriptionStatus(sub) === "Active")
      .slice(0, parseInt(maxSubscriptions) || 10)
      .map(subscription => {
        const currentOffer = getCurrentOffer(subscription)
        const attributes = currentOffer?.data?.attributes || {}
        
        return {
          ...subscription,
          currentOffer,
          displayName: attributes.display_name__limio || subscription.name || "Subscription",
          displayPrice: attributes.display_price__limio || "",
          nextBillingDate: subscription.next_billing_date || subscription.renewalDate,
          status: getSubscriptionStatus(subscription)
        }
      })
  }, [subscriptions, maxSubscriptions, isInPageBuilder])

  // Mock data for demo purposes (in real app, this would come from API)
  const mockBillingHistory = [
    { id: "1", date: "2024-01-15", amount: 2900, currency: "USD", status: "Paid", description: "Monthly subscription" },
    { id: "2", date: "2023-12-15", amount: 2900, currency: "USD", status: "Paid", description: "Monthly subscription" },
    { id: "3", date: "2023-11-15", amount: 2900, currency: "USD", status: "Paid", description: "Monthly subscription" }
  ]

  const mockPaymentMethods = [
    { id: "1", type: "card", last4: "4242", brand: "Visa", expiryMonth: "12", expiryYear: "2026", isDefault: true },
    { id: "2", type: "card", last4: "0005", brand: "Mastercard", expiryMonth: "09", expiryYear: "2025", isDefault: false }
  ]

  const mockUsageMetrics = {
    currentPeriod: {
      used: 1250,
      limit: 5000,
      unit: "API calls"
    },
    previousPeriod: {
      used: 980,
      limit: 5000,
      unit: "API calls"
    }
  }

  const handleAddToBasket = async (offer) => {
    if (basketLoading) return
    
    try {
      const checkoutId = getCurrentBasketId()
      if (!checkoutId) {
        await initiateCheckout({ order: { orderItems: [{ offer }] } })
      } else {
        await addOfferToBasket({ offer })
      }
      if (pageOptions?.pushToCheckout) {
        await navigateToCheckout()
      }
    } catch (error) {
      console.error('Error adding to basket:', error)
    }
  }

  const handleQuickAction = (action) => {
    if (action.url && action.url.trim()) {
      window.location.href = action.url
    }
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "subscriptions", label: "Subscriptions" },
    ...(showPaymentMethods ? [{ id: "payment", label: "Payment" }] : []),
    ...(showBillingHistory ? [{ id: "billing", label: "Billing" }] : []),
    { id: "settings", label: "Settings" }
  ]

  if (!userLoaded) {
    return <SubscriberDashboard.Skeleton />
  }

  // Skip login check when in page builder or editor mode
  if (loginStatus !== "logged_in" && !isInPageBuilder) {
    return (
      <div 
        className="sd-wrapper sd-login-prompt"
        style={{ 
          "--sd-primary": primaryColor__limio_color || "#424770",
          "--sd-accent": accentColor__limio_color || "#635bff",
          "--sd-contrast": getContrastColor(primaryColor__limio_color || "#424770")
        }}
      >
        <div className="sd-login-card">
          <h2>Please Log In</h2>
          <p>Access your account dashboard by logging in to view your subscriptions and account details.</p>
          <button 
            className="sd-btn sd-btn-primary" 
            onClick={() => {
              window.location.href = "/login"
            }}
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="sd-wrapper"
      style={{ 
        "--sd-primary": primaryColor__limio_color || "#424770",
        "--sd-accent": accentColor__limio_color || "#635bff", 
        "--sd-contrast": getContrastColor(primaryColor__limio_color || "#424770")
      }}
    >
      {/* Header */}
      <header className="sd-header">
        <div className="sd-container">
          <div className="sd-header-content">
            <div className="sd-header-info">
              <h1 className="sd-title">{dashboardTitle}</h1>
              <div 
                className="sd-welcome" 
                dangerouslySetInnerHTML={{ 
                  __html: sanitiseHTML(welcomeMessage__limio_richtext) || xss(welcomeMessage__limio_richtext) 
                }} 
              />
            </div>
            <div className="sd-user-info">
              <div className="sd-user-avatar">
                {(userName || userEmail).charAt(0).toUpperCase()}
              </div>
              <div className="sd-user-details">
                <div className="sd-user-name">{displayName}</div>
                <div className="sd-user-email">{userEmail}</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="sd-nav">
        <div className="sd-container">
          <div className="sd-nav-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`sd-nav-tab ${activeTab === tab.id ? 'sd-nav-tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="sd-main">
        <div className="sd-container">
          
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="sd-content">
              <div className="sd-stats-grid">
                <div className="sd-stat-card">
                  <div className="sd-stat-label">Active Subscriptions</div>
                  <div className="sd-stat-value">{activeSubscriptions.length}</div>
                </div>
                <div className="sd-stat-card">
                  <div className="sd-stat-label">Total Monthly Spend</div>
                  <div className="sd-stat-value">
                    {formatCurrency(
                      activeSubscriptions.reduce((total, sub) => {
                        const price = sub.currentOffer?.data?.attributes?.price__limio?.[0]?.value
                        return total + (parseInt(price) || 0)
                      }, 0), 
                      "USD"
                    )}
                  </div>
                </div>
                <div className="sd-stat-card">
                  <div className="sd-stat-label">Account Status</div>
                  <div className="sd-stat-value sd-stat-status">
                    <span className="sd-status-dot" style={{ backgroundColor: "#28a745" }}></span>
                    Good Standing
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {Array.isArray(quickActions) && quickActions.length > 0 && (
                <section className="sd-section">
                  <h2 className="sd-section-title">Quick Actions</h2>
                  <div className="sd-quick-actions">
                    {quickActions.map((action, index) => (
                      <button
                        key={action.id || index}
                        type="button"
                        className="sd-quick-action"
                        onClick={() => handleQuickAction(action)}
                      >
                        <div className="sd-quick-action-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Recent Subscriptions */}
              {activeSubscriptions.length > 0 && (
                <section className="sd-section">
                  <h2 className="sd-section-title">Recent Activity</h2>
                  <div className="sd-activity-list">
                    {activeSubscriptions.slice(0, 3).map(subscription => (
                      <div key={subscription.id} className="sd-activity-item">
                        <div className="sd-activity-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <div className="sd-activity-content">
                          <div className="sd-activity-title">{subscription.displayName}</div>
                          <div className="sd-activity-meta">
                            Next billing: {formatDate(subscription.nextBillingDate, dateFormat)}
                          </div>
                        </div>
                        <div className="sd-activity-status">
                          <span 
                            className="sd-status-badge" 
                            style={{ backgroundColor: getStatusColor(subscription.status) }}
                          >
                            {subscription.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Usage Metrics */}
              {showUsageMetrics && (
                <section className="sd-section">
                  <h2 className="sd-section-title">Usage This Month</h2>
                  <div className="sd-usage-card">
                    <div className="sd-usage-header">
                      <div className="sd-usage-title">API Calls</div>
                      <div className="sd-usage-count">
                        {mockUsageMetrics.currentPeriod.used.toLocaleString()} / {mockUsageMetrics.currentPeriod.limit.toLocaleString()}
                      </div>
                    </div>
                    <div className="sd-usage-bar">
                      <div 
                        className="sd-usage-progress" 
                        style={{ 
                          width: `${(mockUsageMetrics.currentPeriod.used / mockUsageMetrics.currentPeriod.limit) * 100}%` 
                        }}
                      />
                    </div>
                    <div className="sd-usage-comparison">
                      Last month: {mockUsageMetrics.previousPeriod.used.toLocaleString()} calls
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === "subscriptions" && (
            <div className="sd-content">
              <div className="sd-section-header">
                <h2 className="sd-section-title">My Subscriptions</h2>
                {ctaUrl && ctaUrl.trim() && (
                  <a href={ctaUrl} className="sd-btn sd-btn-secondary">
                    {ctaText}
                  </a>
                )}
              </div>

              {activeSubscriptions.length === 0 ? (
                <div className="sd-empty-state">
                  <div className="sd-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="sd-empty-title">{emptyStateMessage}</h3>
                  {ctaUrl && ctaUrl.trim() && (
                    <a href={ctaUrl} className="sd-btn sd-btn-primary">
                      {ctaText}
                    </a>
                  )}
                </div>
              ) : (
                <div className="sd-subscriptions-grid">
                  {activeSubscriptions.map(subscription => (
                    <div key={subscription.id} className="sd-subscription-card">
                      <div className="sd-subscription-header">
                        <div className="sd-subscription-info">
                          <h3 className="sd-subscription-name">{subscription.displayName}</h3>
                          <div className="sd-subscription-ref">Ref: {subscription.reference || subscription.id}</div>
                        </div>
                        <span 
                          className="sd-status-badge" 
                          style={{ backgroundColor: getStatusColor(subscription.status) }}
                        >
                          {subscription.status}
                        </span>
                      </div>
                      
                      <div className="sd-subscription-price">
                        {subscription.displayPrice ? (
                          <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(subscription.displayPrice) || xss(subscription.displayPrice) }} />
                        ) : (
                          <div>
                            {formatCurrency(
                              subscription.currentOffer?.data?.attributes?.price__limio?.[0]?.value,
                              subscription.currentOffer?.data?.attributes?.price__limio?.[0]?.currencyCode || "USD"
                            )}
                          </div>
                        )}
                      </div>

                      <div className="sd-subscription-details">
                        <div className="sd-detail-row">
                          <span className="sd-detail-label">Next billing</span>
                          <span className="sd-detail-value">
                            {formatDate(subscription.nextBillingDate, dateFormat)}
                          </span>
                        </div>
                        <div className="sd-detail-row">
                          <span className="sd-detail-label">Started</span>
                          <span className="sd-detail-value">
                            {formatDate(subscription.created, dateFormat)}
                          </span>
                        </div>
                      </div>

                      <div className="sd-subscription-actions">
                        <button 
                          type="button" 
                          className="sd-btn sd-btn-outline"
                          onClick={() => {
                            const subscriptionId = subscription.reference || subscription.id
                            if (subscriptionId) {
                              window.location.href = `/account/subscription/${subscriptionId}`
                            }
                          }}
                        >
                          Manage
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && showPaymentMethods && (
            <div className="sd-content">
              <section className="sd-section">
                <h2 className="sd-section-title">Payment Methods</h2>
                <div className="sd-payment-methods">
                  {mockPaymentMethods.map(method => (
                    <div key={method.id} className="sd-payment-method">
                      <div className="sd-payment-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div className="sd-payment-details">
                        <div className="sd-payment-brand">{method.brand} ending in {method.last4}</div>
                        <div className="sd-payment-expiry">Expires {method.expiryMonth}/{method.expiryYear}</div>
                      </div>
                      {method.isDefault && (
                        <span className="sd-payment-default">Default</span>
                      )}
                    </div>
                  ))}
                </div>
                <button type="button" className="sd-btn sd-btn-outline">
                  Add Payment Method
                </button>
              </section>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === "billing" && showBillingHistory && (
            <div className="sd-content">
              <section className="sd-section">
                <h2 className="sd-section-title">Billing History</h2>
                <div className="sd-billing-table">
                  <div className="sd-table-header">
                    <div className="sd-table-cell">Date</div>
                    <div className="sd-table-cell">Description</div>
                    <div className="sd-table-cell">Amount</div>
                    <div className="sd-table-cell">Status</div>
                  </div>
                  {mockBillingHistory.map(bill => (
                    <div key={bill.id} className="sd-table-row">
                      <div className="sd-table-cell">{formatDate(bill.date, dateFormat)}</div>
                      <div className="sd-table-cell">{bill.description}</div>
                      <div className="sd-table-cell">{formatCurrency(bill.amount, bill.currency)}</div>
                      <div className="sd-table-cell">
                        <span 
                          className="sd-status-badge" 
                          style={{ backgroundColor: bill.status === "Paid" ? "#28a745" : "#dc3545" }}
                        >
                          {bill.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="sd-content">
              <section className="sd-section">
                <h2 className="sd-section-title">Account Settings</h2>
                
                <div className="sd-settings-section">
                  <h3 className="sd-settings-subtitle">Profile Information</h3>
                  <div className="sd-form-group">
                    <label className="sd-form-label">Email Address</label>
                    <input 
                      type="email" 
                      className="sd-form-input" 
                      value={userEmail} 
                      readOnly 
                    />
                  </div>
                  <div className="sd-form-group">
                    <label className="sd-form-label">Display Name</label>
                    <input 
                      type="text" 
                      className="sd-form-input" 
                      value={displayName} 
                      readOnly 
                    />
                  </div>
                </div>

                {showNotifications && (
                  <div className="sd-settings-section">
                    <h3 className="sd-settings-subtitle">Notification Preferences</h3>
                    <div className="sd-notification-settings">
                      <label className="sd-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.email}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, email: e.target.checked }))}
                        />
                        <span className="sd-checkbox-text">Email notifications</span>
                      </label>
                      <label className="sd-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.sms}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, sms: e.target.checked }))}
                        />
                        <span className="sd-checkbox-text">SMS notifications</span>
                      </label>
                      <label className="sd-checkbox-label">
                        <input 
                          type="checkbox" 
                          checked={notificationSettings.push}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, push: e.target.checked }))}
                        />
                        <span className="sd-checkbox-text">Push notifications</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="sd-settings-section">
                  <h3 className="sd-settings-subtitle">Support</h3>
                  <div className="sd-support-info">
                    <div className="sd-support-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>Email: {supportEmail && supportEmail.trim() ? <a href={`mailto:${supportEmail}`}>{supportEmail}</a> : supportEmail}</span>
                    </div>
                    <div className="sd-support-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      <span>Phone: {supportPhone && supportPhone.trim() ? <a href={`tel:${supportPhone}`}>{supportPhone}</a> : supportPhone}</span>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

// Skeleton loading state
SubscriberDashboard.Skeleton = () => (
  <div className="sd-wrapper sd-skeleton">
    <div className="sd-header">
      <div className="sd-container">
        <div className="sd-header-content">
          <div>
            <div className="sd-skeleton-line" style={{ width: "200px", height: "28px", marginBottom: "8px" }} />
            <div className="sd-skeleton-line" style={{ width: "300px", height: "16px" }} />
          </div>
          <div className="sd-skeleton-circle" style={{ width: "48px", height: "48px" }} />
        </div>
      </div>
    </div>
    <div className="sd-nav">
      <div className="sd-container">
        <div className="sd-nav-tabs">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="sd-skeleton-line" style={{ width: "80px", height: "16px" }} />
          ))}
        </div>
      </div>
    </div>
    <div className="sd-main">
      <div className="sd-container">
        <div className="sd-stats-grid">
          {[1, 2, 3].map(i => (
            <div key={i} className="sd-stat-card">
              <div className="sd-skeleton-line" style={{ width: "120px", height: "16px", marginBottom: "8px" }} />
              <div className="sd-skeleton-line" style={{ width: "80px", height: "24px" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// Error state
SubscriberDashboard.Error = () => (
  <div className="sd-wrapper sd-error">
    <div className="sd-error-content">
      <h2>Something went wrong</h2>
      <p>We couldn't load your dashboard. Please try refreshing the page or contact support if the problem continues.</p>
      <button type="button" className="sd-btn sd-btn-primary" onClick={() => window.location.reload()}>
        Refresh Page
      </button>
    </div>
  </div>
)

export default SubscriberDashboard