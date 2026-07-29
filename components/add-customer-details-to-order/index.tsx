import * as React from "react";
import { useBasket, captureException } from "@limio/sdk";
import { useSelector } from "@limio/shop-redux";

// Known customerDetails fields - these will be routed to customerDetails
// All other fields will automatically go to customFields
const CUSTOMER_DETAILS_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "companyName",
] as const;

type CustomerDetailField = (typeof CUSTOMER_DETAILS_FIELDS)[number];

type FieldMapping = {
  targetField: string;
  queryParamName: string;
};

type Props = {
  fieldMappings: FieldMapping[];
};

function AddCustomerDetailsToOrder({ fieldMappings }: Props): null {
  const basket = useBasket();
  const { updateBasketDetails, updateCustomField } = basket;
  const basketId = useSelector((state: any) => state.id);

  React.useEffect(() => {
    if (!basketId) {
      return;
    }

    const updateFields = async () => {
      const urlParams = new URLSearchParams(window.location.search);

      const customerDetailsToUpdate: Record<string, string> = {};
      const customFieldsToUpdate: Record<string, any> = {};
      const paramsToRemove: string[] = [];

      fieldMappings.forEach(({ targetField, queryParamName }) => {
        const value = urlParams.get(queryParamName);
        if (value) {
          if (
            CUSTOMER_DETAILS_FIELDS.includes(targetField as CustomerDetailField)
          ) {
            customerDetailsToUpdate[targetField] = value;
          } else {
            customFieldsToUpdate[targetField] = value;
          }

          paramsToRemove.push(queryParamName);
        }
      });

      if (
        Object.keys(customerDetailsToUpdate).length === 0 &&
        Object.keys(customFieldsToUpdate).length === 0
      ) {
        return;
      }

      try {
        const updatePayload: any = {
          data: {
            order: {},
          },
        };

        if (Object.keys(customerDetailsToUpdate).length > 0) {
          updatePayload.data.order.customerDetails = customerDetailsToUpdate;
        }

        if (Object.keys(customFieldsToUpdate).length > 0) {
          updatePayload.data.order.customFields = customFieldsToUpdate;
        }

        await updateBasketDetails(updatePayload);

        // Update form inputs directly so FormLite's storeRef and FormData both
        // pick up the values 
        Object.entries(customerDetailsToUpdate).forEach(([field, value]) => {
          const el = window.document.querySelector<HTMLInputElement>(
            `[name="customerDetails.${field}"]`,
          );
          if (el) {
            el.value = value;
            el.dispatchEvent(new Event("change", { bubbles: true }));
          }
        });

        // customFields are not form inputs — update via Redux only
        Object.entries(customFieldsToUpdate).forEach(([key, value]) => {
          updateCustomField(key, value);
        });

        paramsToRemove.forEach((param) => urlParams.delete(param));

        const newUrl = urlParams.toString()
          ? `${window.location.pathname}?${urlParams.toString()}${window.location.hash}`
          : `${window.location.pathname}${window.location.hash}`;

        window.history.replaceState({}, "", newUrl);
      } catch (err) {
        captureException(err);
      }
    };

    updateFields();
  }, [basketId, fieldMappings, updateBasketDetails, updateCustomField]);

  return null;
}

export default AddCustomerDetailsToOrder;
  