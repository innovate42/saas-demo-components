// @flow
import * as React from "react";
import {useCampaign} from '@limio/sdk';
import * as R from 'ramda';
import {TableContext, useTableContext} from './context';
import './index.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons"


type Props = {}

function UpkeepTable({}: Props): React.Node {
    const {offers} = useCampaign();
    const {
        tableHeads,
        sortedOffers,
        categoriesForEachTableHead,
        getPricingTableObject
    } = useTableContext();

    return (
        <div className="table-container max-page-width">
            {/*<div className="sticky-bar">*/}
            {/*    <div className="sticky-bar-item">Features</div>*/}
            {/*    {sortedOffers.map((offer, index) => (*/}
            {/*        <div className="sticky-bar-item" key={index}>{offer.name}</div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            {tableHeads.map((head, index) => {
                const rows = categoriesForEachTableHead[head].map((row, i) => {

                    const bgColorAlternate = (i % 2) ? 'bg-light' : 'bg-not-light';

                    return (
                        <tr key={JSON.stringify(row)} className={` ${bgColorAlternate}`}>
                            <th scope="row" className={`tr-th-label ${bgColorAlternate}`}>{row.label}</th>
                            {sortedOffers.map((offer, offerIndex) => {
                                const value = getPricingTableObject(offer).find(item => item.label === row.label);
                                let gradient = '';
                                let tick;


                                if (value?.value && value.value.trim() !== "" && value.value.trim() !== "-") {
                                    tick = <FontAwesomeIcon icon={faCircleCheck} />;
                                } else {
                                    tick = value?.value || '-';
                                }

                                if (bgColorAlternate === 'bg-not-light') {
                                    if (offerIndex === 0) {
                                        gradient = 'gradient-1';
                                    } else if (offerIndex === 1) {
                                        gradient = 'gradient-2';
                                    } else if (offerIndex === 2) {
                                        gradient = 'gradient-3';
                                    }
                                }

                                return <td key={offer.id}
                                           className={`td-row ${gradient}`}>{tick}</td>;
                            })}
                        </tr>
                    );
                });

                const tableClass = index === 0
                    ? 'styled-table first-table'
                    : index === tableHeads.length - 1
                        ? 'styled-table last-table'
                        : 'styled-table middle-table';

                return (
                    <table className={tableClass}>
                        <thead>
                        <tr>
                            <th></th>
                            {index === 0 && sortedOffers.map((offer, index) => (
                                <th key={index}>{offer.data.attributes.display_name__limio}</th>
                            ))}
                        </tr>
                        <tr>
                            <th>{head}</th>

                        </tr>
                        </thead>
                        <tbody>
                        {rows}
                        </tbody>
                    </table>
                );
            })}
        </div>
    );
}

function UpkeepTableWrapper() {
    const {offers} = useCampaign();

    const filteredOffers = React.useRef(offers.filter(offer => offer.data.attributes.pricing_table_richtext)).current


    const getPricingTableObject = (offer) => {
        const pricingTableRichText = R.pathOr([], ['data', 'attributes', 'pricing_table_richtext'], offer);

        // Replace all HTML tags with an empty string
        const richTextSplit = pricingTableRichText.split(';').map((richText) => richText.trim().replace(/<[^>]*>?/gm, ''));

        // Each split will be "Work Orders, Work Order Management, ✔️"
        // Create objects of the form {section: "Work Orders", label: "Work Order Management", value: "✔️"}
        let pricingTableObjects = richTextSplit.map((richText) => {
            if (richText.includes("Locations, Assets, and Parts,")) {
                // Split this based on the specific section "Locations, Assets, and Parts,"
                const section = "Locations, Assets, and Parts,";
                const remainingText = richText.replace(section, '');
                const split = remainingText.split(',');

                return {
                    section: section,
                    label: split[0],
                    value: R.pathOr('', [1], split)
                };
            }

            const split = richText.split(',');

            return {
                section: split[0],
                label: split[1],
                value: R.pathOr('', [2], split)
            };
        });

        return pricingTableObjects.filter(item => !!item.section && !!item.label);
    };

    const tableHeads = React.useMemo(() => {
        return R.uniq(filteredOffers.flatMap(offer => {
                const sections = R.uniq(getPricingTableObject(offer).map(row => row.section));
                console.log("sections", sections)
                return sections
            }
        ))

    }, [filteredOffers]);


    const sortedOffers = React.useMemo(() => {
        return filteredOffers.sort((a, b) => {

            const valueA = getPricingTableObject(a).map(row => row?.value ? row.value : 0);
            const valueB = getPricingTableObject(b).map(row => row?.value ? row.value : 0);
            return valueA - valueB;
        });
    }, [filteredOffers]);

    const categoriesForEachTableHead = React.useMemo(() => {
        const objectWithVals = tableHeads.map(head => {
            return sortedOffers.map(offer => {
                return getPricingTableObject(offer).filter(row => row.section === head);
            });
        }).reduce((acc, curr, index) => {
            return {
                ...acc,
                [tableHeads[index]]: curr.flat()
            };
        }, {});

        Object.keys(objectWithVals).forEach(key => {
            const labels = objectWithVals[key].map(item => item.label);
            const uniqueLabels = new Set(labels);

            if (uniqueLabels.size !== labels.length) {
                objectWithVals[key] = objectWithVals[key].filter((item, index) => labels.indexOf(item.label) === index);
            }
        });

        return objectWithVals;
    }, [sortedOffers]);

    const context = {
        tableHeads,
        sortedOffers,
        categoriesForEachTableHead,
        getPricingTableObject
    };

    return (
        <TableContext.Provider value={context}>
            <UpkeepTable/>
        </TableContext.Provider>
    );
}

export default UpkeepTableWrapper;
