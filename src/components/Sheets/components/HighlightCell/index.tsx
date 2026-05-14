
import styles from "./styles.module.css"


interface HighlightCellProps {
    node : HTMLElement | null
}

function HighlightCell ( {node} : HighlightCellProps  ) {
    if ( !node ) return null

    return (
        <div
            className={styles.highlightCell}
            style={{
                top : `${node.offsetTop }px` ,
                left :  `${node.offsetLeft}px` ,
                width : `${node.offsetWidth  }px` , height : `${node.offsetHeight }px`
            }}
        >
        </div>
    )
}

export default HighlightCell