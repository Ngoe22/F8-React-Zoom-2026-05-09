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
         <td
             key={index}
             style={ {height : row.height } }
             className={styles.box}
         >
             <div
                 className={styles.cell}
                 data-type = { dataTag.cell}
                 data-row = { rowIndex }
                 data-column = { index }
             >
                 { row[column.name] }
             </div>
         </td>
    )

    return (
        <tr  >
            {UI}
        </tr>
    )
}

export default Row;