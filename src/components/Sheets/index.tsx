import {useContext, useRef, useMemo, useReducer} from "react";
import {Context} from "../../contexts/Table";
import IndexColumns from "./components/IndexColumns";
import IndexRows from "./components/IndexRows";
import Body from "./components/Body";
import HighlightCell from "./components/HighlightCell";
import HighlightRange from "./components/HightlightRange";
import InputCell from "./components/InputCell";
import {getNodeInfo, isOneOfTypes} from "../../utils/functions"

import styles from "./styles.module.css"


function reducer(state, param ) {

    switch (param.type) {

        case "cell":
        case "header": {
            switch (param.action) {
                case "focusAndActiveSelecting" : {
                    param.callback() // addEventListener
                    return {
                        ...state ,
                        focusCell : param.nodeRef ,
                        isSelecting : true ,
                        lastSelectedCell : null,
                        isInput : false
                    }
                }
                case "updateSelectingNode" : {
                    return {  ...state , lastSelectedCell : param.nodeRef }
                }
                case "executeSelecting" : {
                    param.callback() // removeEventListener
                    return {  ...state , isSelecting : false  }
                }
                case "doubleClick" : {
                    return {  ...state , isInput : true  }
                }
            }
            break;
        }
        default:
            return state;
    }

}



interface NodeProps {
    ref : HTMLDivElement ,
    row : number ,
    col : number ,
    type : string ,
}


