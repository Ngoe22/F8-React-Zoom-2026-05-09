import styles from "./styles.module.css";
import {memo, useContext, useEffect, useRef} from "react";
import {Context} from "../../../../contexts/Table";
import {queryCellNode} from "../../../../utils/functions"
import type {CellNodeType} from "../../../../types"

interface Props {
    node : CellNodeType | null
}

function InputCell ( {node} :Props ) {

    const { columns , rows } = useContext(Context)!;
    const { dataTag , updateCell } = useContext(Context)!;
    const tempInput = useRef<string | null>( null);
    const inputRef = useRef<HTMLDivElement | null>(null);

    useEffect ( ()=> {
        // auto focus
        if (!inputRef.current || !node) return;
        const el = inputRef.current;
        el.innerText = rows[node.row][columns[node.col].name]; // default text
        el.focus();
        moveCaretToEnd(el); // AI wrote
        //
        return ()=>{
            // update data
            if ( node ) {
                if (  tempInput.current  ) {
                        updateCell( {rowIndex :node.row  , colIndex : node.col ,value :tempInput.current } )
                        tempInput.current = null
                }
            }
        }
    } ,[columns, node, rows, updateCell])

    if ( !node ) return null
    const focusNode = queryCellNode( {
        row : node.row , col : node.col , type :node.type
    } )
    if ( !focusNode ) return null
    const width = columns[node.col].width ;
    const height =  rows[node.row].height ;

    return (
        <div
            ref={inputRef}
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
                tempInput.current = e.currentTarget.innerText;
            }}

            className={styles.inputCell}
            data-type = {dataTag.input}
            style={{
                top : `${focusNode.offsetTop}px` ,
                left :  `${focusNode.offsetLeft}px` ,
                width : `${width}` , height : `${height}`
            }}
        >
        </div>
    )
}

export default memo(InputCell);


const moveCaretToEnd = (
    el: HTMLElement
) => {
    const range =
        document.createRange();
    const sel =
        window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
};