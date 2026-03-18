// @flow
import React, { useState, useEffect } from "react";
import { 
  useComponentProps, 
  getPropsFromPackageJson, 
  useSubscriptions, 
  useLimioContext,
  getCurrentOffer,
  sanitiseHTML,
  formatCurrency,
  formatDate,
  useBasket
} from "@limio/sdk";
import { useCheckout, useLimioUserSubscription } from "@limio/internal-checkout-sdk";
import packageData from "./package.json";
import "./index.css";

const defaultProps = getPropsFromPackageJson(packageData);

const getContrastColor = (hex) => {
  if (!hex) return "#ffffff";
  const h = hex.replace("#", "");
  const r = parseInt(h.substr(0, 2), 16), g = parseInt(h.substr(2, 2), 16), b = parseInt(h.substr(4, 2), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.5 ? "#000000" : "#FFFFFF";
};

const formatSubscriptionStatus = (status) => {
  if (!status) return 'Unknown';
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

const getStatusClass = (status) => {
  if (!status) return 'ut-status-pending';
  const lower = status.toLowerCase();
  if (lower === 'active') return 'ut-status-active';
  if (lower === 'cancelled' || lower === 'canceled') return 'ut-status-cancelled';
  return 'ut-status-pending';
};

const UpgradeTest2 = () => {
  const props = useComponentProps(defaultProps);
  const { 
    heading, 
    subheading, 
    noSubscriptionsText, 
    noUpgradesText,
    loadingText,
    primaryColor__limio_color,
    upgradeSuccessText
  } = props;

  const { subscriptions, loading: subscriptionsLoading } = useSubscriptions();
  const { isInPageBuilder } = useLimioContext();
  const { basketLoading, selectOfferForSubscriptionUpdate, navigateToCheckout, initiateCheckout } = useBasket();
  
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [availableUpgrades, setAvailableUpgrades] = useState([]);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize checkout for the selected subscription
  useEffect(() => {
    if (selectedSubscription) {
      initiateCheckout({ 
        order: { 
          order_type: "update_subscription", 
          forSubscription: { id: selectedSubscription.id } 
        } 
      }).catch(console.error);
    }
  }, [selectedSubscription, initiateCheckout]);

  // Use checkout hook only when we have a selected subscription
  const { useCheckoutSelector } = useCheckout({ redirectOnFailure: false });
  
  // Get available upgrade options from checkout state
  useEffect(() => {
    if (!selectedSubscription) {
      setAvailableUpgrades([]);
      return;
    }

    try {
      const nextActions = useCheckoutSelector ? useCheckoutSelector((state) => state.nextActions) : {};
      const upgrades = nextActions?.upgrades || [];
      setAvailableUpgrades(upgrades);
    } catch (error) {
      console.error('Error getting upgrades:', error);
      setAvailableUpgrades([]);
    }
  }, [selectedSubscription, useCheckoutSelector]);

  const handleSelectSubscription = (subscription) => {
    setSelectedSubscription(subscription);
    setSuccessMessage('');
  };

  const handleUpgrade = async (upgradeOffer) => {
    if (!selectedSubscription || basketLoading || upgradeLoading) return;

    setUpgradeLoading(true);
    try {
      // Select the upgrade offer for subscription update
      await selectOfferForSubscriptionUpdate({
        orderItemActionType: "add",
        offer: upgradeOffer,
        type: upgradeOffer.record_type || "offer",
        quantity: 1
      });

      setSuccessMessage(upgradeSuccessText);

      // Navigate to checkout after a brief delay
      setTimeout(async () => {
        try {
          const journey = upgradeOffer.data?.attributes?.update_configuration__limio || "/update";
          await navigateToCheckout({ journey: { checkout: journey } });
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Fallback to default checkout navigation
          await navigateToCheckout();
        }
      }, 1000);

    } catch (error) {
      console.error('Error upgrading subscription:', error);
      setSuccessMessage('');
    } finally {
      setUpgradeLoading(false);
    }
  };

  const renderSubscriptionCard = (subscription) => {
    const currentOffer = getCurrentOffer(subscription);
    const isSelected = selectedSubscription?.id === subscription.id;
    
    return (
      <div
        key={subscription.id}
        className={`ut-subscription-card ${isSelected ? 'ut-subscription-selected' : ''}`}
        onClick={() => handleSelectSubscription(subscription)}
      >
        <div className="ut-subscription-header">
          <div className="ut-subscription-info">
            <h3>{subscription.name || currentOffer?.data?.attributes?.display_name__limio || 'Subscription'}</h3>
            <p>ID: {subscription.reference || subscription.id}</p>
          </div>
          <div className={`ut-subscription-status ${getStatusClass(subscription.status)}`}>
            {formatSubscriptionStatus(subscription.status)}
          </div>
        </div>

        <div className="ut-subscription-meta">
          <div className="ut-subscription-meta-item">
            <span className="ut-subscription-meta-label">Plan</span>
            <span className="ut-subscription-meta-value">
              {currentOffer?.data?.attributes?.display_name__limio || '—'}
            </span>
          </div>
          <div className="ut-subscription-meta-item">
            <span className="ut-subscription-meta-label">Current Price</span>
            <span className="ut-subscription-meta-value">
              {currentOffer?.data?.attributes?.display_price__limio ? (
                <span dangerouslySetInnerHTML={{ __html: sanitiseHTML(currentOffer.data.attributes.display_price__limio) }} />
              ) : '—'}
            </span>
          </div>
          <div className="ut-subscription-meta-item">
            <span className="ut-subscription-meta-label">Start Date</span>
            <span className="ut-subscription-meta-value">
              {subscription.start_date ? formatDate(new Date(subscription.start_date)) : '—'}
            </span>
          </div>
          <div className="ut-subscription-meta-item">
            <span className="ut-subscription-meta-label">Renewal Date</span>
            <span className="ut-subscription-meta-value">
              {subscription.end_date ? formatDate(new Date(subscription.end_date)) : '—'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderUpgradeCard = (offer) => {
    const attributes = offer?.data?.attributes || {};
    const price = attributes.price__limio?.[0];
    
    return (
      <div key={offer.id} className="ut-upgrade-card">
        <div className="ut-upgrade-header">
          <h4 className="ut-upgrade-name">
            {attributes.display_name__limio || 'Upgrade Plan'}
          </h4>
          {attributes.display_price__limio && (
            <div className="ut-upgrade-price">
              <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.display_price__limio) }} />
            </div>
          )}
          {attributes.detailed_display_price__limio && (
            <p className="ut-upgrade-price-detail">
              <span dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.detailed_display_price__limio) }} />
            </p>
          )}
        </div>

        {attributes.offer_features__limio && (
          <div className="ut-upgrade-features">
            <div dangerouslySetInnerHTML={{ __html: sanitiseHTML(attributes.offer_features__limio) }} />
          </div>
        )}

        <button
          type="button"
          className="ut-btn ut-btn-primary"
          onClick={() => handleUpgrade(offer)}
          disabled={basketLoading || upgradeLoading}
        >
          {upgradeLoading ? 'Processing...' : (attributes.upgrade_cta__limio || 'Upgrade Now')}
        </button>

        {successMessage && selectedSubscription && (
          <div className="ut-success-message">
            {successMessage}
          </div>
        )}
      </div>
    );
  };

  return (
    <div 
      className={`ut-wrapper ${isInPageBuilder ? 'ut-page-builder' : ''}`}
      style={{ 
        "--ut-primary": primaryColor__limio_color || "#424770",
        "--ut-primary-tint": primaryColor__limio_color ? `color-mix(in srgb, ${primaryColor__limio_color} 8%, white)` : undefined
      }}
    >
      <div className="ut-container">
        <div className="ut-header">
          <h1 className="ut-title">{heading}</h1>
          <p className="ut-subtitle">{subheading}</p>
        </div>

        {subscriptionsLoading ? (
          <div className="ut-loading">
            <div className="ut-loading-spinner"></div>
            {loadingText}
          </div>
        ) : !subscriptions || subscriptions.length === 0 ? (
          <div className="ut-empty">
            {noSubscriptionsText}
          </div>
        ) : (
          <>
            <div className="ut-subscriptions">
              {subscriptions.map(renderSubscriptionCard)}
            </div>

            {selectedSubscription && (
              <div className="ut-upgrades-section">
                <div className="ut-upgrades-header">
                  <h2 className="ut-upgrades-title">Available Upgrades</h2>
                  <p className="ut-upgrades-subtitle">
                    Select an upgrade for {selectedSubscription.name || getCurrentOffer(selectedSubscription)?.data?.attributes?.display_name__limio || 'your subscription'}
                  </p>
                </div>

                {availableUpgrades.length === 0 ? (
                  <div className="ut-empty">
                    {noUpgradesText}
                  </div>
                ) : (
                  <div className="ut-upgrades-grid">
                    {availableUpgrades.map(renderUpgradeCard)}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UpgradeTest2;