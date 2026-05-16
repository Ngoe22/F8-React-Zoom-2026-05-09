import {createContext, type ReactNode,} from "react";

import type {ColumnTypes, RowTypes, updateCellProps, updateRowSizeProps} from "../../types";





type ContextType = {
    columns: ColumnTypes[];
    rows: RowTypes[];
    fixedSize : {
        [key: string]: string ;
    }
    dataTag : {
        [key: string]: string ;
    }
    updateCell: (props: updateCellProps) => void;
    updateRowSize : ( props :updateRowSizeProps ) => void;
};

const Context =
    createContext<ContextType | null>(
        null
    );

interface TableProps {
    children: ReactNode;
    value: ContextType;
}

function Provider({children, value}: TableProps) {
    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
}

export { Context, Provider };