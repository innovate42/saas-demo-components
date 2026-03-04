// @flow
import React, { useEffect, useMemo, useState } from "react";
import { useCampaign } from "@limio/sdk";
import Offer from "./components/Offer.js";
import * as R from "ramda";
import "./fonts.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Button, Box } from '@mui/material'

type Props = {
    heading: string,
    subheading: string,
    offerWidth: number,
    primaryColor__limio_color: string,
    componentId: string,
    showImage: boolean,
    groupLabels: Array<any>,
    showGroupedOffers: boolean,
    freeTrialLink: string,
    best_value_color__limio_color: string,
    themeColor: string,
};

// Define theme styles for each color
const themeStyles = {
    orange: {
        primary: "#E16A00",
        background: "#FEF1E9",            // Best value card
        cardBackground: "#FFFBF7",        // Non-best-value card
        pillBackground: "#FBE9D8",
        pillText: "#B84C00",
        borderColor: "#E16A00",
        text: "#6B3E26"
    },
    blue: {
        primary: "#005C99",
        background: "#EAF3FB",
        cardBackground: "#F4F9FD",
        pillBackground: "#D0E7F8",
        pillText: "#004A80",
        borderColor: "#0073C2",
        text: "#003355"
    },
    red: {
        primary: "#C62828",
        background: "#FDECEA",
        cardBackground: "#FEF6F6",
        pillBackground: "#F9D3D3",
        pillText: "#8B0000",
        borderColor: "#B71C1C",
        text: "#5C1C1C"
    },
    green: {
        primary: "#2E7D32",
        background: "#E7F5EC",
        cardBackground: "#F3FAF5",
        pillBackground: "#D2EBDD",
        pillText: "#1B5E20",
        borderColor: "#388E3C",
        text: "#1B3D1B"
    },
    black: {
        primary: "#333333",
        background: "#F6F6F6",
        cardBackground: "#FDFDFD",
        pillBackground: "#DCDCDC",
        pillText: "#111111",
        borderColor: "#222222",
        text: "#111111"
    },
    grey: {
        primary: "#6E6E6E",
        background: "#FAFAFA",
        cardBackground: "#FFFFFF",
        pillBackground: "#ECECEC",
        pillText: "#5C5C5C",
        borderColor: "#BBBBBB",
        text: "#3C3C3C"
    }
};

const theme = createTheme({
    typography: {
        fontFamily: `'Inter', 'system-ui', 'Helvetica Neue', Arial, sans-serif`,
    },
});

function groupOffers(offers, groupLabels) {
    const groups = R.groupBy(R.path(["data", "attributes", "group__limio"]), offers);
    const groupLabelArray = groupLabels.map((group) => group.id);

    function reorderKeys(obj, order) {
        const newObj = {};
        order.forEach((key) => {
            if (obj.hasOwnProperty(key)) {
                newObj[key] = obj[key];
            }
        });
        return newObj;
    }

    const sortedGroup = reorderKeys(groups, groupLabelArray);

    const groupedOffers = Object.keys(sortedGroup).map((groupId) => {
        const group = groupLabels.find((group) => group.id === groupId);
        if (group) {
            const { label, thumbnail } = group;
            return {
                groupId,
                id: groupId,
                label: label,
                offers: groups[groupId],
                thumbnail: thumbnail,
            };
        }
    });

    return groupedOffers;
} 

