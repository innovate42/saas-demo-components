//@flow
import React, {Suspense, useEffect} from "react";
import {ErrorBoundary, useBasket, useLimioContext} from "@limio/sdk";
import {Button, LoadingSpinner} from "@limio/design-system";
import {getRedirectUrl} from "@limio/shop/src/shop/checkout/helpers";
import {useSelector} from "@limio/shop";
import LineItem from "./components/LineItem";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faShoppingCart} from "@fortawesome/pro-light-svg-icons";
import {PreviewProvider, usePreview} from "@limio/ui-preview-context";
import {useCheckout} from "@limio/internal-checkout-sdk";
import {formatCurrency} from "./components/helpers";
import "./index.css";
import * as R from "ramda";

type Props = {
    totalLabel: string,
    emptyBasketText: string,
    goBackToPreviousPage: boolean,
    taxInfo: string,
    productHeading: string,
    quantityHeading: string,
    itemTotalHeading: string,
    heading: string,
    subheading: string,
    goToCheckoutLabel: string,
    goBackLabel: string,
    removeLabel: string,
    goBackUrl: string,
};

type BasketItemsType = {
    orderItems: Array<{}>,
    totalLabel: string,
    taxInfo: string,
};

const OrderTotal = ({orderItems, taxInfo, totalLabel}: BasketItemsType) => {
    const {isInPageBuilder} = useLimioContext();
    const total = useSelector((state) => state.order.total);


    const currency =
        orderItems?.[0]?.offer?.data?.attributes?.price__limio?.[0]?.currencyCode; // Assuming multi currency won't be enabled for a while

    const {zuoraPreview, previewSchedule, loadingPreview} =
        usePreview()

    const totalAmount =
        +previewSchedule[0]?.amountWithoutTax + +previewSchedule[0]?.taxAmount;

    const totalVal =
        !isInPageBuilder
            ? {currency, amount: totalAmount}
            : total;

    const totalText =
        !zuoraPreview?.success
            ? "-"
            : formatCurrency(Number(totalVal.amount), currency || "GBP");

    const subTotal =
        !isInPageBuilder
            ? {currency, amount: +previewSchedule[0]?.amountWithoutTax}
            : total;

    const subTotalText =
        !zuoraPreview?.success
            ? "-"
            : formatCurrency(Number(subTotal.amount), currency || "GBP");

    const taxTotal =
        !isInPageBuilder
            ? {currency, amount: +previewSchedule[0]?.taxAmount}
            : total;

    const taxTotalText =
        !zuoraPreview?.success
            ? "-"
            : formatCurrency(Number(taxTotal.amount), currency || "GBP");


    return (
        <>
            <div className={"basket-total"}>
                {loadingPreview ? (
                    <LoadingSpinner/>
                ) : (
                    <>
                        <div className={"basket-total-label"}>{totalLabel}</div>
                        <div className={"basket-total-amount"}>
                            <p>Subtotal: {subTotalText}</p>
                            <p>Tax: {taxTotalText}</p>
                            <p>Total: {totalText}</p>
                        </div>
                    </>
                )}
            </div>
            {currency === "USD" && <div className={"basket-tax"}>{taxInfo}</div>}
        </>
    );
};

