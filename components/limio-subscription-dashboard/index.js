import React, { useState, useMemo } from "react"
import { useComponentProps, getPropsFromPackageJson, useUser, useSubscriptions, useCampaign, useOfferInfo, formatDate, formatCurrency, sanitiseHTML, getCurrentOffer } from "@limio/sdk"
import packageData from "./package.json"
import "./index.css"

const defaultProps = getPropsFromPackageJson(packageData)

const SubscriptionDashboard = () => {
  const props = useComponentProps(defaultProps)
  const {
    dashboardTitle,
    welcomeMessage,
    primaryColor__limio_color,
    showCustomerInfo,
    showBillingInfo,
    showPaymentHistory,
    showUsageMetrics,
    enableFiltering,
    supportEmail,
    supportPhone,
    manageSubscriptionText,
    upgradeText,
    cancelText,
    downloadInvoiceText
  } = props
  
  const { attributes: userAttributes, subscriptions: userSubscriptions, loaded: userLoaded } = useUser()
  const { subscriptions } = useSubscriptions()
  const { offers } = useCampaign()
  
  const [activeTab, setActiveTab] = useState("subscriptions")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  // Get contrast color for primary
  const getContrastColor = (hex) => {
    if (!hex) return "#000000"
    const h = hex.replace("#", "")
    const r = parseInt(h.substr(0, 2), 16)
    const g = parseInt(h.substr(2, 2), 16) 
    const b = parseInt(h.substr(4, 2), 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF"
  }

  // Helper function to get subscription info directly from subscription data
  const getSubInfo = (subscription) => {
    if (!subscription) return { status: "unknown", isGift: false, quantity: 1, hasLapsed: false, hasPendingChange: false }
    
    const status = subscription.status || "unknown"
    const isGift = subscription.gift_recipient_email ? true : false
    const quantity = subscription.quantity || 1
    const hasLapsed = status === "expired" || status === "lapsed" || status === "cancelled"
    
    // Check for pending changes by looking at future-dated offers
    const now = new Date()
    const hasPendingChange = subscription.offers?.some(offerItem => {
      const startDate = offerItem.data?.start ? new Date(offerItem.data.start) : null
      return startDate && startDate > now
    }) || false

    return {
      status,
      isGift,
      quantity,
      hasLapsed,
      hasPendingChange
    }
  }

  // Helper function to get schedule info from subscription
  const getScheduleInfo = (subscription) => {
    if (!subscription?.schedule || !Array.isArray(subscription.schedule)) {
      return {
        nextPaymentAmount: "N/A",
        nextPaymentDate: "N/A",
        renewalPrice: "N/A"
      }
    }

    // Find the next scheduled payment
    const now = new Date()
    const futurePayments = subscription.schedule
      .filter(item => {
        const itemDate = new Date(item.data?.date)
        return itemDate > now && item.data?.type !== "discount"
      })
      .sort((a, b) => new Date(a.data.date) - new Date(b.data.date))

    const nextPayment = futurePayments[0]
    
    if (!nextPayment) {
      return {
        nextPaymentAmount: "N/A",
        nextPaymentDate: "N/A", 
        renewalPrice: "N/A"
      }
    }

    const amount = nextPayment.data?.amount
    const currency = nextPayment.data?.currency
    const date = nextPayment.data?.date

    return {
      nextPaymentAmount: amount && currency ? formatCurrency(amount, currency) : "N/A",
      nextPaymentDate: date ? formatDate(date, "DATE_SHORT") : "N/A",
      renewalPrice: amount && currency ? formatCurrency(amount, currency) : "N/A"
    }
  }

  // Filter subscriptions based on search and status
  const filteredSubscriptions = useMemo(() => {
    if (!subscriptions) return []
    
    return subscriptions.filter(subscription => {
      const matchesSearch = !searchTerm || 
        subscription.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.reference?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = filterStatus === "all" || subscription.status === filterStatus
      
      return matchesSearch && matchesStatus
    })
  }, [subscriptions, searchTerm, filterStatus])

  // Get unique subscription statuses for filter options
  const statusOptions = useMemo(() => {
    if (!subscriptions) return []
    const statuses = [...new Set(subscriptions.map(sub => sub.status))]
    return statuses.filter(Boolean)
  }, [subscriptions])

  const SubscriptionCard = ({ subscription }) => {
    const currentOffer = getCurrentOffer(subscription)
    const scheduleInfo = getScheduleInfo(subscription)
    const { status, isGift, quantity, hasLapsed, hasPendingChange } = getSubInfo(subscription)
    const offerInfo = useOfferInfo(currentOffer)
    
    return (
      <div className="sd-card">
        <div className="sd-card-header">
          <div className="sd-card-title-row">
            <h3 className="sd-card-title">{subscription.name}</h3>
            <span className={`sd-status-badge sd-status-${status?.toLowerCase()}`}>
              {status}
            </span>
          </div>
          <p className="sd-card-subtitle">Reference: {subscription.reference}</p>
        </div>
        
        <div className="sd-card-content">
          {currentOffer && (
            <div className="sd-offer-details">
              <h4 className="sd-offer-title">{currentOffer.data.attributes.display_name__limio}</h4>
              <div className="sd-offer-price" dangerouslySetInnerHTML={{ 
                __html: sanitiseHTML(currentOffer.data.attributes.display_price__limio || "") 
              }} />
            </div>
          )}
          
          <div className="sd-details-grid">
            <div className="sd-detail-item">
              <span className="sd-detail-label">Next Payment</span>
              <span className="sd-detail-value">{scheduleInfo.nextPaymentAmount}</span>
            </div>
            <div className="sd-detail-item">
              <span className="sd-detail-label">Next Payment Date</span>
              <span className="sd-detail-value">{scheduleInfo.nextPaymentDate}</span>
            </div>
            {quantity > 1 && (
              <div className="sd-detail-item">
                <span className="sd-detail-label">Quantity</span>
                <span className="sd-detail-value">{quantity}</span>
              </div>
            )}
            {isGift && (
              <div className="sd-detail-item">
                <span className="sd-detail-label">Gift Subscription</span>
                <span className="sd-detail-value">Yes</span>
              </div>
            )}
          </div>
          
          {hasPendingChange && (
            <div className="sd-pending-change">
              <svg className="sd-warning-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM7 4a1 1 0 112 0v3a1 1 0 11-2 0V4zm1 8a1 1 0 100-2 1 1 0 000 2z"/>
              </svg>
              Pending changes will take effect on next billing cycle
            </div>
          )}

          {hasLapsed && (
            <div className="sd-lapsed-notice">
              <svg className="sd-warning-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
              This subscription has lapsed
            </div>
          )}
        </div>
        
        <div className="sd-card-actions">
          <button className="sd-btn sd-btn-secondary">{manageSubscriptionText}</button>
          <button className="sd-btn sd-btn-primary">{upgradeText}</button>
        </div>
      </div>
    )
  }

  const CustomerInfoCard = () => (
    <div className="sd-card">
      <div className="sd-card-header">
        <h3 className="sd-card-title">Account Information</h3>
      </div>
      <div className="sd-card-content">
        <div className="sd-details-grid">
          <div className="sd-detail-item">
            <span className="sd-detail-label">Name</span>
            <span className="sd-detail-value">{userAttributes?.first_name} {userAttributes?.last_name}</span>
          </div>
          <div className="sd-detail-item">
            <span className="sd-detail-label">Email</span>
            <span className="sd-detail-value">{userAttributes?.email}</span>
          </div>
          <div className="sd-detail-item">
            <span className="sd-detail-label">Customer Since</span>
            <span className="sd-detail-value">
              {userAttributes?.created_date ? formatDate(userAttributes.created_date, "DATE_SHORT") : "N/A"}
            </span>
          </div>
          <div className="sd-detail-item">
            <span className="sd-detail-label">Total Subscriptions</span>
            <span className="sd-detail-value">{subscriptions?.length || 0}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const BillingInfoCard = () => (
    <div className="sd-card">
      <div className="sd-card-header">
        <h3 className="sd-card-title">Billing Information</h3>
      </div>
      <div className="sd-card-content">
        <div className="sd-details-grid">
          <div className="sd-detail-item">
            <span className="sd-detail-label">Payment Method</span>
            <span className="sd-detail-value">•••• •••• •••• 1234</span>
          </div>
          <div className="sd-detail-item">
            <span className="sd-detail-label">Billing Address</span>
            <span className="sd-detail-value">{userAttributes?.address || "Not provided"}</span>
          </div>
        </div>
        <button className="sd-btn sd-btn-secondary sd-mt-16">Update Payment Method</button>
      </div>
    </div>
  )

  const PaymentHistoryCard = () => {
    // Get payment history from subscription schedules
    const paymentHistory = useMemo(() => {
      if (!subscriptions) return []
      
      const payments = []
      subscriptions.forEach(subscription => {
        if (subscription.schedule && Array.isArray(subscription.schedule)) {
          subscription.schedule.forEach(scheduleItem => {
            if (scheduleItem.data && scheduleItem.data.date && scheduleItem.data.amount) {
              const paymentDate = new Date(scheduleItem.data.date)
              const now = new Date()
              
              // Only include past payments
              if (paymentDate < now) {
                payments.push({
                  id: `${subscription.id}-${scheduleItem.id}`,
                  date: scheduleItem.data.date,
                  amount: formatCurrency(scheduleItem.data.amount, scheduleItem.data.currency),
                  status: scheduleItem.status || "Paid",
                  subscription: subscription.name,
                  invoice: `INV-${scheduleItem.id?.slice(-3) || "001"}`
                })
              }
            }
          })
        }
      })
      
      // Sort by date, most recent first
      return payments.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
    }, [subscriptions])

    return (
      <div className="sd-card">
        <div className="sd-card-header">
          <h3 className="sd-card-title">Payment History</h3>
        </div>
        <div className="sd-card-content">
          <div className="sd-table-container">
            <table className="sd-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Invoice</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.length > 0 ? (
                  paymentHistory.map(payment => (
                    <tr key={payment.id}>
                      <td>{formatDate(payment.date, "DATE_SHORT")}</td>
                      <td>{payment.amount}</td>
                      <td>
                        <span className={`sd-status-badge sd-status-${payment.status?.toLowerCase()}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        <button className="sd-link">{downloadInvoiceText}</button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="sd-no-data">No payment history available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  const UsageMetricsCard = () => {
    const metrics = useMemo(() => {
      const activeSubscriptions = subscriptions?.filter(sub => sub.status === "active").length || 0
      const totalSubscriptions = subscriptions?.length || 0
      const giftSubscriptions = subscriptions?.filter(sub => {
        const subInfo = getSubInfo(sub)
        return subInfo.isGift
      }).length || 0

      return {
        activeSubscriptions,
        totalSubscriptions,
        giftSubscriptions
      }
    }, [subscriptions])

    return (
      <div className="sd-card">
        <div className="sd-card-header">
          <h3 className="sd-card-title">Subscription Overview</h3>
        </div>
        <div className="sd-card-content">
          <div className="sd-metrics-grid">
            <div className="sd-metric-item">
              <div className="sd-metric-value">{metrics.activeSubscriptions}</div>
              <div className="sd-metric-label">Active Subscriptions</div>
            </div>
            <div className="sd-metric-item">
              <div className="sd-metric-value">{metrics.totalSubscriptions}</div>
              <div className="sd-metric-label">Total Subscriptions</div>
            </div>
            <div className="sd-metric-item">
              <div className="sd-metric-value">{metrics.giftSubscriptions}</div>
              <div className="sd-metric-label">Gift Subscriptions</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const SupportCard = () => (
    <div className="sd-card sd-support-card">
      <div className="sd-card-header">
        <h3 className="sd-card-title">Need Help?</h3>
      </div>
      <div className="sd-card-content">
        <p className="sd-support-text">Our support team is here to help you with any questions.</p>
        <div className="sd-support-contacts">
          <div className="sd-support-item">
            <svg className="sd-support-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.678 11.894a1 1 0 01.287.801 10.97 10.97 0 001.414 8.348 1 1 0 01-1.51 1.31A12.97 12.97 0 013 12c0-.314.014-.626.04-.935a1 1 0 01.638-.861z"/>
            </svg>
            <a href={`mailto:${supportEmail}`} className="sd-support-link">{supportEmail}</a>
          </div>
          <div className="sd-support-item">
            <svg className="sd-support-icon" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 004.168 6.608 17.569 17.569 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.678.678 0 00-.58-.122L9.98 11.197a.678.678 0 01-.358-.063 8.757 8.757 0 01-2.27-2.27.678.678 0 01-.063-.358l.766-1.805a.678.678 0 00-.122-.58L5.939 3.814a.678.678 0 00-.122-.58z"/>
            </svg>
            <a href={`tel:${supportPhone}`} className="sd-support-link">{supportPhone}</a>
          </div>
        </div>
      </div>
    </div>
  )

  if (!userLoaded) {
    return (
      <div className="sd-wrapper" style={{ "--sd-primary": primaryColor__limio_color, "--sd-contrast": getContrastColor(primaryColor__limio_color) }}>
        <div className="sd-loading">
          <div className="sd-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="sd-wrapper" style={{ "--sd-primary": primaryColor__limio_color, "--sd-contrast": getContrastColor(primaryColor__limio_color) }}>
      <div className="sd-container">
        {/* Header */}
        <div className="sd-header">
          <div className="sd-header-content">
            <h1 className="sd-title">{dashboardTitle}</h1>
            <p className="sd-subtitle">{welcomeMessage}</p>
          </div>
          <div className="sd-header-user">
            <div className="sd-avatar">
              {userAttributes?.first_name?.[0] || "U"}
            </div>
            <div className="sd-user-info">
              <div className="sd-user-name">{userAttributes?.first_name} {userAttributes?.last_name}</div>
              <div className="sd-user-email">{userAttributes?.email}</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sd-nav-tabs">
          <button 
            className={`sd-tab ${activeTab === "subscriptions" ? "sd-tab-active" : ""}`}
            onClick={() => setActiveTab("subscriptions")}
          >
            Subscriptions
          </button>
          <button 
            className={`sd-tab ${activeTab === "account" ? "sd-tab-active" : ""}`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
          <button 
            className={`sd-tab ${activeTab === "billing" ? "sd-tab-active" : ""}`}
            onClick={() => setActiveTab("billing")}
          >
            Billing
          </button>
          <button 
            className={`sd-tab ${activeTab === "usage" ? "sd-tab-active" : ""}`}
            onClick={() => setActiveTab("usage")}
          >
            Overview
          </button>
        </div>

        {/* Subscriptions Tab */}
        {activeTab === "subscriptions" && (
          <>
            {/* Filters */}
            {enableFiltering && (
              <div className="sd-filters">
                <div className="sd-search-container">
                  <svg className="sd-search-icon" viewBox="0 0 16 16" fill="currentColor">
                    <path fillRule="evenodd" d="M9.965 11.026a5 5 0 111.06-1.06l2.755 2.754a.75.75 0 11-1.06 1.06L9.965 11.026zM10.5 7a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"/>
                  </svg>
                  <input 
                    type="text" 
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="sd-search-input"
                  />
                </div>
                <select 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="sd-filter-select"
                >
                  <option value="all">All Statuses</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Subscriptions Grid */}
            <div className="sd-content">
              <div className="sd-subscriptions-grid">
                {filteredSubscriptions.length > 0 ? (
                  filteredSubscriptions.map(subscription => (
                    <SubscriptionCard key={subscription.id} subscription={subscription} />
                  ))
                ) : (
                  <div className="sd-empty-state">
                    <svg className="sd-empty-icon" viewBox="0 0 48 48" fill="currentColor">
                      <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-4 30L10 24l2.83-2.83L20 28.34l15.17-15.17L38 16 20 34z"/>
                    </svg>
                    <h3>No subscriptions found</h3>
                    <p>Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Account Tab */}
        {activeTab === "account" && (
          <div className="sd-content">
            <div className="sd-cards-grid">
              {showCustomerInfo && <CustomerInfoCard />}
              <SupportCard />
            </div>
          </div>
        )}

        {/* Billing Tab */}
        {activeTab === "billing" && (
          <div className="sd-content">
            <div className="sd-cards-grid">
              {showBillingInfo && <BillingInfoCard />}
              {showPaymentHistory && <PaymentHistoryCard />}
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === "usage" && (
          <div className="sd-content">
            <div className="sd-cards-grid">
              {showUsageMetrics && <UsageMetricsCard />}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionDashboard