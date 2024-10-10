// // @flow
import * as React from "react";
import * as R from "ramda";
import { useCampaign, useSubscriptions } from "@limio/sdk";
import {
  checkActiveSubscriptionOffer,
  emptyOrNil,
  formatCurrency,

} from "./helpers";
import { sendOrder } from "@limio/shop/src/shop/helpers/postRequests.js";
import { Alert, LoadingSpinner } from "@limio/design-system";
import { v4 as uuid } from "uuid";
import { DateTime } from "@limio/date";
import { usePreview } from "@limio/ui-preview-context";
import PlanAndPricing from "./PlanAndPricing";
import {useLimioUserSubscriptionPaymentMethods} from "@limio/internal-checkout-sdk"

type Props = {
  successLink: string,
  selectedOffer: string,
  quantity: string,
    yourPlanTitle: string,
    toPayText: string,
    longTexts:string,
  yourNewPlanCopy: string,
  yourOldPlanCopy: string
};

const buildOrder = (
  subscription,
  selectedOfferObj,
  date,
  matchingAddOns = [],
  currentOffer,
  matchedAddOnsToReadd = [],
  selectedQuantity = 1
) => {
  let removeAddOns = [];
  let addAddOns = [];

  // these will stay removed after the change
  // build removal for all add ons
  if (!R.isEmpty(matchingAddOns)) {
    removeAddOns = matchingAddOns.map((addOn) => {
      return {
        type: "remove",
        quantity: 1,
        id: addOn.id,
        effective_date: DateTime.local().toISODate(),
        record_type: "add_on",
      };
    });
  }

  if (!R.isEmpty(matchedAddOnsToReadd)) {
    addAddOns = matchedAddOnsToReadd.map((addOn) => {
      return {
        type: "add",
        quantity: 1,
        id: addOn.id,
        version: addOn.version,
        effective_date: DateTime.local().toISODate(),
        record_type: "add_on",
      };
    });
  }

  return {
    order_type: "update_subscription",
    forSubscription: {
      name: subscription.name,
    },
    updates: [
      {
        type: "add",
        quantity: selectedQuantity,
        id: selectedOfferObj.id,
        version: selectedOfferObj.version,
        effective_date: DateTime.local().toISODate(),
        record_type: "offer",
      },
      {
        type: "remove",
        quantity: subscription.data.quantity,
        // this line needs to be the offers object in the array so like subscription_offer-id
        id: currentOffer.id,
        effective_date: DateTime.local().toISODate(),
        record_type: "offer",
      },
      ...removeAddOns,
      ...addAddOns,
    ],
    owner: subscription.owner,
    external_id: uuid(),
    source: "online",
    process_immediately: true,
  };
};

const isExpired = (addOn) => {
  return (
    addOn.data.end !== undefined &&
    DateTime.fromISO(addOn.data.end).toFormat("yyyy-MM-dd") <=
      DateTime.local().toISODate()
  );
};

