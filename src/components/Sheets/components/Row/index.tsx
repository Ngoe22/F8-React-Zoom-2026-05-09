import {useContext} from "react";
import { Context } from "../../../../contexts/Table";
import styles from "./styles.module.css"
// import Cell from "../Cell";

interface RowProps {
    rowIndex: number;
}

function Row({ rowIndex } : RowProps ) {

    const { rows ,columns , dataTag }  = useContext(Context)!;


    const row = rows[rowIndex]
    const UI = columns.map( (column,index)  =>
         <div
             key={index}
             style={ {height : row.height ,width : column.width } }
                 className={styles.cell}
                 data-type = { dataTag.cell}
                 data-row = { rowIndex }
                 data-column = { index }
             >
                 { row[column.name] }
         </div>
    )

    return (
        <div className={styles.row} >
            {UI}
        </div>
    )
}

export default Row;