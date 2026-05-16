import {useContext} from "react";
import { Context } from "../../../../contexts/Table";
import styles from "./styles.module.css"

function Header() {

    const { columns ,fixedSize , dataTag }  = useContext(Context)!;
    const UI = columns.map( (column ,index)=> {
        return <div
            key={index}
            style={{width : column.width }  }
            className={styles.cell}
            data-column = { index }
            data-type = { dataTag.header}
        >
                {column.name}
        </div>
    })


    return (

            <div
                style={{height: fixedSize.headerHeight}  }
                className={styles.row}
            >
                {UI}
            </div>

    )
}

export default Header;