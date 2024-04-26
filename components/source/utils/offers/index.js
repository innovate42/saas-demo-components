// @flow
import * as R from "ramda";
import type {
    LimioObject,
    CatalogItem,
    Offer,
    OfferMetadata,
} from "@limio/types";

export type Group = {
    id: string,
    label: string,
    thumbnail: string,
};

export function sortOffers(
    offersIn: Array<CatalogItem<Offer>>,
    sorting: { [key: string]: number }
): Array<CatalogItem<Offer>> {
    // clone the array as otherwise the array is sorted in place which is unexpected
    let offers = [...offersIn];

    if (sorting) {
        return offers.sort((a, b) => sorting[a.path] - sorting[b.path]);
    }

    if (R.any((offer) => offer?.data?.attributes?.sales_channel__limio, offers)) {
        offers = offers.filter(
            (offer) =>
                R.isNil(offer?.data?.attributes?.sales_channel__limio) ||
                R.includes("Online", offer?.data?.attributes?.sales_channel__limio)
        );
    }

    return offers.sort((a, b) => {
        const firstPrice =
            R.path(["data", "attributes", "price__limio", 0, "value"], a) || 0;
        const secondPrice =
            R.path(["data", "attributes", "price__limio", 0, "value"], b) || 0;

        return parseFloat(firstPrice) - parseFloat(secondPrice);
    });
}

// returns the union of the offers referenced by offersMetadata and offers.
export function sortOffers2(
    offers: Array<CatalogItem<Offer>>,
    offersMetadata: Array<OfferMetadata> = []
): Array<CatalogItem<Offer>> {
    // get the offers referenced by the metadata, remove anything where there is no match (ie offers metadata is out of date with offers returned)
    const offerListFromMetadata = offersMetadata
        .map(({ path: offer }) => offers.find(({ path }) => path === offer))
        .filter(Boolean);

    // return the union of the two lists, and remove duplicates.
    const displayOrder = R.uniq([...offerListFromMetadata, ...offers]);

    return displayOrder;
}

export function filterTrials(
    offers: Array<LimioObject<Offer>>,
    filterTrial: boolean
): Array<LimioObject<Offer>> {
    if (filterTrial) {
        const filteredOffers = offers.map((offer) => ({
            ...offer,
            hidden: offer?.data?.attributes?.trial__limio,
        }));
        return filteredOffers;
    }

    return offers;
}

type GroupInfo = {
    groupId: string,
    id: string,
    label: string,
    offers: Array<LimioObject<Offer>>,
    thumbnail?: string,
};

export function groupOffers(
    offers: Array<LimioObject<Offer>> = [],
    groupLabels: Group[] = []
): Array<GroupInfo> {
    const groups = R.groupBy(
        R.path(["data", "attributes", "group__limio"]) || "other",
        offers
    );
    const groupedOffers = Object.keys(groups).map((groupId) => {
        const group = groupLabels.find((group) => group.id === groupId) || {
            id: "_other",
            label: "Other",
            thumbnail: "",
        };
        const { label, thumbnail } = group;
        return {
            groupId,
            id: groupId,
            label: label,
            offers: groups[groupId],
            thumbnail: thumbnail,
        };
    });

    return groupedOffers;
}