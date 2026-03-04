import React, { useMemo } from "react"
import { 
  useComponentProps, 
  getPropsFromPackageJson, 
  useSubscriptions, 
  useUser, 
  useLimioContext,
  useSchedule,
  formatDate,
  formatCurrency,
  getRenewalDateForUserSubscription,
  getPriceForUserSubscription,
  getSubscriptionCurrency
} from "@limio/sdk"
import { useLimioUserSubscriptionPaymentMethods, useLimioUserSubscriptionAddresses } from "@limio/internal-checkout-sdk"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const SubscriptionOverview = () => {
  const props = useComponentProps(defaultProps)
  const {
    pageHeadline,
    pageSubheadline,
    subscriptionsHeadline,
    paymentMethodsHeadline,
    addressesHeadline,
    primaryColor__limio_color: primaryColor,
    accentColor__limio_color: accentColor,
    manageSubscriptionText,
    addPaymentMethodText,
    addAddressText,
    noSubscriptionsText,
    noPaymentMethodsText,
    noAddressesText,
    statusActiveText,
    statusPausedText,
    statusCancelledText,
    nextPaymentText,
    renewalDateText,
    showQuickStats,
    enableCompactView
  } = props

  const { isInPageBuilder } = useLimioContext() || {}
  const { attributes } = useUser() || {}
  const userId = attributes?.sub
  const { subscriptions } = useSubscriptions({ ownerId: userId }) || {}

  // Get payment methods and addresses for the first subscription (if available)
  const firstSubscriptionId = subscriptions?.[0]?.id
  const { payment_methods: paymentMethods } = useLimioUserSubscriptionPaymentMethods(firstSubscriptionId) || {}
  const { addresses } = useLimioUserSubscriptionAddresses(firstSubscriptionId) || {}

  const getContrastColor = (hex) => {
    if (!hex) return "#ffffff"
    const h = hex.replace("#", "")
    const r = parseInt(h.substr(0, 2), 16)
    const g = parseInt(h.substr(2, 2), 16)
    const b = parseInt(h.substr(4, 2), 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#ffffff"
  }

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return statusActiveText
      case "paused": return statusPausedText
      case "cancelled": return statusCancelledText
      default: return status || "Unknown"
    }
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active": return "success"
      case "paused": return "warning"
      case "cancelled": return "error"
      default: return "neutral"
    }
  }

  // Calculate stats from real data
  const activeSubscriptions = subscriptions?.filter(s => s?.status?.toLowerCase() === "active") || []
  
  const totalMonthlySpend = useMemo(() => {
    if (!activeSubscriptions.length) return "$0.00"
    
    let total = 0
    let currency = "USD"
    
    activeSubscriptions.forEach(subscription => {
      const price = getPriceForUserSubscription(subscription)
      const subscriptionCurrency = getSubscriptionCurrency(subscription)
      
      if (price && subscriptionCurrency) {
        // Extract numeric value from formatted price
        const numericValue = parseFloat(price.replace(/[^0-9.]/g, ''))
        if (!isNaN(numericValue)) {
          total += numericValue
          currency = subscriptionCurrency
        }
      }
    })
    
    return formatCurrency(total, currency) || "$0.00"
  }, [activeSubscriptions])

  const QuickStatsCards = () => {
    if (!showQuickStats) return null

    const stats = [
      {
        label: "Active Subscriptions",
        value: activeSubscriptions.length,
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        )
      },
      {
        label: "Monthly Spend",
        value: totalMonthlySpend,
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      },
      {
        label: "Payment Methods",
        value: paymentMethods?.length || 0,
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      },
      {
        label: "Saved Addresses",
        value: addresses?.length || 0,
        icon: (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
        )
      }
    ]

    return (
      <div className="so-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="so-stat-card">
            <div className="so-stat-header">
              <div className="so-stat-icon">{stat.icon}</div>
            </div>
            <div className="so-stat-content">
              <div className="so-stat-value">{stat.value}</div>
              <div className="so-stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const SubscriptionCard = ({ subscription }) => {
    if (!subscription) return null

    const displayName = subscription.name || "Subscription"
    const status = subscription.status || "unknown"
    const renewalDate = getRenewalDateForUserSubscription(subscription)
    const price = getPriceForUserSubscription(subscription)
    const schedule = useSchedule(subscription)

    return (
      <div className="so-subscription-card">
        <div className="so-card-header">
          <div className="so-subscription-primary">
            <div className="so-subscription-name-row">
              <h3 className="so-subscription-name">{displayName}</h3>
              <div className={`so-status-badge so-status-badge--${getStatusVariant(status)}`}>
                <div className="so-status-dot"></div>
                {getStatusText(status)}
              </div>
            </div>
            <div className="so-subscription-meta">
              {subscription.reference && <span className="so-subscription-reference">#{subscription.reference}</span>}
            </div>
          </div>
          <div className="so-card-actions">
            <button className="so-btn so-btn--ghost so-btn--sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                <circle cx="19" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
                <circle cx="5" cy="12" r="1" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            <button className="so-btn so-btn--primary so-btn--sm">
              {manageSubscriptionText}
            </button>
          </div>
        </div>

        <div className="so-card-content">
          <div className="so-subscription-details">
            <div className="so-detail-item">
              <div className="so-detail-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="so-detail-content">
                <span className="so-detail-label">{renewalDateText}</span>
                <span className="so-detail-value">{renewalDate || "—"}</span>
              </div>
            </div>

            <div className="so-detail-item">
              <div className="so-detail-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="so-detail-content">
                <span className="so-detail-label">{nextPaymentText}</span>
                <span className="so-detail-value">{price || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const PaymentMethodCard = ({ paymentMethod }) => {
    if (!paymentMethod?.data) return null

    const { method, last4, brand, isDefault } = paymentMethod.data

    return (
      <div className={`so-payment-card ${isDefault ? "so-payment-card--default" : ""}`}>
        <div className="so-payment-content">
          <div className="so-payment-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="so-payment-details">
            <div className="so-payment-primary">
              <span className="so-payment-brand">{brand || method || "CARD"}</span>
              {isDefault && <span className="so-default-badge">Default</span>}
            </div>
            <div className="so-payment-secondary">
              •••• {last4 || "0000"}
            </div>
          </div>
        </div>
        <button className="so-btn so-btn--ghost so-btn--sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    )
  }

  const AddressCard = ({ address }) => {
    if (!address?.data) return null

    const { firstName, lastName, address1, address2, city, state, postalCode, country } = address.data
    const { relationship_type: type, status } = address
    const isDefault = status === "active"
    
    const fullName = [firstName, lastName].filter(Boolean).join(" ")
    const addressLine = [address1, address2].filter(Boolean).join(", ")
    const locationLine = [city, state, postalCode, country].filter(Boolean).join(", ")
    const summary = [addressLine, locationLine].filter(Boolean).join(", ")

    return (
      <div className={`so-address-card ${isDefault ? "so-address-card--default" : ""}`}>
        <div className="so-address-content">
          <div className="so-address-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="so-address-details">
            <div className="so-address-primary">
              <span className={`so-address-type so-address-type--${type}`}>
                {type === "billing" ? "Billing" : "Shipping"}
              </span>
              {isDefault && <span className="so-default-badge">Default</span>}
            </div>
            {fullName && (
              <div className="so-address-secondary">
                {fullName}
              </div>
            )}
            {summary && (
              <div className="so-address-summary">
                {summary}
              </div>
            )}
          </div>
        </div>
        <button className="so-btn so-btn--ghost so-btn--sm">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
    )
  }

  const EmptyState = ({ title, description, action }) => (
    <div className="so-empty-state">
      <div className="so-empty-content">
        <h3 className="so-empty-title">{title}</h3>
        <p className="so-empty-description">{description}</p>
        {action && action}
      </div>
    </div>
  )

  return (
    <div 
      className={`so-wrapper ${isInPageBuilder ? "so-wrapper--static" : ""} ${enableCompactView ? "so-wrapper--compact" : ""}`}
      style={{
        "--so-primary": primaryColor,
        "--so-accent": accentColor,
        "--so-primary-contrast": getContrastColor(primaryColor),
        "--so-accent-contrast": getContrastColor(accentColor)
      }}
    >
      {/* Header */}
      <header className="so-header">
        <div className="so-container">
          <div className="so-header-content">
            <div className="so-header-text">
              <h1 className="so-page-title">{pageHeadline}</h1>
              <p className="so-page-subtitle">{pageSubheadline}</p>
            </div>
            <div className="so-header-actions">
              <button className="so-btn so-btn--secondary so-btn--sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Support
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="so-container">
        <div className="so-main">
          {/* Quick Stats */}
          <QuickStatsCards />

          {/* Content Sections */}
          <div className="so-content-sections">
            
            {/* Subscriptions Section */}
            <section className="so-section">
              <div className="so-section-header">
                <div className="so-section-title-group">
                  <h2 className="so-section-title">{subscriptionsHeadline}</h2>
                  <span className="so-section-count">{subscriptions?.length || 0}</span>
                </div>
              </div>
              <div className="so-section-content">
                {subscriptions && subscriptions.length > 0 ? (
                  <div className="so-subscriptions-grid">
                    {subscriptions.map((subscription) => (
                      <SubscriptionCard key={subscription.id} subscription={subscription} />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    title={noSubscriptionsText}
                    description="Get started by exploring our available plans and find the perfect subscription for your needs."
                  />
                )}
              </div>
            </section>

            <div className="so-two-column">
              {/* Payment Methods Section */}
              <section className="so-section">
                <div className="so-section-header">
                  <div className="so-section-title-group">
                    <h2 className="so-section-title">{paymentMethodsHeadline}</h2>
                    <span className="so-section-count">{paymentMethods?.length || 0}</span>
                  </div>
                  <button className="so-btn so-btn--secondary so-btn--sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {addPaymentMethodText}
                  </button>
                </div>
                <div className="so-section-content">
                  {paymentMethods && paymentMethods.length > 0 ? (
                    <div className="so-payment-methods-grid">
                      {paymentMethods.map((paymentMethod) => (
                        <PaymentMethodCard key={paymentMethod.id} paymentMethod={paymentMethod} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      title={noPaymentMethodsText}
                      description="Add a payment method to manage your billing seamlessly."
                      action={
                        <button className="so-btn so-btn--primary so-btn--sm">
                          {addPaymentMethodText}
                        </button>
                      }
                    />
                  )}
                </div>
              </section>

              {/* Addresses Section */}
              <section className="so-section">
                <div className="so-section-header">
                  <div className="so-section-title-group">
                    <h2 className="so-section-title">{addressesHeadline}</h2>
                    <span className="so-section-count">{addresses?.length || 0}</span>
                  </div>
                  <button className="so-btn so-btn--secondary so-btn--sm">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {addAddressText}
                  </button>
                </div>
                <div className="so-section-content">
                  {addresses && addresses.length > 0 ? (
                    <div className="so-addresses-grid">
                      {addresses.map((address) => (
                        <AddressCard key={address.id} address={address} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      title={noAddressesText}
                      description="Add billing and shipping addresses for faster checkout."
                      action={
                        <button className="so-btn so-btn--primary so-btn--sm">
                          {addAddressText}
                        </button>
                      }
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionOverview