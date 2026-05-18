import {useContext } from "react";
import { Context } from "../../../../contexts/Table";
import styles from "./styles.module.css"
import { pxToNumber } from "../../../../utils/functions"





function IndexRows() {


    const { columns,fixedSize , dataTag , updateColSize }  = useContext(Context)!;

    const mouseDownHandler
        = (e: React.MouseEvent<HTMLDivElement> , index :number ) => {

        const node = e.target as HTMLElement;
        const parent
            = node.closest(`[data-type=${dataTag.sheet}]`) as HTMLElement | null;
        if (!parent) return
        const parentHeight = parent.offsetHeight

        node.classList.add(styles.onResize);
        node.style.height = parentHeight + "px";
        const startX = e.clientX;
        const newSize =  { num : 0 }

        const mouseMoveHandler = (e: MouseEvent) => {
            const gap = e.clientX - startX
            node.style.right = gap*-1 + "px";
            newSize.num = gap
        };
        const mouseUpHandler = () => {
            const currentWidth =  pxToNumber(columns[index].width)
            const newWidth = currentWidth + newSize.num  < 20 ? 20 :  currentWidth + newSize.num
            node.classList.remove(styles.onResize);
            Object.assign(node.style, {
                right: ``,
                height: ``,
            });
            updateColSize( {index , newSize : newWidth } )
            //
            window.removeEventListener("mousemove", mouseMoveHandler);
            window.removeEventListener("mouseup", mouseUpHandler);
        };
        window.addEventListener("mousemove", mouseMoveHandler);
        window.addEventListener("mouseup", mouseUpHandler);
    };



    const UI = columns.map( (column ,index )=>{
        return <li
            className={styles.column}
            key={index}
            style={ {width : column.width } }
            data-type = {dataTag.indexCol}
            data-column = { index }
        >
            {index+1}
            <div

                onMouseDown={(e)=> { mouseDownHandler(e ,index) }}
                className={styles.resizeBorder}
                data-type = {dataTag.resizeIndexCol}
            />
        </li>
    } )

    return (
        <ul
            className={styles.columnsContainer}
            style={ {height : fixedSize.indexColHeight } }
        >
            {UI}
        </ul>
    )
}

export default IndexRows;