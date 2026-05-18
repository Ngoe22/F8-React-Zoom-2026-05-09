import {useContext} from "react";
import { Context } from "../../../../contexts/Table";
import styles from "./styles.module.css";
import { pxToNumber } from "../../../../utils/functions"


function IndexRows() {

    const { rows ,fixedSize ,dataTag , updateRowSize }  = useContext(Context)!;


    const mouseDownHandler
        = (e: React.MouseEvent<HTMLDivElement> , index :number ) => {

        const node = e.target as HTMLElement;
        const parent
            = node.closest(`[data-type=${dataTag.sheet}]`) as HTMLElement | null;
        if (!parent) return
        const parentWidth = parent.offsetWidth

        node.classList.add(styles.onResize);
        node.style.width = parentWidth + "px";
        const startY = e.clientY;
        const newSize =  { num : 0 }

        const mouseMoveHandler = (e: MouseEvent) => {

            const gap = e.clientY +  - startY
            node.style.bottom = gap*-1 + "px";
            newSize.num = gap
        };
        const mouseUpHandler = () => {
            const currentHeight =  pxToNumber(rows[index].height)
            const newWidth = currentHeight + newSize.num  < 20 ? 20 :  currentHeight + newSize.num
            node.classList.remove(styles.onResize);
            Object.assign(node.style, {
                bottom: ``,
                width: ``,
            });
            updateRowSize( {index , newSize : newWidth } )
            //
            window.removeEventListener("mousemove", mouseMoveHandler);
            window.removeEventListener("mouseup", mouseUpHandler);
        };
        window.addEventListener("mousemove", mouseMoveHandler);
        window.addEventListener("mouseup", mouseUpHandler);
    };


    const UI = rows.map( (row ,index )=>
         <li
            className={styles.row}  key={index+1}
            style={{height : row.height } }
            data-type = {dataTag.indexRow}
            data-row = { index }
        >
            {index+1}
            <div
                onMouseDown={(e) => {mouseDownHandler(e ,index)}}
                className={styles.resizeBorder}
                data-type = {dataTag.resizeIndexRow}
            />
        </li>
     )

    return (
        <ul style={{width : fixedSize.indexRowWidth} }  >
            <li
                className={styles.row} key={"header"}
                style={ {height : fixedSize.headerHeight } }
            >
                <div className={styles.resizeBorderHeader} ></div>
            </li>
            {/*/ index /*/}
            {UI}
        </ul>
    )
}

export default IndexRows;