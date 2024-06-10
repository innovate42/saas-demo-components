// @flow
import * as React from "react";
import { useMemo, useState } from "react";
import { useCampaign, useBasket } from "@limio/sdk";
import { groupOffers } from "../source/utils/offers";
import { sanitizeString, formatDisplayPrice } from "../source/utils/string";

type Props = {
  componentId: string,
  heading: string,
  subheading: string,
  groupLabels: Array<{
    id: string,
    label: string
  }>,
};

const formatBulletPoints = (string) => {
    const sanitised = sanitizeString(string)

    const features = document.createElement("div")
    features.innerHTML = sanitised

    return [].slice.call(features.children).map((feature, i )=> (
        <li className="flex items-center space-x-3" key={`${feature.innerText}-${i}`}>
            <svg className="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400" fill="currentColor"
                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"></path>
            </svg>
            <span>{feature.innerText}</span>
        </li>
    ))
}

const Offer = ({ offer }) => {
  const {
    display_name__limio,
    display_price__limio,
    display_equivalent_price,
    cta_text__limio,
    offer_features__limio,
    price__limio,
  } = offer.data.attributes;

  const { addToBasket } = useBasket();

  return (
      <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-8 dark:bg-gray-800 dark:text-white lg:min-w-full">
        <h3 className="mb-4 text-2xl font-semibold">{display_name__limio}</h3>
        <div className="flex justify-center items-baseline my-4">
              <span className="mr-2 text-3xl font-extrabold"
                    dangerouslySetInnerHTML={{ __html: sanitizeString(formatDisplayPrice(display_price__limio, [{currencyCode: price__limio[0].currencyCode, value: price__limio[0].value,}])) }}
              />
        </div>
        <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-4">
          {display_equivalent_price}
        </p>
        <p className="font-light text-gray-500 sm:text-lg dark:text-gray-400 mb-6"
           dangerouslySetInnerHTML={{ __html: sanitizeString(formatDisplayPrice(display_price__limio, [{currencyCode: price__limio[0].currencyCode, value: price__limio[0].value,}])) }}
        />
        <ul role="list" className="mb-8 space-y-4 text-left">
          {offer_features__limio && formatBulletPoints(offer_features__limio)}
        </ul>
        <button type="button"
                onClick={() => addToBasket(offer)}
                className="mt-auto text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
          {cta_text__limio}
        </button>
      </div>
  );
};

export function GroupedOffers({ heading, subheading, groupLabels = [], componentId }: Props): React.Node {
  const { offers: campaignOffers } = useCampaign()

  const offerGroups = useMemo(() => {
    return groupOffers(campaignOffers, groupLabels);
  }, [campaignOffers, groupLabels])

  const [selectedGroup, setSelectedGroup] = useState(offerGroups[0]?.groupId)

  const selectedGroupItem = offerGroups.find(offerGroup => offerGroup.id === selectedGroup)
  const offers = selectedGroupItem.offers

  return (
      <section className="bg-white dark:bg-gray-900">
          <div className="pt-6 px-4 mx-auto max-w-screen-xl lg:px-6">
              <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                  <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">{heading}</h2>
                  <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">{subheading}</p>
              </div>
          </div>
          <div className="flex p-6 mx-auto max-w-xs text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow dark:border-gray-600 xl:p-4 dark:bg-gray-800 dark:text-white">
              {offerGroups.map((offerGroup, i) => (
                  <button onClick={() => setSelectedGroup(offerGroup.id)}   key={`${offerGroup.id}-${i}`} className={`whitespace-nowrap py-2.5 px-1.5 sm:px-3.5 mx-auto drop-shadow-md  dark:bg-gray-600 hover:bg-gray-500 dark:text-white hover:text-white rounded-md text-xs sm:text-lg  ${selectedGroup === offerGroup.id ? "dark:bg-gray-400  dark:text-white border" : ""}`}>
                      {offerGroup.label}
                  </button>
              ))}
          </div>
          <div className="space-y-8 lg:grid lg:grid-cols-2 sm:gap-6 xl:gap-10 lg:space-y-0 py-5 px-5">{ offers.map((offer) => (<Offer key={JSON.stringify(offer)} offer={offer} />)) }</div>
      </section>
  )
}


export default GroupedOffers;