function EditBasePlanBasket({ selectedOffer, quantity, yourPlanTitle, toPayText, longTexts,successLink, continueButtonText,yourOldPlanCopy, yourNewPlanCopy }: Props): React.Node {
  const { subscriptions = [] } = useSubscriptions();
  // get the subId query string param and find the sub.id that matches otherwise return the first in the list
  const subId = new URLSearchParams(window.location.search).get("subId")
  const subscription = subscriptions.find(sub => sub.id === subId) || subscriptions[0]
  const {payment_methods, revalidate: revalidatePayments} = useLimioUserSubscriptionPaymentMethods(subscription.id)

  const { offers = [], addOns: addOnsFromCampaign } = useCampaign();
  let addOns;
  if (Array.isArray(addOnsFromCampaign)) {
    addOns = addOnsFromCampaign;
  } else {
    addOns =
      addOnsFromCampaign === null || addOnsFromCampaign === undefined
        ? []
        : (addOns = R.pathOr([], ["tree"], addOnsFromCampaign));
  }
  const [offerCode, setOfferCode] = React.useState("");
  const [price, setPrice] = React.useState({});
  const [dateOfEffect, setDateOfEffect] = React.useState(new Date());
  const [submitting, setSubmitting] = React.useState(false);
  const processToday = React.useRef(true);
  const currentOffer = checkActiveSubscriptionOffer(subscription.offers)

  const { zuoraPreview, previewSchedule, preview } = usePreview();

  const selectedOfferObj = React.useMemo(
    () => offers.find((offer) => offer.id === selectedOffer),
    [offers, selectedOffer]
  );

  // logic to determine which add ons to be removed from a subscription update when the base plan is changed
  const getEntitlementsFromAddOn = (addOn) =>
    addOn.data.add_on?.data.products[0].entitlements?.map((e) => e.$ref) ?? [];

  // owned and active add ons
  const ownedAddOns = subscription.addOns.filter(
    (addOn) => addOn.status === "active" && !isExpired(addOn)
  );

  // all entitlements from owned add ons
  const subscribedToAddOns = React.useMemo(
    () => ownedAddOns.map(getEntitlementsFromAddOn).flat(),
    [ownedAddOns]
  );

  // all entitlements from selected offer
  const selectedOfferEntitlements = React.useMemo(
    () =>
      selectedOfferObj?.data.products[0].entitlements?.map(
        (entitlement) => entitlement.$ref
      ) ?? [],
    [selectedOfferObj]
  );

  // entitlements that are in both the selected offer and the owned add ons are the ones that will be removed
  const entitlementsToRemove = React.useMemo(
    () =>
      selectedOfferEntitlements.filter((entitlement) =>
        subscribedToAddOns.includes(entitlement)
      ),
    [selectedOfferEntitlements, subscribedToAddOns]
  );

  // match the add ons with the entitlements to be removed
  const matchAddOnsWithEntitlements = (addOns, entitlements) => {
    if (entitlements.length === 0) {
      return addOns;
    }
    const addOnsToRemove = [];
    addOns.forEach((addOn) => {
      const addOnEntitlements = getEntitlementsFromAddOn(addOn);
      if (
        addOnEntitlements.some((entitlement) =>
          entitlements.includes(entitlement)
        )
      ) {
        addOnsToRemove.push(addOn);
      }
    });
    return addOnsToRemove;
  };

  const matchAddOnsWithNotEntitlements = (addOns, entitlements) => {
    const addOnsToReplace = [];
    addOns.forEach((addOn) => {
      const addOnEntitlements = getEntitlementsFromAddOn(addOn);
      if (
        addOnEntitlements.some(
          (entitlement) => !entitlements.includes(entitlement)
        )
      ) {
        addOnsToReplace.push(addOn);
      }
    });
    return addOnsToReplace;
  };
  const applyOffer = () => {
    // check offer code
    // if valid, apply offer
    // else display error message
  };

  const handleSubmit = async () => {
    // logic to handle readding add ons so that the billing dates all match up.
    // and the add ons are not removed and readded on the same day (for example the add ons that are included in the new offer)
    const matchedRemovals = matchAddOnsWithEntitlements(
      ownedAddOns,
      entitlementsToRemove
    );
    const selectedOfferBillingPlan =
      selectedOfferObj.data.attributes.billing_plan[0];
    const matchedReAdds = matchAddOnsWithNotEntitlements(
      ownedAddOns,
      entitlementsToRemove
    );
    const matchedReAddProduct = matchedReAdds.map(
      (addOn) => addOn.data.add_on.data.products[0].path
    );
    const matchedAddOnsToReadd = addOns.filter(
      (addOn) =>
        matchedReAddProduct.includes(addOn.data.products[0].path) &&
        selectedOfferBillingPlan === addOn.data.attributes.billing_option[0]
    );

    const order = buildOrder(
      subscription,
      selectedOfferObj,
      dateOfEffect,
      [...matchedReAdds, ...matchedRemovals],
      currentOffer,
      matchedAddOnsToReadd,
      quantity
    );
    setSubmitting(true);
    await sendOrder(order);
    window.location.href = successLink;
  };

  const getPreview = () => {
    const matchingAddOns = matchAddOnsWithEntitlements(
      subscription.addOns,
      entitlementsToRemove
    );
    const order = buildOrder(
      subscription,
      selectedOfferObj,
      dateOfEffect,
      matchingAddOns,
      currentOffer,
      [],
      quantity
    );
    const previewBillingDetails = {
      state: "NY",
      postalCode: "10001",
      country: "US",
    };
    const previewOrderData = {
      ...order,
      billingDetails: previewBillingDetails,
    };
    preview(previewOrderData, true);
  };

  const calculateTotal = (add, remove) => {
    const addPrice = add.amountWithoutTax;
    const removePrice = remove.amountWithoutTax;
    const total = Number(addPrice) + Number(removePrice);
    return formatCurrency(total, "USD");
  };

  const showPaymentDetails = () => {
    const activePaymentMethods = payment_methods.filter(paymentMethod => paymentMethod.status === "active")
    if (activePaymentMethods.length === 0) {
      return
    }
    const [activePaymentMethod] = activePaymentMethods.sort((a, b) => new Date(b.start) - new Date(a.start))

    const paymentMethodType = activePaymentMethod.type
    const paymentMethodData = R.path(["data", paymentMethodType, "result"], activePaymentMethod)
    const {CreditCardMaskNumber: creditCardMask, CreditCardType = ""} = paymentMethodData
    return `Charge to your ${CreditCardType} (${creditCardMask})`

  }

  React.useEffect(() => {
    setPrice({});
    getPreview();
  }, [selectedOfferObj, quantity]);

  React.useEffect(() => {
    if (!R.isNil(zuoraPreview) && !R.isEmpty(previewSchedule)) {
      const lineItems = previewSchedule[0].lineItems;
      const removeSchedule = lineItems.find(
        (item) => item.amountWithoutTax < 0
      );
      const addSchedule = lineItems.find((item) => item.amountWithoutTax > 0);
      setPrice({ remove: removeSchedule, add: addSchedule });
    }
  }, [zuoraPreview, previewSchedule]);

  return (
    <div className={"right-side"}>
      <h3 className={"mb-2 pb-2"}>{yourPlanTitle}</h3>
      <PlanAndPricing
        selectedOfferObj={selectedOfferObj}
        price={price}
        processToday={processToday}
        yourNewPlanCopy={yourNewPlanCopy}
        yourOldPlanCopy={yourOldPlanCopy}
        currentOffer={currentOffer}
      />
      <div className="flex space-between mr-4 mt-2">
        <label className="bold">Offer Code </label>
        <div>
          <input
            type="text"
            onChange={(e) => setOfferCode(e.target.value)}
            className={"offer-input"}
          />
          <button disabled onClick={() => applyOffer} className={"offer-btn"}>
            APPLY
          </button>
        </div>
      </div>
      <div className="row-border" />
      <div className={"flex space-between mr-4 mt-4"}>
        <div className={"less-bold"} dangerouslySetInnerHTML={{__html: toPayText}}/>
        <p>
          {processToday.current ? (
            !emptyOrNil(price.add) && !emptyOrNil(price.remove) ? (
              calculateTotal(price.add, price.remove)
            ) : (
              <LoadingSpinner />
            )
          ) : (
            "--"
          )}
        </p>
      </div>
      <div className={"flex place-end mr-4 checkout-btn"}>
        <button
            onClick={handleSubmit}
            className={"add-remove-btns add-btn cont-btn "}
            disabled={submitting}
        >
          {continueButtonText}
        </button>
        <p>{payment_methods && payment_methods.length ? showPaymentDetails() : null}</p>

      </div>

      <section className={"description"} dangerouslySetInnerHTML={{__html: longTexts}}>
      </section>
    </div>
  );
}

export default EditBasePlanBasket;
