import React from "react"
import { 
  useComponentProps, 
  getPropsFromPackageJson, 
  useUser, 
  useSubscriptions, 
  useSchedule,
  useSubInfo,
  useUserAccountInformation,
  formatCurrency,
  formatDate,
  sanitiseHTML,
  getCurrentOffer
} from "@limio/sdk"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const getContrastColor = (hex) => {
  if (!hex) return "#000000"
  const h = hex.replace("#", "")
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
}

const SubscriptionCard = ({ subscription, editButtonText, noDataText }) => {
  const schedule = useSchedule(subscription)
  const subInfo = useSubInfo(subscription)
  const currentOffer = getCurrentOffer(subscription)
  
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'var(--sd-success)'
      case 'cancelled': return 'var(--sd-error)'
      case 'pending': return 'var(--sd-warning)'
      default: return 'var(--sd-text-muted)'
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      case 'cancelled':
        return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      case 'pending':
        return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M8 4v4l2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      default:
        return null
    }
  }

  return (
    <div className="sd-subscription-card">
      <div className="sd-card-header">
        <div className="sd-subscription-info">
          <h3 className="sd-subscription-name">
            {subscription?.name || currentOffer?.data?.attributes?.display_name__limio || noDataText}
          </h3>
          <div className="sd-subscription-reference">
            {subscription?.reference && <span>#{subscription.reference}</span>}
          </div>
        </div>
        <div 
          className="sd-status-badge" 
          style={{ color: getStatusColor(subscription?.status) }}
        >
          {getStatusIcon(subscription?.status)}
          <span>{subscription?.status || noDataText}</span>
        </div>
      </div>
      
      <div className="sd-subscription-details">
        <div className="sd-detail-row">
          <span className="sd-detail-label">Price:</span>
          <span className="sd-detail-value">
            {schedule?.renewalPrice || 
             (subscription?.data?.price?.amount && subscription?.data?.price?.currency ? 
              formatCurrency(subscription.data.price.amount, subscription.data.price.currency) : 
              noDataText)}
          </span>
        </div>
        
        {subscription?.data?.startDate && (
          <div className="sd-detail-row">
            <span className="sd-detail-label">Start Date:</span>
            <span className="sd-detail-value">
              {formatDate(subscription.data.startDate, "DATE_MED")}
            </span>
          </div>
        )}
        
        {schedule?.termEndDate && (
          <div className="sd-detail-row">
            <span className="sd-detail-label">Next Renewal:</span>
            <span className="sd-detail-value">{schedule.termEndDate}</span>
          </div>
        )}
        
        {subInfo?.quantity && subInfo.quantity > 1 && (
          <div className="sd-detail-row">
            <span className="sd-detail-label">Quantity:</span>
            <span className="sd-detail-value">{subInfo.quantity}</span>
          </div>
        )}
      </div>
      
      <div className="sd-card-actions">
        <button className="sd-btn sd-btn-secondary" type="button">
          {editButtonText}
        </button>
      </div>
    </div>
  )
}

const PaymentCard = ({ subscription, noDataText }) => {
  const schedule = useSchedule(subscription)
  
  if (!schedule?.nextSchedule) return null
  
  return (
    <div className="sd-payment-card">
      <div className="sd-payment-header">
        <div className="sd-payment-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>
        <div className="sd-payment-info">
          <div className="sd-payment-subscription">
            {subscription?.name || noDataText}
          </div>
          <div className="sd-payment-date">
            {schedule?.nextSchedule?.data?.date ? 
             formatDate(schedule.nextSchedule.data.date, "DATE_MED") : 
             noDataText}
          </div>
        </div>
      </div>
      <div className="sd-payment-amount">
        {schedule?.nextPaymentAmount || 
         (schedule?.nextSchedule?.data?.amount && schedule?.nextSchedule?.data?.currency ?
          formatCurrency(schedule.nextSchedule.data.amount, schedule.nextSchedule.data.currency) :
          noDataText)}
      </div>
    </div>
  )
}

