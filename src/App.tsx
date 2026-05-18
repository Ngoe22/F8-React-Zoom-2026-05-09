import {  Provider } from "./contexts/Table";
import './App.css'
import type {ColumnTypes ,RowTypes ,updateCellProps , updateSizeProps } from "./types";
import Sheets from "./components/Sheets"
import {useState} from "react";

// =======================================================


const fixedSize = {
  indexColHeight : "20px" ,
  indexRowWidth : "20px" ,
  headerHeight : "30px" ,
}

const   dataTag = {
  header : "header" ,
  cell : "cell",
  indexCol : "indexCol" ,
  indexRow : "indexRow" ,
  resizeIndexCol : "resizeIndexCol" ,
  resizeIndexRow : "resizeIndexRow" ,
  input : "input",

  sheet : "sheet",
}


//

function App() {


  const  [ Columns , setColumns ]  = useState<ColumnTypes[]> ( [
    { name: "id" , editable : true , width : "150px" } ,
    { name: "name" , editable : true , width : "150px" },
    { name: "order" , editable : true , width : "150px" },
    { name: "note" , editable : true , width : "150px" }
  ] )


  const [ Rows , setRows ] = useState<RowTypes[]>( [
    { id : `1` , name : "Magne1" , order : "asc1" , note : "1-1" , height : "30px" },
    { id : `2` , name : "Magne2" , order : "asc2" , note : "2-2" , height : "30px"  },
    { id : `3` , name : "Magne3" , order : "asc3" , note : "3-3" , height : "30px" },
  ]);


  const updateCell = ({rowIndex , colIndex ,value} : updateCellProps) => {
    const newRows = [...Rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      [Columns[colIndex].name]: value
    };
    setRows(newRows);
  }

  const updateRowSize = ( {index , newSize } : updateSizeProps )=> {
    const newRows = [...Rows];
    newRows[ index ].height = `${newSize}px`;

    setRows(newRows)
  }

  const updateColSize = ( {index , newSize } : updateSizeProps )=> {

    const newColumns = [...Columns];
    newColumns[ index ].width = `${newSize}px`;
    setColumns(newColumns)
  }


  // =====================

  const contextValue = {
    columns : Columns,
    rows : Rows,
    fixedSize : fixedSize ,
    dataTag : dataTag ,
    updateCell : updateCell ,
    updateRowSize: updateRowSize ,
    updateColSize:updateColSize ,
  }

  return (
      <Provider value = { contextValue } >
        <Sheets/>
      </Provider>

  )
}

export default App
