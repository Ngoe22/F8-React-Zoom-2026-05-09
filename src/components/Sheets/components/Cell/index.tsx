import {useContext} from "react";
import { Context } from "../../../../contexts/Table";

function Cell() {

    const context = useContext(Context);
    console.log(context)

    return (
        <h1>Cell</h1>
    )
}

export default Cell;