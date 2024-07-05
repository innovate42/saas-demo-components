// @flow
import * as React from "react";
import { useCampaign } from '@limio/sdk';
import * as R from 'ramda';
import { TableContext, useTableContext } from './context';
import './index.css';

type Props = {}

function UpkeepTable({}: Props): React.Node {
    const { offers } = useCampaign();
    const {
        tableHeads,
        sortedOffers,
        categoriesForEachTableHead
    } = useTableContext();
    console.log(offers);
    console.log(tableHeads);

    return (
        <div>
            {/*<div className="sticky-bar">*/}
            {/*    <div className="sticky-bar-item">Features</div>*/}
            {/*    {sortedOffers.map((offer, index) => (*/}
            {/*        <div className="sticky-bar-item" key={index}>{offer.name}</div>*/}
            {/*    ))}*/}
            {/*</div>*/}
            {tableHeads.map((head, index) => {
                const rows = categoriesForEachTableHead[head].map(row => {
                    return (
                        <tr key={JSON.stringify(row)}>
                            <th scope="row" className="tr-th-label">{row.label}</th>
                            {sortedOffers.map(offer => {
                                const value = offer.attributes.pricing_table.find(item => item.label === row.label);
                                console.log("value", value.value);
                                return <td key={offer.id} className="td-row">{value && value.value ? value.value : '-'}</td>;
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
                    <div className="table-container" key={JSON.stringify(head)}>
                        <table className={tableClass}>
                            <thead>
                            <tr>
                                <th>{head}</th>
                                {sortedOffers.map((offer, index) => (
                                    <th key={index}>{offer.name}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {rows}
                            </tbody>
                        </table>
                    </div>
                );
            })}
        </div>
    );
}

function UpkeepTableWrapper() {
    const { offers } = useCampaign();

    // TODO: in live these will be offer data attributes as path
    const tableHeads = React.useMemo(() => {
        return R.uniq(((offers.flatMap(offer => {
            return offer.attributes.pricing_table.flatMap(row => {
                const keys = Object.keys(row);
                if (!keys.includes('value')) {
                    return row;
                }
            });
        })).filter(Boolean).map(row => row.section)));
    }, [offers]);

    const sortedOffers = React.useMemo(() => {
        return offers.sort((a, b) => {
            const valueA = a.attributes.pricing_table.map(row => row.value ? row.value : 0);
            const valueB = b.attributes.pricing_table.map(row => row.value ? row.value : 0);
            return valueA - valueB;
        });
    }, [offers]);

    const categoriesForEachTableHead = React.useMemo(() => {
        const objectWithVals = tableHeads.map(head => {
            return sortedOffers.map(offer => {
                return offer.attributes.pricing_table.filter(row => row.section === head);
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
            <UpkeepTable />
        </TableContext.Provider>
    );
}

export default UpkeepTableWrapper;
