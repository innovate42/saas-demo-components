import React from 'react';
import {useLimioContext} from "@limio/sdk"

function PricingPageError() {
    const { isInPageBuilder } = useLimioContext();

    if (isInPageBuilder) {
        return (
            <div>
                <p>For this component to work please use a tempalte with offer_features defined on all the offers</p>
                <p>it also works with 2 groups</p>
            </div>
        );
    }


    return (
        <div>
            <p>Something went wrong! Please try again later.</p>
        </div>
  );
}

export default PricingPageError;