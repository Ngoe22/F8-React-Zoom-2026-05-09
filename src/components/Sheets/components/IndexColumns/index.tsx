import {useContext} from "react";
import { Context } from "../../../../contexts/Table";

import styles from "./styles.module.css"

function IndexRows() {

    const { columns,fixedSize , dataTag }  = useContext(Context)!;

    const UI = columns.map( (column ,index )=>{
        return <li
            className={styles.column}
            key={index}
            style={ {width : column.width } }
            data-type = {dataTag.indexCol}
        >

            {index+1}
            <div
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