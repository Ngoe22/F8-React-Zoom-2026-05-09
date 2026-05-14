import {useContext} from "react";
import { Context } from "../../../../contexts/Table";
import styles from "./styles.module.css";

function IndexRows() {

    const { rows ,fixedSize ,dataTag }  = useContext(Context)!;

    const UI = rows.map( (row ,index )=>
         <li
            className={styles.row}  key={index+1}
            style={{height : row.height } }
            data-type = {dataTag.indexRow}
        >
            {index+1}
            <div
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