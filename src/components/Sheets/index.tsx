import {useContext, useRef, useState} from "react";
import {Context} from "../../contexts/Table";

import IndexColumns from "./components/IndexColumns";
import IndexRows from "./components/IndexRows";
import Body from "./components/Body";
import HighlightCell from "./components/HighlightCell";
import HighlightRange from "./components/HightlightRange";
import InputCell from "./components/InputCell";

import styles from "./styles.module.css"






function Sheets() {

    const {  columns , rows ,  fixedSize , dataTag } = useContext(Context)!;

    //
    const [focusCell, setFocusCell] = useState<HTMLElement | null>(null);
    const [selectingCell, setSelectingCell] = useState<HTMLElement | null>(null);

    const [isInput, setIsInput] = useState<boolean>(false);
    const isSelecting = useRef(false);

    //
    const sheetRef = useRef<HTMLDivElement | null>(null);

    // onEvent
    const mouseDownHandle = (e : React.MouseEvent) => {
        const [ node ,type ] = getNodeAndType(e)

        switch (type) {
            case  dataTag.input : {
                return
            }
            case  dataTag.cell : {
                isSelecting.current = true
                if (setSelectingCell) setSelectingCell(null)

                if ( focusCell === null ) {

                    console.log(`null`)
                    setFocusCell(node);
                }
                else if ( node !== focusCell ) {
                    setIsInput(false) ;
                    setFocusCell(node);
                }
            }
        }
    };

    const mouseEnterHandle = (e : React.MouseEvent) => {
            if ( isSelecting.current ) {
                const [ node ,type ] = getNodeAndType(e)
                if ( type === dataTag.cell ) setSelectingCell(node)
            }
    };

    const mouseUpHandle = () => {
            if ( isSelecting.current ) isSelecting.current = false
        };

    const mouseDoubleClick = (e : React.MouseEvent) => {

        const [ ,type ] = getNodeAndType(e)
        switch (type) {
            case dataTag.cell:
                setIsInput(true)
                break;
        }
    }






    const focusCellMoveByArrow = (direction:string) => {

        if (!focusCell) return
        let col = Number(focusCell.getAttribute("data-cellcolumn"));
        let row = Number(focusCell.getAttribute("data-cellrow"));
        const maxCol = columns.length-1 ;
        const maxRow = rows.length-1 ;

        switch (direction) {
            case "ArrowRight": {
                if ( col === maxCol ) return
                col += 1
                break;
            }
            case "ArrowLeft" : {
                if ( col === 0 ) return
                col -= 1
                break;
            }
            case "ArrowUp" : {
                if ( row === 0 ) return
                row -= 1
                break;
            }
            case "ArrowDown" : {
                if ( row === maxRow ) return
                row += 1
                break;
            }
        }
        const toCell = document.querySelector(
            `[data-cellcolumn="${col}"][data-cellrow="${row}"]`
        ) as HTMLElement;
        setFocusCell(toCell)
    }



    const keyDownHandle = (e : React.KeyboardEvent) => {
        const key = e.key ;

        if ( key === "Enter" ) {
            e.preventDefault();

            if ( isInput ) {
                // move right

            } else if ( focusCell  ) {
                setIsInput(true)
            }
        } else if ( [`ArrowRight` , `ArrowLeft` , `ArrowDown` , `ArrowUp` ].includes(key) ) {
             focusCellMoveByArrow(key)
        }
    }

    // ====================================================

    return (
        <>
            <div>Meow</div>
            <hr/>
            <div
                tabIndex={0}
                ref={sheetRef}
                className={styles.sheets}

                onKeyDown={keyDownHandle}

                onDoubleClick={mouseDoubleClick}
                onMouseDown={mouseDownHandle}
                onMouseOver = {mouseEnterHandle}
                onMouseUp={mouseUpHandle}
            >
                <div className={styles.right} >
                    <div
                        className={styles.sheetCorner}
                        style={{ height: fixedSize.indexColHeight , width: fixedSize.indexColWidth }}
                    />
                    <IndexRows/>
                </div>
                <div className={styles.left} >
                    <IndexColumns/>
                    <Body/>
                </div>
                <HighlightCell node =  {focusCell} />
                <HighlightRange startNode={focusCell}  endNode={selectingCell}  />
                <InputCell node =  { isInput ? focusCell : null } />
            </div>

        </>
    )
}
export default Sheets;


const getNodeAndType =
    (e: React.SyntheticEvent) : [HTMLElement, string | null] => {
    const target = e.target as HTMLElement;
    return [target, target.getAttribute("data-type")];
};