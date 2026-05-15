function getRowAndColOfNode (node:HTMLElement ) {

    const col = Number(node.getAttribute("data-cellcolumn"));
    const row = Number(node.getAttribute("data-cellrow"));

    return [ row , col ]
}


const getNodeAndType =
    (e: React.SyntheticEvent) : [HTMLElement, string | null] => {
        const target = e.target as HTMLElement;
        return [target, target.getAttribute("data-type")];
    };

const getNodeType = (node:HTMLElement) => {
    return node.getAttribute("data-type")
}

export { getRowAndColOfNode ,getNodeAndType ,getNodeType}