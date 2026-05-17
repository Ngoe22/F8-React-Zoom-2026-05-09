import {useContext, useRef, useState , useMemo} from "react";
import {Context} from "../../contexts/Table";
import IndexColumns from "./components/IndexColumns";
import IndexRows from "./components/IndexRows";
import Body from "./components/Body";
import HighlightCell from "./components/HighlightCell";
import HighlightRange from "./components/HightlightRange";
import InputCell from "./components/InputCell";
import type {CoordinateType} from "../../types"
import {getRowAndCol,getNodeAndType ,getNodeType , getCellByCoordinate} from "../../utils/functions"

import styles from "./styles.module.css"



function Sheets() {
    // updateRowSize
    const {  columns , rows ,  fixedSize , dataTag ,updateRowSize  } = useContext(Context)!;

    const tableSize = useMemo( ()=>{
        return {col : columns.length-1 , row : rows.length-1 }
    } , [columns, rows]);

    //
    const [focusCell, setFocusCell] = useState<HTMLElement | null>(null);
    const [selectingCell, setSelectingCell] = useState<HTMLElement | null>(null);
    const [isInput, setIsInput] = useState<boolean>(false);

    const isResizing = useRef<boolean>(false);
    const isSelecting = useRef(false);
    const resizeCell = useRef<HTMLElement | null>(null);

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
            case dataTag.indexRow : {

                const index = node.getAttribute(`data-indexrow`)
                const selectedCell = document.querySelector(
                    `[data-cellcolumn="${tableSize.col}"][data-cellrow="${index}"][data-type="${dataTag.cell}"]`
                )
                if (!selectedCell) return
                setFocusCell(node);
                setSelectingCell(selectedCell as HTMLElement)
                break
            }
            case dataTag.indexCol : {



                const index = node.getAttribute(`data-col`)
                const selectedCell = document.querySelector(
                    `[data-cellcolumn="${index}"][data-cellrow="${tableSize.row}"][data-type="${dataTag.cell}"]`
                )
                if (!selectedCell) return
                setFocusCell(node);
                setSelectingCell(selectedCell as HTMLElement)
                break
            }
            case dataTag.resizeIndexRow :{
                isResizing.current = true
                resizeCell.current = node ;

            }
        }
    };

    const mouseEnterHandle = (e : React.MouseEvent) => {

        const [ node ,type ] = getNodeAndType(e)

        if ( isSelecting.current ) {
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

        if ( isResizing.current ) {
            switch (type) {
                case dataTag.indexRow : {
                //
                }
            }
        }

    };

    const mouseUpHandle = () => {
        if ( isSelecting.current ) isSelecting.current = false


        if (isResizing.current && resizeCell.current ) {
            isResizing.current = false
            // const node = getCellByCoordinate( {} )


            // const type = getNodeType(resizeCell.current as HTMLElement )

            console.log(resizeCell.current)

            const node = resizeCell.current.parentElement

            if ( !node ) return;

            const [ index ,  ] = getRowAndCol(node)
            const dis = resizeRowFromTop - node.offsetTop ;


            if ( dis < 10 ) {
                updateRowSize({ rowIndex : index , height : 10  } )
            } else {
                const newHeight = Math.floor(dis)
                updateRowSize({ rowIndex : index , height : newHeight  } )
            }

            setResizeRowFromTop(0)
            resizeCell.current = null
        }
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
        const toCell = getCellByCoordinate( { col , row , type : dataTag.cell }  );
        setFocusCell(toCell)
    }

    const focusCellOnEnter = () => {
        if (!focusCell ) return ;
        const [ row ,col ] = getRowAndCol(focusCell);

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
        const [ row ,col ] = getRowAndCol(focusCell);

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
                focusCellOnEnter()
            } else if ( focusCell  ) {
                if ( getNodeType(focusCell) === dataTag.header ) return
                setIsInput(true)
            }
        } else if ( [`ArrowRight` , `ArrowLeft` , `ArrowDown` , `ArrowUp` ].includes(key) ) {
            if ( isInput ) return
             focusCellMoveByArrow(key)
        }
    }

    const copyHandle = () => {
        console.log("copy");

        if (!focusCell ) return

        if (  !selectingCell ) {
            navigator.clipboard.writeText(focusCell.innerText);
            return
        }
        //
        const [ rowF , colF ] = getRowAndCol(focusCell);
        const [ rowS , colS ] = getRowAndCol(selectingCell);

        const [ minRow , maxRow ] = [  Math.min( rowF , rowS ) ,  Math.max( rowF , rowS )  ] ;
        const [ minCol , maxCol ] = [  Math.min( colF , colS ) ,  Math.max( colF , colS )  ] ;

        let output = "" ;
        for ( let i = minRow ; i <= maxRow ; i ++ ) {
            const row = rows[i]
            for ( let j = minCol ; j <= maxCol ; j ++ ) {
                output += `${row[ columns[j].name ]}` ;
                if (j < maxCol) output += "\t";
            }
            if (i < maxRow) output += "\n";
        }
        navigator.clipboard.writeText(output);
    }

    // ====================================================

    const [ resizeRowFromTop , setResizeRowFromTop ] = useState( 0 ) ;
    // const [ resizeRowFromLeft , setResizeRowFromLeft ] = useState( 0 ) ;

    const  mouseMoveHandle = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isResizing.current) return

        const parent = e.currentTarget.getBoundingClientRect();

        // const x = e.clientX - parent.left;
        const y = e.clientY - parent.top;
        setResizeRowFromTop(y)
    }

    return (
        <>
            <div>Meow</div>
            <hr/>
            <div
                // style={{cursor: "grabbing"}}

                tabIndex={0}
                ref={sheetRef}
                className={styles.sheets}

                onKeyDown={keyDownHandle}
                onCopy={copyHandle}
                onDoubleClick={mouseDoubleClick}
                onMouseDown={mouseDownHandle}
                onMouseOver = {mouseEnterHandle}
                onMouseUp={mouseUpHandle}

                onMouseMove = {mouseMoveHandle}
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


                { resizeRowFromTop  ?
                    <div style={
                        {
                            width: "100%" ,
                            height:"4px",
                            left : "0" ,
                            top: `${resizeRowFromTop}px` ,
                            background :"black" ,
                            position : "absolute",

                        }}
                    /> : null
                }


            </div>

        </>
    )
}
export default Sheets;


