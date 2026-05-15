import {useContext, useRef, useState , useMemo} from "react";
import {Context} from "../../contexts/Table";
import IndexColumns from "./components/IndexColumns";
import IndexRows from "./components/IndexRows";
import Body from "./components/Body";
import HighlightCell from "./components/HighlightCell";
import HighlightRange from "./components/HightlightRange";
import InputCell from "./components/InputCell";
import type {CoordinateType} from "../../types"
import {getRowAndColOfNode,getNodeAndType ,getNodeType} from "../../utils/functions"

import styles from "./styles.module.css"



function Sheets() {

    const {  columns , rows ,  fixedSize , dataTag } = useContext(Context)!;

    const tableSize = useMemo( ()=>{
        return {col : columns.length-1 , row : rows.length-1 }
    } , [columns, rows]);

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
            case  dataTag.cell : {
                isSelecting.current = true
                if (setSelectingCell) setSelectingCell(null)
                if ( focusCell === null ) {
                    setFocusCell(node);
                }
                else if ( node !== focusCell ) {
                    setIsInput(false) ;
                    setFocusCell(node);
                }
                break
            }
            case dataTag.header :{
                isSelecting.current = true
                if (setSelectingCell) setSelectingCell(null)
                setIsInput(false)
                setFocusCell(node);
                break
            }
        }
    };

    const mouseEnterHandle = (e : React.MouseEvent) => {
            if ( isSelecting.current ) {
                const [ node ,type ] = getNodeAndType(e)
                switch (type) {
                    case dataTag.cell : {
                        setSelectingCell(node)
                        break;
                    }
                    case dataTag.header : {

                        setSelectingCell(node)
                        break;
                    }
                }
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

    const focusCellMoveByIndex = ( {col  , row } : CoordinateType  ) => {
        const toCell = document.querySelector(
            `[data-cellcolumn="${col}"][data-cellrow="${row}"]`
        ) as HTMLElement;
        setFocusCell(toCell)
    }

    const focusCellMoveByEnter = () => {
        if (!focusCell ) return ;
        const [ row ,col ] = getRowAndColOfNode(focusCell);

        if ( col === tableSize.col ) {
            if ( row < tableSize.row ) {
                focusCellMoveByIndex({ col:0 , row :row+1 })
            }
        } else {
            focusCellMoveByArrow(`ArrowRight`)
        }
    }

    const focusCellMoveByArrow = (direction:string) => {
        if (!focusCell) return
        const [ row ,col ] = getRowAndColOfNode(focusCell);

        switch (direction) {
            case "ArrowRight": {
                if ( col === tableSize.col ) return ;
                focusCellMoveByIndex({ col:col+1 , row })
                break;
            }
            case "ArrowLeft" : {
                if ( col === 0 ) return
                focusCellMoveByIndex({ col:col-1 , row })
                break;
            }
            case "ArrowUp" : {
                if ( row === 0 ) return
                focusCellMoveByIndex({ col , row:row-1 })
                break;
            }
            case "ArrowDown" : {
                if ( row === tableSize.row ) return
                focusCellMoveByIndex({ col , row:row+1 })
                break;
            }
        }
    }

    const keyDownHandle = (e : React.KeyboardEvent) => {
        const key = e.key ;

        if ( key === "Enter" ) {
            e.preventDefault();
            if ( isInput ) {
                focusCellMoveByEnter()
            } else if ( focusCell  ) {
                if ( getNodeType(focusCell) === dataTag.header ) return
                setIsInput(true)
            }
        } else if ( [`ArrowRight` , `ArrowLeft` , `ArrowDown` , `ArrowUp` ].includes(key) ) {
             focusCellMoveByArrow(key)
        }
    }



    const copyHandle = () => {
        console.log("copy");

        if (!focusCell || !selectingCell ) return

        // start col - end col
        // start row ( header = get header + start row = 0  ) - end row
        // if start == header => get start row ,

        // const withHeader = getNodeType(focusCell) === dataTag.header;

            // const [ startRow , endRow ] = getRowAndColOfNode(focusCell);
        //
        // const [ rowF , colF ] = getRowAndColOfNode(focusCell);
        // const [ rowS , colF ] = getRowAndColOfNode(focusCell);

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
                onCopy={copyHandle}
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