function Sheets() {

    const {  columns , rows ,  fixedSize , dataTag   } = useContext(Context)!;
    const sheetRef = useRef<HTMLDivElement | null>(null);
    const [state, dispatch] = useReducer(reducer, {
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
                   shareWith : [  dataTag.header ] ,
               } ,
               [dataTag.header] : {
                    moseDownAction : `focusAndActiveSelecting` ,
                    moseEnterAction : `updateSelectingNode` ,
                    shareWith : [  dataTag.cell ] ,
               }
        }
    )



    const mouseDownHandle = (e : React.MouseEvent) => {
        const moseDownInfo = getNodeInfo(e.target as HTMLDivElement) ;

        if ( ![ dataTag.cell , dataTag.header , dataTag.resizeIndexCol ,  dataTag.resizeIndexRow ].includes(moseDownInfo.type) ) return

            dispatch(
                {
                    // type : `${moseDownInfo.type}` , action : `focusAndActiveSelecting` , nodeRef : moseDownInfo.ref ,
                    type : `${moseDownInfo.type}` ,
                    action : reducerInfo.current[moseDownInfo.type].moseDownAction ,
                    nodeRef : moseDownInfo ,
                    callback : ()=> {

                        if (!sheetRef.current) return
                        const  mouseEnterHandle  =  (e : MouseEvent) => {

                            const mouseEnterInfo = getNodeInfo(e.target as HTMLDivElement) ;
                            if (!mouseEnterInfo  ) return

                            const acceptType
                                = [ ...reducerInfo.current[mouseEnterInfo.type].shareWith , mouseEnterInfo.type ]
                            if ( !isOneOfTypes( acceptType ,  [mouseEnterInfo.ref] ) ) return
                            dispatch( {
                                type : `${mouseEnterInfo.type}` ,
                                action : reducerInfo.current[moseDownInfo.type].moseEnterAction ,
                                nodeRef : mouseEnterInfo.ref ,
                            } )
                        }
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

    const copyHandle = ( node1 : HTMLElement ,node2 : HTMLElement ) => {

        if (!node1 ) return
        if ( !node2) {
            const info = getNodeInfo(node1);

            if ( isOneOfTypes ( [dataTag.cell , dataTag.header] ,  [info.ref]  )  )
                navigator.clipboard.writeText(info.ref.innerText);
            return
        }

        const nodeF = getNodeInfo(node1);
        const nodeS = getNodeInfo(node2);

        // eslint-disable-next-line prefer-const
        let [ minRow , maxRow ] = [  Math.min( nodeF.row , nodeS.row ) ,  Math.max( nodeF.row , nodeS.row )  ] ;
        const [ minCol , maxCol ] = [  Math.min( nodeF.col , nodeS.col ) ,  Math.max( nodeF.col , nodeS.col )  ] ;

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
}

    return (
        <>
            <div>Meow</div>
            <hr/>
            <div
                tabIndex={0}
                ref={sheetRef}
                className={styles.sheets}
                data-type = {dataTag.sheet}

                onDoubleClick={mouseDoubleClickHandle}
                onMouseDown={mouseDownHandle}
                onCopy={()=> { copyHandle(state.focusCell , state.lastSelectedCell) }}
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




// const copyHandle = () => {
//     console.log("copy");
//
//     if (!focusCell ) return
//
//     if (  !selectingCell ) {
//         navigator.clipboard.writeText(focusCell.innerText);
//         return
//     }
//     //
//     const [ rowF , colF ] = getRowAndCol(focusCell);
//     const [ rowS , colS ] = getRowAndCol(selectingCell);
//
//     const [ minRow , maxRow ] = [  Math.min( rowF , rowS ) ,  Math.max( rowF , rowS )  ] ;
//     const [ minCol , maxCol ] = [  Math.min( colF , colS ) ,  Math.max( colF , colS )  ] ;
//
//     let output = "" ;
//     for ( let i = minRow ; i <= maxRow ; i ++ ) {
//         const row = rows[i]
//         for ( let j = minCol ; j <= maxCol ; j ++ ) {
//             output += `${row[ columns[j].name ]}` ;
//             if (j < maxCol) output += "\t";
//         }
//         if (i < maxRow) output += "\n";
//     }
//     navigator.clipboard.writeText(output);
// }


//
//
//
// const tableSize = useMemo( ()=>{
//     return {col : columns.length-1 , row : rows.length-1 }
// } , [columns, rows]);
//
// //
// const [focusCell, setFocusCell] = useState<HTMLElement | null>(null);
// const [selectingCell, setSelectingCell] = useState<HTMLElement | null>(null);
// const [isInput, setIsInput] = useState<boolean>(false);
//
// const isResizing = useRef<boolean>(false);
// const isSelecting = useRef(false);
// const resizeCell = useRef<HTMLElement | null>(null);
//
// //
// const sheetRef = useRef<HTMLDivElement | null>(null);
//
// // onEvent
// const mouseDownHandle = (e : React.MouseEvent) => {
//     const [ node ,type ] = getNodeAndType(e)
//     switch (type) {
//         case  dataTag.cell : {
//             isSelecting.current = true
//             if (setSelectingCell) setSelectingCell(null)
//             if ( focusCell === null ) {
//                 setFocusCell(node);
//             }
//             else if ( node !== focusCell ) {
//                 setIsInput(false) ;
//                 setFocusCell(node);
//             }
//             break
//         }
//         case dataTag.header :{
//             isSelecting.current = true
//             if (setSelectingCell) setSelectingCell(null)
//             setIsInput(false)
//             setFocusCell(node);
//             break
//         }
//         case dataTag.indexRow : {
//
//             const index = node.getAttribute(`data-row`)
//             const selectedCell =
//                 getCellByCoordinate( {row : Number(index) , col : tableSize.col , type : dataTag.cell} )
//             if (!selectedCell) return
//             setFocusCell(node);
//             setSelectingCell(selectedCell as HTMLElement)
//             break
//         }
//         case dataTag.indexCol : {
//
//             // setSelectingCell(null)
//
//
//             const index = node.getAttribute(`data-col`)
//             const selectedCell =
//                 getCellByCoordinate( {col : Number(index) , row : tableSize.row , type : dataTag.cell} )
//             if (!selectedCell) return
//             setFocusCell(node);
//             setSelectingCell(selectedCell as HTMLElement)
//             break
//         }
//         case dataTag.resizeIndexRow :{
//             isResizing.current = true
//             resizeCell.current = node ;
//
//         }
//     }
// };
//
// const mouseEnterHandle = (e : React.MouseEvent) => {
//
//     const [ node ,type ] = getNodeAndType(e)
//
//     if ( isSelecting.current ) {
//         switch (type) {
//             case dataTag.cell : {
//                 setSelectingCell(node)
//                 break;
//             }
//             case dataTag.header : {
//                 setSelectingCell(node)
//                 break;
//             }
//         }
//     }
//
//     if ( isResizing.current ) {
//         switch (type) {
//             case dataTag.indexRow : {
//             //
//             }
//         }
//     }
//
// };
//
// const mouseUpHandle = () => {
//     if ( isSelecting.current ) isSelecting.current = false
//
//
//     if (isResizing.current && resizeCell.current ) {
//         isResizing.current = false
//
//
//         console.log(resizeCell.current)
//
//         const node = resizeCell.current.parentElement
//
//         if ( !node ) return;
//
//         const [ index ,  ] = getRowAndCol(node)
//         const dis = resizeRowFromTop - node.offsetTop ;
//
//
//         if ( dis < 10 ) {
//             updateRowSize({ rowIndex : index , height : 10  } )
//         } else {
//             const newHeight = Math.floor(dis)
//             updateRowSize({ rowIndex : index , height : newHeight  } )
//         }
//
//         setResizeRowFromTop(0)
//         resizeCell.current = null
//     }
// };
//
// const mouseDoubleClick = (e : React.MouseEvent) => {
//     const [ ,type ] = getNodeAndType(e)
//     switch (type) {
//         case dataTag.cell:
//             setIsInput(true)
//             break;
//     }
// }
//
// const focusCellMoveByIndex = ( {col  , row } : CoordinateType  ) => {
//     const toCell = getCellByCoordinate( { col , row , type : dataTag.cell }  );
//     setFocusCell(toCell)
// }
//
// const focusCellOnEnter = () => {
//     if (!focusCell ) return ;
//     const [ row ,col ] = getRowAndCol(focusCell);
//
//     if ( col === tableSize.col ) {
//         if ( row < tableSize.row ) {
//             focusCellMoveByIndex({ col:0 , row :row+1 })
//         }
//     } else {
//         focusCellMoveByArrow(`ArrowRight`)
//     }
// }
//
// const focusCellMoveByArrow = (direction:string) => {
//     if (!focusCell) return
//     const [ row ,col ] = getRowAndCol(focusCell);
//
//     switch (direction) {
//         case "ArrowRight": {
//             if ( col === tableSize.col ) return ;
//             focusCellMoveByIndex({ col:col+1 , row })
//             break;
//         }
//         case "ArrowLeft" : {
//             if ( col === 0 ) return
//             focusCellMoveByIndex({ col:col-1 , row })
//             break;
//         }
//         case "ArrowUp" : {
//             if ( row === 0 ) return
//             focusCellMoveByIndex({ col , row:row-1 })
//             break;
//         }
//         case "ArrowDown" : {
//             if ( row === tableSize.row ) return
//             focusCellMoveByIndex({ col , row:row+1 })
//             break;
//         }
//     }
// }
//
// const keyDownHandle = (e : React.KeyboardEvent) => {
//     const key = e.key ;
//
//     if ( key === "Enter" ) {
//         e.preventDefault();
//         if ( isInput ) {
//             focusCellOnEnter()
//         } else if ( focusCell  ) {
//             if ( getNodeType(focusCell) === dataTag.header ) return
//             setIsInput(true)
//         }
//     } else if ( [`ArrowRight` , `ArrowLeft` , `ArrowDown` , `ArrowUp` ].includes(key) ) {
//         if ( isInput ) return
//          focusCellMoveByArrow(key)
//     }
// }
//
// const copyHandle = () => {
//     console.log("copy");
//
//     if (!focusCell ) return
//
//     if (  !selectingCell ) {
//         navigator.clipboard.writeText(focusCell.innerText);
//         return
//     }
//     //
//     const [ rowF , colF ] = getRowAndCol(focusCell);
//     const [ rowS , colS ] = getRowAndCol(selectingCell);
//
//     const [ minRow , maxRow ] = [  Math.min( rowF , rowS ) ,  Math.max( rowF , rowS )  ] ;
//     const [ minCol , maxCol ] = [  Math.min( colF , colS ) ,  Math.max( colF , colS )  ] ;
//
//     let output = "" ;
//     for ( let i = minRow ; i <= maxRow ; i ++ ) {
//         const row = rows[i]
//         for ( let j = minCol ; j <= maxCol ; j ++ ) {
//             output += `${row[ columns[j].name ]}` ;
//             if (j < maxCol) output += "\t";
//         }
//         if (i < maxRow) output += "\n";
//     }
//     navigator.clipboard.writeText(output);
// }
//
// // ====================================================
//
// const [ resizeRowFromTop , setResizeRowFromTop ] = useState( 0 ) ;
// // const [ resizeRowFromLeft , setResizeRowFromLeft ] = useState( 0 ) ;
//
// const  mouseMoveHandle = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (!isResizing.current) return
//
//     const parent = e.currentTarget.getBoundingClientRect();
//
//     // const x = e.clientX - parent.left;
//     const y = e.clientY - parent.top;
//     setResizeRowFromTop(y)
// }
