import React from "react";

export const TableContext = React.createContext({});

export function useTableContext() {
    const context = React.useContext(TableContext);
    if (!context) {
        throw new Error('useTableContext must be used within a TableProvider');
    }
    return context;
}
