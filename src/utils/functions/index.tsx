// function getRowAndCol (node:HTMLElement ) {
//     const col = node.getAttribute("data-column") ?? -1 ;
//     const row =  node.getAttribute("data-row") ?? -1 ;
//     return [   Number(row)  , Number(col)  ]
// }
//
//
// interface getCellByCoordinateProps {
//     row: number | null;
//     col: number | null ;
//     type : string
// }
//
// function getCellByCoordinate ( { row = null ,col = null , type } :getCellByCoordinateProps  ) {
//
//     const colQ= col ? `[data-column="${col}"]` : ""
//     const rowQ= row ? `[data-row="${row}"]` : ""
//
//     return document.querySelector(
//         `${colQ}${rowQ}[data-type="${type}"]`
//     ) as HTMLElement;
// }
//
//
// const getNodeAndType =
//     (e: React.SyntheticEvent) : [HTMLElement, string | null] => {
//         const target = e.target as HTMLElement;
//         return [target, target.getAttribute("data-type")];
//     };
//
// const getNodeType = (node:HTMLElement) => {
//     return node.getAttribute("data-type")
// }

function getNodeInfo ( node:HTMLElement ) {
    const col = node.getAttribute("data-column") ?? -1 ;
    const row =  node.getAttribute("data-row") ?? -1 ;
    const type = node.getAttribute("data-type") ?? "" ;
    return {   col : Number(col), row : Number(row), type  };
}

function pxToNumber(value: string): number {
    if (!value.endsWith("px")) return 0;
    return Number(value.replace("px", ""));
}

function isOneOfTypes(array:string[], nodeTypes : string[]) {
    for ( const nodeType of nodeTypes  ) {
        if  ( !nodeType || !array.includes(nodeType) ) return false
    }
    return true
}


interface  queryCellNodeProps {
    row : number | null;
    col : number | null;
    type  : string | null;
}

function queryCellNode ( {row , col , type ,  } : queryCellNodeProps  ) {

    const rowQ = ( row === null || row < 0 )  ? "" : `[data-row="${row}"]`
    const colQ = ( col === null || col < 0 )  ? "" : `[data-column="${col}"]`
    const typeQ = row === null ? "" : `[data-type="${type}"]`

    if (!(rowQ+colQ+typeQ) ) return null
    return document.querySelector(rowQ+colQ+typeQ) as HTMLElement
}




export { getNodeInfo , pxToNumber , isOneOfTypes , queryCellNode}