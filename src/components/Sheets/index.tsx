import {useContext, useRef, useReducer, useMemo} from "react";
import {Context} from "../../contexts/Table";
import IndexColumns from "./components/IndexColumns";
import IndexRows from "./components/IndexRows";
import Body from "./components/Body";
import HighlightCell from "./components/HighlightCell";
import HighlightRange from "./components/HightlightRange";
import InputCell from "./components/InputCell";
import {getNodeInfo, isOneOfTypes, } from "../../utils/functions"

import type {CellNodeType } from "../../types"
import styles from "./styles.module.css"


// =======================================================================================

interface StateProps {
    focusCell:  CellNodeType | null ,
    lastSelectedCell :  CellNodeType | null ,
    isResizing : boolean ,
    isInput : boolean   ,
}
interface DispatchProps {
    object ?: {
        focusCell ?: CellNodeType  ;
        lastSelectedCell ?:  CellNodeType  ;
    }
    type : string ;
    action : string ;
    sheetEl ?: HTMLDivElement ;
    callback ?: ()=> void
}

function reducer(state : StateProps, param : DispatchProps ) {

    if (param.callback ) param.callback() // addEventListener

    switch (param.action) {
        case  "resetAndSetRange" : {
            return {
                ...state ,
                lastSelectedCell : null,
                isInput : false,
                ...param.object
            }
        }
        case "setRange" : {
            return {
                ...state ,
                ...param.object
            }
        }
        case "inputOn" : {
            return {  ...state , isInput : true  , lastSelectedCell : null, }
        }
        default:
            return state;
    }
}


