import {useContext} from "react";
import { Context } from "../../../../contexts/Table";

import Header from "../Header";
import Row from "../Row"

import styles from "./styles.module.css"

function Body() {

    const { rows }  = useContext(Context)!;
    const rowsUI = rows.map( (_, index)=> {
        return  <Row  rowIndex ={index} key={index}  />
    } )

    return (
        <div className={styles.table} >
            <Header></Header>

                {rowsUI}

        </div>
    )
}

export default Body;