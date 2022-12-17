import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {loadYaml} from "../services/Load.js"
import {
  update,
  transformAsync,
  updateTasks,
  displayError,
  selectValue,
} from '../helpers/Reducer';

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";

export function Editor() {
  const dispatch = useDispatch()
  const value = useSelector(selectValue)
  const onLoad = (editor) => {
      editor.focus();
      editor.navigateFileEnd();
  }
  const onChange = (val) => {
          dispatch(displayError(""))
          dispatch(update(val))
          if (val) {
                  loadYaml(val).then((tasks)=>{
                      setTimeout(() => {
                          dispatch(updateTasks(tasks))
                      }, 0)
                  }, (err) => {
                      dispatch(updateTasks([]))
                      dispatch(displayError(err.message))
                  }) 
          } else {
              dispatch(updateTasks([]))
          }
  }
  return (
      <AceEditor style={{width:"100%"}}
        mode="yaml"
        theme="github"
        value = {value}
        onChange={onChange}
        onLoad={onLoad}
        name="editor"
        maxLines={Infinity}
        editorProps={{ $blockScrolling: true }}
      />
  );
}
