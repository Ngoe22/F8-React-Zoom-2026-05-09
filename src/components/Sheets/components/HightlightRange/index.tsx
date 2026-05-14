
import styles from "./styles.module.css"


interface HighlightCellProps {
    startNode : HTMLElement | null
    endNode : HTMLElement | null
}

function HighlightCell ( {startNode , endNode} : HighlightCellProps  ) {
    if ( !startNode || !endNode  ) return null

    const maxTop = Math.max( startNode.offsetTop , endNode.offsetTop  ) ;
    const minTop = Math.min( startNode.offsetTop , endNode.offsetTop ) ;
    const maxLeft = Math.max( startNode.offsetLeft , endNode.offsetLeft ) ;
    const minLeft = Math.min( startNode.offsetLeft , endNode.offsetLeft ) ;

    const  bottomNode = startNode.offsetTop >= endNode.offsetTop ? startNode : endNode ;
    const  rightNode = startNode.offsetLeft >= endNode.offsetLeft ? startNode : endNode ;

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
        >

        </div>
    )
}

export default HighlightCell