export const OfferCards = ({
                               heading,
                               subheading,
                               showImage,
                               componentId,
                               offerWidth,
                               groupLabels,
                               showGroupedOffers,
                               freeTrialLink,
                               themeColor = "orange"
                           }: Props) => {
    const { offers } = useCampaign();

    const themeSet = themeStyles[themeColor] || themeStyles.orange;

    const offerGroups = useMemo(() => {
        return groupOffers(offers, groupLabels).filter((group) => group !== undefined);
    }, [offers, groupLabels]);

    const [selectedGroup, setSelectedGroup] = useState();
    const selectedGroupItem = offerGroups.find((offerGroup) => offerGroup.id === selectedGroup);
    const selectedGroupOffers = selectedGroupItem?.offers || [];

    const hasBestValue = selectedGroupOffers.some(
        (offer) => offer.data.attributes.best_value__limio
    );

    const styleBestValue = () => {
        if (hasBestValue) {
            return `60px`;
        }
    };

    React.useEffect(() => {
        if (!selectedGroup) {
            setSelectedGroup(offerGroups[0]?.id);
        }
    }, [offerGroups, selectedGroup]);

    useEffect(() => {
        typeof performance !== "undefined" && performance?.mark?.("offers-init");
    }, [])




    return (
        <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <section id={componentId} className="offer-cards-material">
                <Box
                    sx={{
                        py: { xs: 8, lg: 16 }, // Tailwind py-8 lg:py-16
                        px: { xs: 4, lg: 6 },  // Tailwind px-4 lg:px-6
                        maxWidth: '1280px',    // Tailwind max-w-screen-xl
                        margin: '0 auto',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box sx={{ textAlign: 'center', maxWidth: '768px', mx: 'auto', mb: 8 }}>
                        <Box
                            component="h2"
                            sx={{
                                fontSize: '2.25rem', // ~36px (Tailwind text-4xl)
                                fontWeight: 800,
                                letterSpacing: '-0.01em',
                                lineHeight: 1.2,
                                color: '#111827', // Tailwind gray-900
                                mb: 2,
                                fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            {heading}
                        </Box>
                        <Box
                            component="p"
                            sx={{
                                fontSize: '1.125rem', // Tailwind sm:text-xl (18px)
                                fontWeight: 300,
                                color: '#6B7280', // Tailwind gray-500
                                fontFamily: 'Inter, sans-serif',
                                lineHeight: 1.6,
                            }}
                        >
                            {subheading}
                        </Box>
                    </Box>


                    {showGroupedOffers ? (
                        <>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '9999px',
                                    backgroundColor: themeSet.pillBackground,
                                    border: `1px solid ${themeSet.borderColor}`,
                                    boxShadow: '0 1px 5px rgba(0, 0, 0, 0.05)',
                                    p: 0.5,
                                    mb: hasBestValue ? '60px' : 4,
                                    mx: 'auto',
                                }}
                            >
                                {offerGroups.map((offerGroup, i) => {
                                    const selected = selectedGroup === offerGroup.id;
                                    return (
                                        <Button
                                            key={`${offerGroup.id}-${i}`}
                                            onClick={() => setSelectedGroup(offerGroup.id)}
                                            sx={{
                                                display: 'inline-flex !important',
                                                alignItems: 'center !important',
                                                justifyContent: 'center !important',
                                                verticalAlign: 'middle !important',
                                                textAlign: 'center !important',
                                                lineHeight: '1.75 !important',
                                                userSelect: 'none !important',
                                                cursor: 'pointer !important',
                                                boxSizing: 'border-box !important',
                                                outline: 'none !important',
                                                minWidth: '64px !important',
                                                transition: 'background-color 250ms, box-shadow 250ms, border-color 250ms, color 250ms !important',
                                                WebkitTapHighlightColor: 'transparent !important',
                                                textTransform: 'none !important',
                                                fontSize: '14px !important',
                                                fontWeight: `${selected ? 600 : 400} !important`,
                                                borderRadius: '9999px !important',
                                                padding: '10px 24px !important', // equivalent to px-3 py-1.25
                                                minWidth: 'auto !important',
                                                backgroundColor: `${selected ? themeSet.cardBackground : 'transparent'} !important`,
                                                color: `${selected ? themeSet.primary : themeSet.text} !important`,
                                                border: `${selected ? `1.5px solid ${themeSet.primary}` : '1px solid transparent'} !important`,
                                                boxShadow: selected
                                                    ? '0px 2px 6px rgba(0, 0, 0, 0.05) !important'
                                                    : 'none !important',
                                                transition: 'all 0.2s ease-in-out !important',
                                                fontFamily: `'Inter', sans-serif !important`,
                                                '&:hover': {
                                                    backgroundColor: `${selected ? themeSet.cardBackground : '#F3F3F3'} !important`,
                                                    color: `${themeSet.primary} !important`,
                                                    borderColor: `${selected ? themeSet.primary : themeSet.pillText} !important`,
                                                },
                                            }}
                                        >
                                            {offerGroup.label}
                                        </Button>

                                    );
                                })}
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex !important',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center !important',
                                    gap: '1rem',
                                    width: '100%',
                                    margin: '0 auto',
                                }}
                            >
                                {selectedGroupOffers.length > 0 ? (
                                    selectedGroupOffers.map((offer, i) => (
                                        <Offer
                                            key={`${offer.path}/parent-${i}`}
                                            offer={offer}
                                            showImage={showImage}
                                            offerWidth={offerWidth}
                                            primaryColor={themeSet.primary}
                                            freeTrialLink={freeTrialLink}
                                            bestValueColor={themeSet.primary}
                                            backgroundColor={themeSet.background}
                                            pillColor={themeSet.pillBackground}
                                            pillTextColor={themeSet.pillText}
                                            borderColor={themeSet.borderColor}
                                            textColor={themeSet.text}
                                        />
                                    ))
                                ) : (
                                    <p>No offers to display...Please add a label to view offers</p>
                                )}
                            </Box>
                        </>
                    ) : (
                        <Box
                            sx={{
                                display: 'flex !important',
                                flexWrap: 'wrap',
                                justifyContent: 'center !important',
                                gap: '1rem',
                                width: '100%',
                                margin: '0 auto',
                            }}
                        >
                            {offers.length > 0 ? (
                                offers.map((offer, i) => (
                                    <Offer
                                        key={`${offer.path}/parent-${i}`}
                                        offer={offer}
                                        showImage={showImage}
                                        offerWidth={offerWidth}
                                        primaryColor={themeSet.primary}
                                        freeTrialLink={freeTrialLink}
                                        bestValueColor={themeSet.primary}
                                        backgroundColor={themeSet.background}
                                        pillColor={themeSet.pillBackground}
                                        pillTextColor={themeSet.pillText}
                                        borderColor={themeSet.borderColor}
                                        textColor={themeSet.text}
                                        cardBackground={themeSet.cardBackground}
                                    />
                                ))
                            ) : (
                                <p>No offers to display...</p>
                            )}
                        </Box>
                    )}
                </Box>
            </section>
        </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default OfferCards;
