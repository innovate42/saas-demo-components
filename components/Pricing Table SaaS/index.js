// @flow
import * as React from "react";
import {useCampaign} from '@limio/sdk';
import * as R from 'ramda';
import {TableContext, useTableContext} from './context';
import './index.css';

type Props = {}

function UpkeepTable({}: Props): React.Node {
    const {offers} = useCampaign();
    const {
        tableHeads,
        sortedOffers,
        categoriesForEachTableHead
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
                                const value = offer.data.attributes.pricing_table.find(item => item.label === row.label);
                                let gradient = '';
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
                                           className={`td-row ${gradient}`}>{value && value.value ? value.value : '-'}</td>;
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
                            <th>{head}</th>
                            {index === 0 && sortedOffers.map((offer, index) => (
                                <th key={index}>{offer.data.attributes.display_name__limio}</th>
                            ))}
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

    // TODO: in live these will be offer data attributes as path
    const tableHeads = React.useMemo(() => {
        return R.uniq(((offers.flatMap(offer => {
            return offer.data.attributes.pricing_table.flatMap(row => {
                const keys = Object.keys(row);
                if (!keys.includes('value')) {
                    return row;
                }
            });
        })).filter(Boolean).map(row => row.section)));
    }, [offers]);

    const sortedOffers = React.useMemo(() => {
        return offers.sort((a, b) => {
            const valueA = a.data.attributes.pricing_table.map(row => row.value ? row.value : 0);
            const valueB = b.data.attributes.pricing_table.map(row => row.value ? row.value : 0);
            return valueA - valueB;
        });
    }, [offers]);

    const categoriesForEachTableHead = React.useMemo(() => {
        const objectWithVals = tableHeads.map(head => {
            return sortedOffers.map(offer => {
                return offer.data.attributes.pricing_table.filter(row => row.section === head);
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
    console.log(categoriesForEachTableHead);

    console.log(sortedOffers);

    const context = {
        tableHeads,
        sortedOffers,
        categoriesForEachTableHead
    };

    return (
        <TableContext.Provider value={context}>
            <UpkeepTable/>
        </TableContext.Provider>
    );
}

export default UpkeepTableWrapper;
