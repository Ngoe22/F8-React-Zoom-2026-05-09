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

interface updateSizeProps {
    index :number ,
    newSize : number,
}

interface CellNodeType {
    row : number ,
    col : number ,
    type : string ,
}



interface CoordinateType  {
    row : number , col : number,
}

export type  {ColumnTypes ,RowTypes , updateCellProps , CoordinateType , updateSizeProps , CellNodeType }