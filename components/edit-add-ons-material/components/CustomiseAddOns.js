// @flow
import * as React from 'react';
import { Box, Card, CardContent, Typography, IconButton, Divider, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useCampaign } from '@limio/sdk';
import { stripPathToProductName } from './helpers';

type Props = {
    cantFindCopy: string,
    customiseAddOnTitle: string,
    onlyShowPurchase: boolean,
    updates: Array<Object>,
    handleRemove: Function,
    handleAdd: Function,
    handleFilter: Function,
    billingPlan: string,
    handleQuantityChange: Function,
    baseProduct: string,
    themeStyles: Object,
};

function CustomiseAddOns({
                             cantFindCopy,
                             customiseAddOnTitle,
                             onlyShowPurchase,
                             updates,
                             handleRemove,
                             handleAdd,
                             handleFilter,
                             billingPlan,
                             handleQuantityChange,
                             baseProduct,
                             themeStyles,
                         }: Props): React.Node {
    const { addOns = [] } = useCampaign();

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: themeStyles.text }}>
                {customiseAddOnTitle}
            </Typography>

            <Stack spacing={2}>
                {addOns.map((addOn, index) => {
                    const description = addOn.data.attributes.description__limio;
                    const id = addOn.id;
                    const isInBasket = updates.find(update => update.id === id);
                    const isRemove = isInBasket?.type === 'remove';

                    const handleClick = () => {
                        if (isRemove) handleRemove(addOn);
                        else handleAdd(addOn);
                    };

                    return (
                        <Card
                            key={index}
                            variant="outlined"
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                px: 2,
                                py: 1,
                                borderColor: themeStyles.borderColor,
                                boxShadow: themeStyles.cardShadow,
                            }}
                        >
                            <Box
                                dangerouslySetInnerHTML={{ __html: description }}
                                sx={{ flex: 1, pr: 2, fontSize: 14, color: themeStyles.text }}
                            />
                            <IconButton
                                id={id}
                                data-version={addOn.version}
                                data-quantity={1}
                                onClick={handleClick}
                                color="primary"
                                sx={{ color: isRemove ? themeStyles.primary : themeStyles.primary }}
                            >
                                {isRemove ? <RemoveCircleOutlineIcon /> : <AddCircleOutlineIcon />}
                            </IconButton>
                        </Card>
                    );
                })}
            </Stack>

            <Card
                variant="outlined"
                sx={{
                    mt: 3,
                    px: 2,
                    py: 2,
                    borderColor: themeStyles.primary,
                    backgroundColor: themeStyles.cardBackground,
                    boxShadow: themeStyles.cardShadow,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon fontSize="small" sx={{ mr: 1, color: themeStyles.text }} />
                    <Box
                        dangerouslySetInnerHTML={{ __html: cantFindCopy }}
                        sx={{ fontSize: 14, color: themeStyles.text }}
                    />
                </Box>
            </Card>
        </Box>
    );
}

export default CustomiseAddOns;
