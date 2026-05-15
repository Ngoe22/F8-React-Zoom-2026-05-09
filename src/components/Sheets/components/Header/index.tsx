import {useContext} from "react";
import { Context } from "../../../../contexts/Table";
import styles from "./styles.module.css"

function Header() {

    const { columns ,fixedSize , dataTag }  = useContext(Context)!;
    const UI = columns.map( (column ,index)=> {
        return <td
            key={index}
            style={{width : column.width , height: fixedSize.headerHeight}  }
        >
            <div
                data-cellrow = { 0 }
                data-cellcolumn = { index }
                className={styles.cell}
                data-type = { dataTag.header}
            >
                {column.name}
            </div>

        </td>
    })


    return (
        <thead>
            <tr >
                {UI}
            </tr>
        </thead>
    )
}

export default Header;