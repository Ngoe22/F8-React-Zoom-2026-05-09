
import styles from "./styles.module.css"
import type {CellNodeType } from "../../../../types"
import {queryCellNode} from "../../../../utils/functions";

interface HighlightCellProps {
    startNode : CellNodeType | null
    endNode : CellNodeType | null
}

function HighlightCell ( {startNode , endNode} : HighlightCellProps  ) {
    if ( !startNode || !endNode  ) return null

    const a = queryCellNode( {
        row : startNode.row , col : startNode.col , type :startNode.type
    } )
    const b = queryCellNode( {
        row : endNode.row , col : endNode.col , type :endNode.type
    } )
    if ( !a || !b ) return null


    const maxTop = Math.max( a.offsetTop , b.offsetTop  ) ;
    const minTop = Math.min( a.offsetTop , b.offsetTop ) ;
    const maxLeft = Math.max( a.offsetLeft , b.offsetLeft ) ;
    const minLeft = Math.min( a.offsetLeft , b.offsetLeft ) ;

    const  bottomNode = a.offsetTop >= b.offsetTop ? a : b ;
    const  rightNode = a.offsetLeft >= b.offsetLeft ? a : b ;

    const t = minTop ;
    const l = minLeft ;

    const w = maxLeft - minLeft + rightNode.offsetWidth ;
    const h = maxTop - minTop + bottomNode.offsetHeight ;

    return (
        <div
            className={styles.highlightRange}
            style={{
                top : `${t}px` ,
                left :  `${l}px` ,
                width : `${w}px` , height : `${h}px`
            }}
        />
    )
}

export default HighlightCell