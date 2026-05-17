import {useContext} from "react";
import { Context } from "../../../../contexts/Table";

import styles from "./styles.module.css"

function IndexRows() {


    const { columns,fixedSize , dataTag , updateColSize }  = useContext(Context)!;


    const mouseDownHandler = (e ) => {
        console.log(e.target) ;
        e.target.classList.add(styles.onResize);
        const sheetHeight =
            e.target.closest(`[data-type="${dataTag.sheet}"]`).offsetHeight
        e.target.style.height = `${sheetHeight}px`;
    }

    const mouseUpHandler = () => {


        e.target.style.height = "";
    }



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

                onMouseDown={mouseDownHandler}
                onMouseUp={mouseUpHandler}

                data-column = { index }
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