const AccountInfoCard = ({ user, accountInformation, editButtonText, noDataText }) => {
  const userAttributes = user?.attributes || {}
  const accountData = accountInformation?.data || {}
  
  return (
    <div className="sd-account-card">
      <div className="sd-card-header">
        <h3 className="sd-card-title">Personal Information</h3>
        <button className="sd-btn sd-btn-ghost" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {editButtonText}
        </button>
      </div>
      
      <div className="sd-account-details">
        <div className="sd-detail-row">
          <span className="sd-detail-label">Name:</span>
          <span className="sd-detail-value">
            {userAttributes.firstName || userAttributes.lastName ? 
             `${userAttributes.firstName || ''} ${userAttributes.lastName || ''}`.trim() :
             accountData.firstName && accountData.lastName ?
             `${accountData.firstName} ${accountData.lastName}` :
             noDataText}
          </span>
        </div>
        
        <div className="sd-detail-row">
          <span className="sd-detail-label">Email:</span>
          <span className="sd-detail-value">
            {userAttributes.email || accountData.email || noDataText}
          </span>
        </div>
        
        {userAttributes.email_verified !== undefined && (
          <div className="sd-detail-row">
            <span className="sd-detail-label">Email Status:</span>
            <span className="sd-detail-value">
              <span className={`sd-verification-status ${userAttributes.email_verified ? 'sd-verified' : 'sd-unverified'}`}>
                {userAttributes.email_verified ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <path d="M13.3 4.3l-7 7-3.6-3.6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Verified
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" fill="none"/>
                      <path d="M8 4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M8 12h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Pending
                  </>
                )}
              </span>
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const SubscriptionDashboard = () => {
  const props = useComponentProps(defaultProps)
  const { 
    welcomeHeadline,
    dashboardTitle, 
    subscriptionsHeadline,
    paymentsHeadline,
    accountHeadline,
    editButtonText,
    viewAllText,
    noDataText,
    primaryColor__limio_color,
    secondaryColor__limio_color 
  } = props

  const { username, attributes, subscriptions: userSubscriptions, loaded } = useUser()
  const { subscriptions } = useSubscriptions()
  const { accountInformation } = useUserAccountInformation()
  
  // Use subscriptions from useSubscriptions hook if available, fallback to user subscriptions
  const allSubscriptions = subscriptions || userSubscriptions || []
  
  // Get user's first name for greeting
  const userFirstName = attributes?.firstName || username || "User"
  
  if (!loaded) {
    return (
      <div className="sd-wrapper">
        <div className="sd-container">
          <div className="sd-loading">
            <div className="sd-spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="sd-wrapper"
      style={{ 
        "--sd-primary": primaryColor__limio_color || "#d14424",
        "--sd-secondary": secondaryColor__limio_color || "#f47c24",
        "--sd-contrast": getContrastColor(primaryColor__limio_color || "#d14424")
      }}
    >
      <div className="sd-container">
        {/* Header */}
        <div className="sd-header">
          <div className="sd-welcome">
            <h1 className="sd-welcome-title">
              {welcomeHeadline}, {userFirstName}
            </h1>
            <p className="sd-welcome-subtitle">{dashboardTitle}</p>
          </div>
          <div className="sd-user-avatar">
            <div className="sd-avatar-circle">
              {userFirstName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="sd-dashboard-grid">
          {/* Subscriptions Section */}
          <section className="sd-section sd-section-full">
            <div className="sd-section-header">
              <h2 className="sd-section-title">{subscriptionsHeadline}</h2>
              {allSubscriptions.length > 3 && (
                <button className="sd-btn sd-btn-ghost" type="button">
                  {viewAllText}
                </button>
              )}
            </div>
            <div className="sd-subscriptions-grid">
              {allSubscriptions.length > 0 ? (
                allSubscriptions.slice(0, 3).map((subscription, index) => (
                  <SubscriptionCard
                    key={subscription?.id || index}
                    subscription={subscription}
                    editButtonText={editButtonText}
                    noDataText={noDataText}
                  />
                ))
              ) : (
                <div className="sd-empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <p>No active subscriptions found</p>
                </div>
              )}
            </div>
          </section>

          {/* Upcoming Payments */}
          <section className="sd-section">
            <div className="sd-section-header">
              <h2 className="sd-section-title">{paymentsHeadline}</h2>
            </div>
            <div className="sd-payments-container">
              {allSubscriptions.filter(sub => {
                const schedule = useSchedule(sub)
                return schedule?.nextSchedule
              }).length > 0 ? (
                allSubscriptions.slice(0, 3).map((subscription, index) => (
                  <PaymentCard
                    key={`payment-${subscription?.id || index}`}
                    subscription={subscription}
                    noDataText={noDataText}
                  />
                )).filter(Boolean)
              ) : (
                <div className="sd-empty-state sd-empty-state-small">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                    <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <p>No upcoming payments</p>
                </div>
              )}
            </div>
          </section>

          {/* Account Information */}
          <section className="sd-section">
            <div className="sd-section-header">
              <h2 className="sd-section-title">{accountHeadline}</h2>
            </div>
            <AccountInfoCard
              user={{ attributes }}
              accountInformation={accountInformation}
              editButtonText={editButtonText}
              noDataText={noDataText}
            />
          </section>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionDashboard