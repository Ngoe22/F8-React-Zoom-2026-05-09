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
    return { ref : node , col : Number(col), row : Number(row), type  };
}

function pxToNumber(value: string): number {
    if (!value.endsWith("px")) {
        return 0;
    }
    return Number(
        value.replace("px", "")
    );
}

function isOneOfTypes(array:string[], nodes : HTMLElement[]) {

    const nodeTypes =  nodes.map( (node)=> {
        return node.getAttribute("data-type");
    } )
    for ( const nodeType of nodeTypes  ) {
        if  ( !nodeType || !array.includes(nodeType) ) return false
    }
    return true

}
export { getNodeInfo , pxToNumber , isOneOfTypes}