import React from "react";
//import { render } from "react-dom";
import AceEditor from "react-ace";
import yaml from "js-yaml";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

//==============pipelinr===============

/**
 * Perform a deeply recursive reduce on a set of JSON, or a JSON-encodable Object hierarchy.
 *
 * @param  {Array|Object} collection
 * @param  {Function}     fn
 * @param  {*}            memo
 * @return {*}
 */
function deepReduce(collection, fn, memo) {

  /**
   * @inner
   * @param  {*} value
   * @param  {String[]} path
   * @return {*}
   */
  function iterator(value, path) {
    var type = Object.prototype.toString.call(value);
     
    memo = fn(memo, value, path);
    
    if (type === '[object Array]') {
      for (var i = 0, len = value.length; i < len; i++) {
        iterator(value[i], path.concat(i));
      }
    } else if (type === '[object Object]') {
      for (var key in value) {
        iterator(value[key], path.concat(key));
      }
    }
    return memo;
  }

  return iterator(collection, []);

}

function pipelinr (pl) {
    const done = "--"
    return deepReduce(pl, function(memo, value, path) {
        if (typeof value !== "object") {
            const origin = path.filter(x => isNaN(x))
            const index = origin.shift()
            const lastCharsIndex = index.slice(-2);
            if(lastCharsIndex === done) return memo
            const lastCharsValue = value.slice(-2);
            if(lastCharsValue === done) return memo

            if ( ! memo[index]) memo[index] = []
            let parents = ""
            let suffix = ""
            for (let o=0; o<origin.length; o++) {
                const lastChars = origin[o].slice(-2);
                if (lastChars === done) suffix = done
                origin[o] += suffix
            }
            if (origin.length) parents = origin.join(", ")
            const lastCharsParents = parents.slice(-2);
            if(lastCharsParents === done) return memo
            const _parents =  (parents) ? parents + " " : "";
            memo[index].push(_parents + value);
        }

        return memo;
    }, {});
}

//====================================

function onChange(newValue) {
    //console.log("change", newValue);
    let result = document.getElementById("result")
    try {
        const pl = yaml.load(newValue);
        const rez = pipelinr(pl)
        result.innerHTML  = yaml.dump(rez);
        localStorage.setItem('pl', newValue);
    } catch (e) {
        if(newValue) {
            result.innerHTML = e
            localStorage.setItem('pl', newValue);
        } else {
            result.innerHTML = ""
            localStorage.setItem('pl', "");
        }
    }
}

// Render editor
function App() {
  return (
    <div className="App" style={{ display:"flex", minHeight:"40em" }}>
      <header className="App-header">
      </header>
      <AceEditor style={{flex: 1}}
      mode="java"
      theme="github"
      onChange={onChange}
      name="UNIQUE_ID_OF_DIV"
      maxLines="Infinity"
      editorProps={{ $blockScrolling: true }}
      onLoad = {(editor) => {
          editor.focus();
          var session = editor.session
          session.insert({
              row: session.getLength(),
              column: 0
          }, localStorage.getItem('pl'))
      }}
      />
      <textarea id="result" style={{flex: 1, border: "none", overflow: "auto", outline: "none"}} disabled={true}></textarea>
    </div>
  );
}

export default App;