const BasketItemsContainer = ({
                                  emptyBasketText,
                                  productHeading,
                                  quantityHeading,
                                  itemTotalHeading,
                                  totalLabel,
                                  taxInfo,
                              }: Props) => {
    const {useCheckoutSelector} = useCheckout();
    const {previewSchedule, loadingPreview, preview} = usePreview();
    const orderItems = useCheckoutSelector((state) => state.order.orderItems);
    const order = useSelector((state) => state.order);
    const currency =
        orderItems?.[0]?.offer?.data?.attributes?.price__limio?.[0]?.currencyCode; // Assuming multi currency won't be enabled for a while

    useEffect(() => {
        // We'll never use the tax so this isn't important but Zuora requires it - we just need the price
        const previewBillingDetails =
            currency === "USD"
                ? {state: "NY", postalCode: "10001", country: "US"}
                : {...billingDetails, country};
        const previewOrderData = {
            ...order,
            billingDetails: previewBillingDetails,
            order_type: "new",
            mode: "production",
        };

        preview(previewOrderData, true);
    }, [orderItems]);

    const previewLineItems =
        previewSchedule[0] === undefined ? [] : previewSchedule[0].lineItems;

    const getProductPath = (item) => {
        return R.pathOr("", ["data", "productBundles", "0", "product_path"], item)
    }


    const getSortedLineItems = () => {
        if (!previewLineItems || previewLineItems.length < 1) {
            return [];
        }

        const offer = R.pathOr({}, ["0", "offer"], orderItems);
        const offerRatePlan = R.pathOr("", ["data","productBundles", "0", "rate_plan"], offer)

        return previewLineItems.reduce((acc, lineItem) => {
            if (lineItem.chargeName === offerRatePlan) {
                const newLineItem = {name: offer.data.attributes.display_name__limio, ...lineItem};
                return [newLineItem, ...acc];
            } else {
                const addOnInBasket = orderItems.find((item) => R.pathOr(false, ["addOns"], item));
                if (addOnInBasket) {
                    // match the add-on to the line item
                    const addOn = addOnInBasket.addOns.find((addOn) => addOn.addOn.data.productBundles.rate_plan === lineItem.chargeName);
                    if (addOn) {
                        const newLineItem = {name: addOn.addOn.data.attributes.display_name__limio, ...lineItem};
                        return [newLineItem, ...acc];
                    }
                }
                return [...acc, lineItem];
            }
        }, [])
    }

    return (
        <div className={"basket-items-container"}>
            {orderItems.length < 1 ? (
                <div className={"basket-items empty"}>
                    <FontAwesomeIcon icon={faShoppingCart} size={"l"}/>
                    <p>{emptyBasketText}</p>
                </div>
            ) : (
                <>
                    {loadingPreview ? (
                        <LoadingSpinner/>
                    ) : (
                        <table>
                            <thead>
                            <tr className="limio-table-header-row">
                                <th>{productHeading}</th>
                                <th>{quantityHeading}</th>
                                <th>{itemTotalHeading}</th>
                            </tr>
                            </thead>
                            <tbody className={"basket-items"}>
                            {getSortedLineItems()?.map((lineItem, i) => (
                                <LineItem lineItem={lineItem} key={i}/>
                            ))}
                            </tbody>
                        </table>
                    )}
                    <Suspense
                        fallback={
                            <div className={"basket-total"}>
                                <LoadingSpinner/>
                            </div>
                        }
                    >
                        <OrderTotal
                            orderItems={orderItems}
                            totalLabel={totalLabel}
                            taxInfo={taxInfo}
                        />
                    </Suspense>
                </>
            )}
        </div>
    );
};

const Basket = ({
                    heading,
                    subheading,
                    goBackLabel,
                    goBackUrl,
                    goBackToPreviousPage,
                    emptyBasketText,
                    goToCheckoutLabel = "Checkout",
                    checkoutLink,
                    ...props
                }: Props): React.Node => {
    const order = useSelector((state) => state.order);

    const {goToCheckout} = useBasket();

    const getReturnURL = () => {
        if (goBackUrl) {
            return goBackUrl;
        }

        let returnUrl = goBackToPreviousPage
            ? document.referrer
            : getRedirectUrl(order) || "";

        let checkoutId = new URL(document.location).searchParams.get("basket");

        if (!checkoutId) {
            checkoutId = window.sessionStorage.getItem("limio_order");
        }

        if (checkoutId) {
            const returnLocation = new URL(returnUrl);

            returnLocation.searchParams.set("basket", checkoutId);
            returnUrl = returnLocation.href;
        }

        return returnUrl;
    };

    const goToCheckoutHandler = () => {
        if (!checkoutLink) {
            return goToCheckout();
        }
        goToCheckout(null, {journey: {checkout: {checkout_type: "external", external_url: checkoutLink}}});
    }

    return (
        <PreviewProvider>
            <div className={`basket-container`}>
                <div className="basket-headings">
                    {heading && <h1>{heading}</h1>}
                    {subheading && <h2>{subheading}</h2>}
                </div>
                <ErrorBoundary
                    fallback={
                        <div className={"basket-items-container"}>
                            <div className={"basket-items empty"}>
                                <FontAwesomeIcon icon={faShoppingCart} size={"l"}/>
                                <p>{emptyBasketText}</p>
                            </div>
                        </div>
                    }
                >
                    <Suspense
                        fallback={
                            <div className={`basket-items-container`}>
                                <LoadingSpinner/>
                            </div>
                        }
                    >
                        <BasketItemsContainer
                            emptyBasketText={emptyBasketText}
                            {...props}
                        />
                    </Suspense>
                </ErrorBoundary>
                <div className="basket-buttons">
                    <Button
                        className={"go-back"}
                        onClick={() => (window.location = getReturnURL())}
                    >
                        {goBackLabel}
                    </Button>
                    <Button onClick={() => goToCheckoutHandler()}>{goToCheckoutLabel}</Button>
                </div>
            </div>
        </PreviewProvider>
    );
};

export default Basket;
