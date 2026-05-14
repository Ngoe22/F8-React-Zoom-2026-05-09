import styles from "./styles.module.css";
import {useContext, useRef, memo, useEffect} from "react";
import {Context} from "../../../../contexts/Table";

interface Props {
    node : HTMLElement | null
}

function InputCell ( {node} :Props ) {

    const { dataTag , updateCell } = useContext(Context)!;
    const tempInput = useRef<string | null>(node?.innerText ??  null);
    const inputRef = useRef<HTMLDivElement | null>(null);

    useEffect ( ()=> {
        // auto focus
        if (!inputRef.current || !node) return;
        const el = inputRef.current;
        el.innerText = node.innerText; // default text
        el.focus();

        requestAnimationFrame(() => {//  AI wrote
            const range = document.createRange();
            const sel = window.getSelection();
            range.selectNodeContents(el);
            range.collapse(false);
            sel?.removeAllRanges();
            sel?.addRange(range);
        });
        //
        return ()=>{
            // update data
            if ( node ) {
                const col = node.getAttribute("data-cellcolumn");
                const row = node.getAttribute("data-cellrow");
                if (col  && row  && tempInput.current  ) {
                        updateCell( {rowIndex :Number(row)  , colIndex : Number(col) ,value :tempInput.current } )
                        tempInput.current = null
                }
            }
        }
    } ,[node, updateCell])

    if ( !node ) return null
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
                top : `${node.offsetTop}px` ,
                left :  `${node.offsetLeft}px` ,
                width : `${node.offsetWidth}px` , height : `${node.offsetHeight}px`
            }}
        >
        </div>
    )
}

export default memo(InputCell);