function Sheets() {

    const {  columns , rows ,  fixedSize , dataTag   } = useContext(Context)!;
    const sheetRef = useRef<HTMLDivElement | null>(null);
    const tableSize = useMemo(
        () => ({
            col: columns.length -1,
            row: rows.length -1
        }),
        [columns, rows]
    );

    const [state, dispatch] = useReducer( reducer, {
        focusCell:  null ,
        lastSelectedCell : null ,
        isResizing : false ,
        isInput : false   ,
    });

    const reducerInfo = useRef(
        {
            [dataTag.header] : {
                // moseDownAction : `focusAndActiveSelecting` ,
                shareWith : [ dataTag.cell , dataTag.header ] ,
                getMouseDownDispatchParam : (mouseDownInfo :CellNodeType) => {
                    return {
                        type : dataTag.header ,
                        action : `resetAndSetRange` ,
                        object:  {
                            focusCell : mouseDownInfo ,
                        }
                    }
                } ,
                mouseEnterCallback : (mouseEnterInfo :CellNodeType) => {
                    dispatch( {
                        type: `${mouseEnterInfo.type}`,
                        action: `setRange`,
                        object: {
                            lastSelectedCell: mouseEnterInfo,
                        }
                    } )
                } ,
            } ,

            [dataTag.cell] : {
               shareWith : [ dataTag.cell , dataTag.header ] ,
                getMouseDownDispatchParam : (mouseDownInfo :CellNodeType) => {
                   return {
                       type : dataTag.cell ,
                       action : `resetAndSetRange` ,
                       object: {
                           focusCell : mouseDownInfo ,
                       }
                    }
                } ,
                mouseEnterCallback : (mouseEnterInfo :CellNodeType) => {
                   dispatch( {
                       type : `${mouseEnterInfo.type}` ,
                       action : `setRange` ,
                       object : {
                           lastSelectedCell : mouseEnterInfo ,
                       }
                   } )
               } ,
           } ,

            // ==========================================================
            [dataTag.indexCol] : {
                shareWith : [  dataTag.indexCol ] ,
                getMouseDownDispatchParam : (mouseDownInfo :CellNodeType) => {
                    return {
                        type : dataTag.header ,
                        action : `resetAndSetRange` ,
                        object : {
                            focusCell :  { ...mouseDownInfo ,type : dataTag.header } ,
                            lastSelectedCell : { ...mouseDownInfo ,  row : tableSize.row ,  type : dataTag.cell }
                        }  ,
                    }
                } ,
                mouseEnterCallback : (mouseEnterInfo :CellNodeType) => {

                    dispatch( {
                        type : `${dataTag.cell}` ,
                        action : `setRange` ,
                        object : {
                            lastSelectedCell : { ...mouseEnterInfo , type : dataTag.cell , row : tableSize.row }  ,
                        }
                    } )
                } ,
            }
        }
    )

    const mouseDownHandle = (e : React.MouseEvent) => {

        const moseDownInfo = getNodeInfo(e.target as HTMLElement) ;
        if ( ![ dataTag.cell , dataTag.header , dataTag.indexCol ,  dataTag.indexRow ].includes(moseDownInfo.type) ) return

        const dispatchParam
            = reducerInfo.current[moseDownInfo.type]?.getMouseDownDispatchParam?.(moseDownInfo) ;
        if (!dispatchParam) return

        dispatch(
            {
                ...dispatchParam,
                    callback : ()=> {
                        if (!sheetRef.current) return

                        const  mouseEnterHandle  =  (e : MouseEvent) => {
                            const mouseEnterInfo = getNodeInfo(e.target as HTMLElement) ;
                            if ( !mouseEnterInfo.type || !isOneOfTypes( reducerInfo.current[moseDownInfo.type].shareWith ,  [mouseEnterInfo.type] ) ) return // check is enter type allow
                            reducerInfo.current[mouseEnterInfo.type]?.mouseEnterCallback?.(mouseEnterInfo)
                        }
                        // ========================= Clean up =========================
                        const mouseUpHandle = () => {
                            if (!sheetRef.current) return
                            sheetRef.current.removeEventListener("mouseover", mouseEnterHandle);
                            sheetRef.current.removeEventListener("mouseup", mouseUpHandle);
                        }
                        sheetRef.current.addEventListener("mouseover", mouseEnterHandle);
                        sheetRef.current.addEventListener("mouseup", mouseUpHandle);
                }
            }
        )
    }

    const mouseDoubleClickHandle = (e: React.MouseEvent)=> {
        const info = getNodeInfo(e.target as HTMLDivElement) ;
        if ( info.type === dataTag.cell )  dispatch(
            { type : `${info.type}` , action : `inputOn`}
        )
    }

    const copyHandle = (  ) => {

        if (!state.focusCell ) return
        if ( !state.lastSelectedCell) {
            if ( isOneOfTypes ( [dataTag.cell , dataTag.header] ,  [state.focusCell.type]  )  ) {
                const copyText = rows[ state.focusCell.row ][ columns[state.focusCell.col].name ] ;
                navigator.clipboard.writeText(copyText);
            }
            return
        }

        // eslint-disable-next-line prefer-const
        let [ minRow , maxRow ] = [
            Math.min( state.focusCell.row , state.lastSelectedCell.row ) ,
            Math.max( state.focusCell.row , state.lastSelectedCell.row )  ] ;
        const [ minCol , maxCol ] = [
            Math.min( state.focusCell.col , state.lastSelectedCell.col ),
            Math.max( state.focusCell.col , state.lastSelectedCell.col )
        ] ;

        let headerText = ``
        if (minRow === -1) {
            minRow = 0
            for ( let i = minCol ; i <= maxCol ; i++  ) {
                headerText += columns[i].name
                if (i < maxCol) {
                    headerText += "\t";
                } else {
                    headerText += "\n";
                }
            }
        }

        let output = "" ;
        for ( let i = minRow ; i <= maxRow ; i ++ ) {
            const row = rows[i]
            for ( let j = minCol ; j <= maxCol ; j ++ ) {
                output += `${row[ columns[j].name ]}` ;
                if (j < maxCol) output += "\t";
            }
            if (i < maxRow) output += "\n";
        }
        navigator.clipboard.writeText(headerText + output);
        alert("Copied!");
}

    const focusCellMoveByArrow = (direction:string ) => {
    if (!state.focusCell) return

    const {row ,col} = state.focusCell;
    let finalFocusCell = { row : -1, col : -1 };

    switch (direction) {
        case "ArrowRight": {
            if ( col === tableSize.col ) return ;
            finalFocusCell = { col:col+1 , row   }
            break;
        }
        case "ArrowLeft" : {
            if ( col === 0 ) return
            finalFocusCell = { col:col-1 , row    }
            break;
        }
        case "ArrowUp" : {
            if ( row === 0 ) return
            finalFocusCell = { col , row:row-1   }
            break;
        }
        case "ArrowDown" : {
            if ( row === tableSize.row ) return
            finalFocusCell = {  col , row:row+1   }
            break;
        }
    }
    dispatch(
        {
            type : dataTag.cell , action : "setRange" ,
            object :
                {   focusCell:   { ...finalFocusCell ,type : dataTag.cell }}
        }
    )
}

    const keyDownHandle = (e : React.KeyboardEvent) => {
        const key = e.key ;
        if ( key === "Enter" ) {
            e.preventDefault();
            if ( state.isInput ) {
                if (!state.focusCell) return

                const {row ,col} = state.focusCell;
                if ( col === tableSize.col &&  row < tableSize.row ) {
                    dispatch(
                        {
                            type : dataTag.cell ,
                            action : "setRange" ,
                            object : {
                                focusCell:  { col:0 , row : row+1 , type : dataTag.cell  }
                            }
                        }
                    )
                } else {
                    focusCellMoveByArrow(`ArrowRight`)
                }
            } else  {
                dispatch({ type : dataTag.cell , action : "inputOn" })
            }
        } else if ( [`ArrowRight` , `ArrowLeft` , `ArrowDown` , `ArrowUp` ].includes(key) ) {
            if ( state.isInput ) return
             focusCellMoveByArrow(key)
        } else if ( key.length === 1 ) {
            if ( e.ctrlKey || e.metaKey || e.altKey) return;
            dispatch({ type : dataTag.cell , action : "inputOn" })
        }
    }

//
    return (
        <>
            <div>Copy | Range | Resize | Input | Typing </div>
            <hr/>
            <div
                tabIndex={0}
                ref={sheetRef}
                className={styles.sheets}
                data-type = {dataTag.sheet}
                onDoubleClick={mouseDoubleClickHandle}
                onMouseDown={mouseDownHandle}
                onKeyDown={keyDownHandle}
                onCopy={copyHandle}
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
                <HighlightCell node =  {state.focusCell} />
                <HighlightRange startNode={state.focusCell}  endNode={state.lastSelectedCell}  />
                <InputCell node =  { state.isInput ? state.focusCell : null } />
            </div>
        </>
    )
}
export default Sheets;

