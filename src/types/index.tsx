interface ColumnTypes {
    name : string,
    editable : boolean
    width : string ,
    [key: string]: string | boolean;
}

interface RowTypes {
    [key: string ]: string;
}

interface updateCellProps {
    rowIndex :number,
    colIndex : number,
    value : string,
}

export type  {ColumnTypes ,RowTypes , updateCellProps  }