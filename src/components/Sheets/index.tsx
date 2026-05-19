import {useContext, useRef, useReducer, useMemo} from "react";
import {Context} from "../../contexts/Table";
import IndexColumns from "./components/IndexColumns";
import IndexRows from "./components/IndexRows";
import Body from "./components/Body";
import HighlightCell from "./components/HighlightCell";
import HighlightRange from "./components/HightlightRange";
import InputCell from "./components/InputCell";
import {getNodeInfo, isOneOfTypes } from "../../utils/functions"

import type {CellNodeType } from "../../types"
import styles from "./styles.module.css"






interface StateProps {
    focusCell:  CellNodeType | null ,
    lastSelectedCell :  CellNodeType | null ,
    isSelecting : boolean ,
    isResizing : boolean ,
    isInput : boolean   ,
}
interface DispatchProps {
    type : string ;
    action : string ;
    cellNode ?: CellNodeType  ;
    sheetEl ?: HTMLDivElement ;
    callback ?: ()=> void
}


function reducer(state : StateProps, param : DispatchProps ) {

    switch (param.type) {
        case "cell":
        case "header": {
            switch (param.action) {
                case "focusAndActiveSelecting" : {
                    if (param.callback ) param.callback() // addEventListener
                    return {
                        ...state ,
                        focusCell : param.cellNode! ,
                        isSelecting : true ,
                        lastSelectedCell : null,
                        isInput : false
                    }
                }
                case "updateSelectingNode" : {
                    return {  ...state , lastSelectedCell : param.cellNode! }
                }
                case "executeSelecting" : {
                    if (param.callback )param.callback() // removeEventListener
                    return {  ...state , isSelecting : false  }
                }
                case "doubleClick" : {
                    return {  ...state , isInput : true  }
                }
                case "updateFocusIndex" : {
                    return {  ...state , focusCell : param.cellNode! ,  }
                }
                default:
                    return state;
            }
        }
        case "indexCol": {
            switch (param.action) {
                case "activeSelecting" : {
                    return state;
                }
                case "updateSelectingNode" : {
                    return state;
                }
                case "executeSelecting" : {
                    return state;
                }
                default:
                    return state;
            }
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
        isSelecting : false ,
        isResizing : false ,
        isInput : false   ,
    });

    const reducerInfo = useRef(
        {
               [dataTag.cell] : {
                   moseDownAction : `focusAndActiveSelecting` ,
                   moseEnterAction : `updateSelectingNode` ,
                   shareWith : [ dataTag.cell , dataTag.header ] ,
               } ,
               [dataTag.header] : {
                    moseDownAction : `focusAndActiveSelecting` ,
                    moseEnterAction : `updateSelectingNode` ,
                    shareWith : [  dataTag.cell , dataTag.header ] ,
               } ,
                [dataTag.indexCol] : {
                moseDownAction : `activeSelecting` ,
                moseEnterAction : `updateSelectingNode` ,
                shareWith : [  dataTag.indexCol ] ,
                }
        }
    )

    const mouseDownHandle = (e : React.MouseEvent) => {
        const moseDownInfo = getNodeInfo(e.target as HTMLElement) ;

        if ( ![ dataTag.cell , dataTag.header , dataTag.indexCol ,  dataTag.indexRow ].includes(moseDownInfo.type) ) return

        dispatch(
                {
                    // type : `${moseDownInfo.type}` , action : `focusAndActiveSelecting` , nodeRef : moseDownInfo.ref ,
                    type : `${moseDownInfo.type}` ,
                    action : reducerInfo.current[moseDownInfo.type].moseDownAction ,
                    cellNode : moseDownInfo ,
                    callback : ()=> {

                        if (!sheetRef.current) return


                        const  mouseEnterHandle  =  (e : MouseEvent) => {

                            const mouseEnterInfo = getNodeInfo(e.target as HTMLElement) ;

                            if ( !isOneOfTypes( reducerInfo.current[mouseEnterInfo.type].shareWith ,  [mouseEnterInfo.type] ) ) return
                            dispatch( {
                                type : `${mouseEnterInfo.type}` ,
                                action : reducerInfo.current[moseDownInfo.type].moseEnterAction ,
                                cellNode : mouseEnterInfo ,
                            } )
                        }

                        //
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
        switch (info.type) {
            case dataTag.cell : {
                dispatch({type : `${info.type}` , action : `doubleClick` } )
                break
            }
        }
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
    switch (direction) {
        case "ArrowRight": {
            if ( col === tableSize.col ) return ;
            dispatch(
                { type : dataTag.cell , action : "updateFocusIndex" ,  cellNode:  { col:col+1 , row , type : dataTag.cell  }}
            )
            break;
        }
        case "ArrowLeft" : {
            if ( col === 0 ) return
            dispatch(
                { type : dataTag.cell , action : "updateFocusIndex" ,  cellNode:  { col:col-1 , row  , type : dataTag.cell  }}
            )
            break;

        }
        case "ArrowUp" : {
            if ( row === 0 ) return
            // focusCellMoveByIndex({ col , row:row-1 })
            dispatch(
                { type : dataTag.cell , action : "updateFocusIndex" ,  cellNode:  { col , row:row-1 , type : dataTag.cell  }}
            )
            break;
        }
        case "ArrowDown" : {
            if ( row === tableSize.row ) return
            // focusCellMoveByIndex({ col , row:row+1 })
            dispatch(
                { type : dataTag.cell , action : "updateFocusIndex" ,  cellNode:  {  col , row:row+1 , type : dataTag.cell  }}
            )
            break;

        }
    }
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
                        { type : dataTag.cell , action : "updateFocusIndex" ,  cellNode:  { col:0 , row : row+1 , type : dataTag.cell  }}
                    )
                } else {
                    focusCellMoveByArrow(`ArrowRight`)
                }
            } else  {
                dispatch({ type : dataTag.cell , action : "doubleClick" })
            }
        } else if ( [`ArrowRight` , `ArrowLeft` , `ArrowDown` , `ArrowUp` ].includes(key) ) {
            if ( state.isInput ) return
             focusCellMoveByArrow(key)
        } else if ( key.length === 1 ) {

            const isShortcut =
                e.ctrlKey ||
                e.metaKey ||
                e.altKey;
            if (isShortcut) return;

            dispatch({ type : dataTag.cell , action : "doubleClick" })
        }
    }


    return (
        <>
            <div>Copy | Range | Resize | Input</div>
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

