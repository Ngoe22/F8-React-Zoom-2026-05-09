
import styles from "./styles.module.css"
import type {CellNodeType } from "../../../../types"
import {queryCellNode} from "../../../../utils/functions";

interface HighlightCellProps {
    node : CellNodeType | null
}

function HighlightCell ( {node} : HighlightCellProps  ) {

    if ( !node ) return null
    const focusNode = queryCellNode( {
        row : node.row , col : node.col , type :node.type
    } )
    if ( !focusNode ) return null

    return (
        <div
            className={styles.highlightCell}
            style={{
                top : `${focusNode.offsetTop }px` ,
                left :  `${focusNode.offsetLeft}px` ,
                width : `${focusNode.offsetWidth  }px` , height : `${focusNode.offsetHeight }px`
            }}
        >
        </div>
    )
}

export default HighlightCell