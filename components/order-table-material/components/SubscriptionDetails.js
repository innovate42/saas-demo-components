import * as React from 'react';
import {
  useOfferInfo,
  useTranslation,
} from '@limio/sdk';
import {
  checkCurrentSchedule,
  checkPreviousSchedule,
  formatCurrency,
  formatDate,
  stripPathToProductName,
} from '../helpers/index.js';
import { DateTime } from '@limio/date';
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from '@mui/material';

const isAddonActive = (addOn) => {
  return (
    addOn.status === 'active' && 
    addOn.data.start !== undefined &&
    DateTime.fromISO(addOn.data.start).toFormat('yyyy-MM-dd') <=
    DateTime.local().toISODate()
  );
};

const isAddonExpired = (addOn) => {
  return (
    addOn.data.end !== undefined &&
    DateTime.fromISO(addOn.data.end).toFormat('yyyy-MM-dd') <=
    DateTime.local().toISODate()
  );
};

export const checkActiveSubscriptionOffer = offersList => {
  let currentActiveOffer = offersList.filter(offer => offer.data?.start.split("T")[0] <= new Date().toISOString().split("T")[0] && (!offer.data?.end || offer.data?.end.split("T")[0] > new Date().toISOString().split("T")[0]))
  return currentActiveOffer[0]
}

export function SubscriptionDetails({ currentOffers = [], propsObject, subscription, schedule: allSchedules = [] }) {
  let { productName, noAddOnsText } = propsObject;

  const dateFormat = 'DATE_SHORT';
  const { t } = useTranslation();
  const { addOns = [] } = subscription
  console.log("addOns", addOns)
  const ownedAddOns = addOns.filter(
      (addOn) => isAddonActive(addOn) && !isAddonExpired(addOn)
  );

  console.log('allSchedules', allSchedules);
  console.log('currentOffers', currentOffers);
  console.log('subscription', subscription);

  const currentOffer = checkActiveSubscriptionOffer(currentOffers);
  console.log('currentOffer', currentOffer);
  const previousSchedule = checkPreviousSchedule(allSchedules)
  const nextSchedule = checkCurrentSchedule(allSchedules)
  const offer = currentOffer?.data?.offer;

  let { productNames, displayName } = useOfferInfo(offer);

  const currency = subscription.data?.price?.currency ?? 'USD';

  const getProductName = () => {
    const productDisplayName = productName
        ? displayName?.replace(productName, '').trim()
        : displayName;

    return productName ? productDisplayName : productNames.join(", ")
  };

  const getPrice = (scheduleObject) => {
    if (scheduleObject) {
      return formatCurrency(scheduleObject.data?.amount, currency);
    } else {
      return 'No pending payments';
    }
  };

  return (
      <Box>
        <Table
            size="small"
            sx={{
              '& td, & th': { borderBottom: 'none', paddingY: 1.2 },
              '& thead': { backgroundColor: '#f9f9f9' },
            }}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('Plan')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('Billing Plan')}
                </Typography>
              </TableCell>
              {
                  propsObject.showQuantity &&
                  <TableCell>
                    <Typography variant="subtitle2" color="text.secondary">
                      {t('Quantity')}
                    </Typography>
                  </TableCell>
              }
              <TableCell>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('Previous Charge')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('Next Charge')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('Start Date')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" color="text.secondary">
                  {t('Add-Ons')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow hover>
              <TableCell>{getProductName()}</TableCell>
              <TableCell>{offer?.data?.productBundles[0]?.rate_plan}</TableCell>
              { propsObject.showQuantity && <TableCell>{subscription.data.quantity}</TableCell> }
              <TableCell>{getPrice(previousSchedule)}</TableCell>
              <TableCell>{getPrice(nextSchedule)}</TableCell>
              <TableCell>
                {formatDate(
                    subscription.data?.startDate || subscription.created,
                    dateFormat
                )}
              </TableCell>
              <TableCell>
                {ownedAddOns.length ? (
                    ownedAddOns.map((addOn) => (
                        <Typography key={addOn.id} variant="body2" color="text.primary">
                          {stripPathToProductName(
                              addOn.data?.offer.data.products[0]?.path
                          )}
                        </Typography>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary">
                      {noAddOnsText}
                    </Typography>
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
  );
}
