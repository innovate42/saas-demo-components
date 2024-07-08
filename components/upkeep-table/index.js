import * as React from "react";
import {useCampaign} from '@limio/sdk';
import * as R from 'ramda';
import {TableContext, useTableContext} from './context';
import './index.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleCheck} from "@fortawesome/free-solid-svg-icons";

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
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-6 m-6">
            {tableHeads.map((head, headIndex) => {
                const rows = categoriesForEachTableHead[head].map((row, i) => (
                    <tr key={JSON.stringify(row)} className="bg-white border-b hover:bg-gray-50">
                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap min-w-240p">
                            {row.label}
                        </th>
                        {sortedOffers.map((offer) => {
                            const value = getPricingTableObject(offer).find(item => item.label === row.label);
                            let tick;

                            if (value?.value && value.value.trim() !== "" && value.value.trim() !== "-") {
                                tick = <FontAwesomeIcon icon={faCircleCheck} />;
                            } else {
                                tick = value?.value || '-';
                            }
                            return (
                                <td key={offer.id} className="px-6 py-4">
                                    {tick}
                                </td>
                            );
                        })}
                    </tr>
                ));

                return (
                    <table key={headIndex} className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3"></th>
                            {sortedOffers.map((offer, index) => (
                                <th key={index} className="px-6 py-3">
                                    {headIndex !== 0 ? <span className="invisible">{offer.data.attributes.display_name__limio}</span> : offer.data.attributes.display_name__limio}
                                </th>
                            ))}
                        </tr>
                        <tr>
                            <th colSpan={sortedOffers.length + 1} className="px-6 py-3">{head}</th>
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

    const filteredOffers = React.useRef(offers.filter(offer => offer.data.attributes.pricing_table_richtext.replace(/<[^>]*>?/gm, ''))).current;

    const getPricingTableObject = (offer) => {
        const pricingTableRichText = R.pathOr([], ['data', 'attributes', 'pricing_table_richtext'], offer);
        const richTextSplit = pricingTableRichText.split(';').map((richText) => richText.trim().replace(/<[^>]*>?/gm, ''));

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
            return R.uniq(getPricingTableObject(offer).map(row => row.section));
        }));
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
