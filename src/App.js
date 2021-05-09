import React from "react";
import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/Button"
import 'bootstrap/dist/css/bootstrap.min.css';

import yaml from "js-yaml";

import AceEditor from "react-ace";
import { Range } from "ace-builds"
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";

import Editor from "./components/editor.jsx"
import Viewer from "./components/viewer.jsx"

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

function App() {

    const [value, setValue] = React.useState([])

    //first time access
    React.useEffect(() => {
        // do async task to get the data
        // database access
        // le retour sera un cb:
        //  - si observable: subscribe
        //  - si ..
        //  - faire un set value:
        //      - car:
        //          - apres la req asycn:
        //              - recup valeur
        //              - injecte dans le state avec setValue
    })

    const onDone = (event) => {
        const target = value[event.target.dataset.key]
        const isDone = target.done
        target.await = false
        target.cancel = false
        target.later = false
        //target.value = target.value + ' --'
        if ( ! isDone ) {
            target.done = true;
            writeLine(target.key, target.value, '--')
        //} else {
        //    target.done = false;
        }
        setValue([...value])
    }

    const onAwait = (event) => {
        const target = value[event.target.dataset.key]
        const is = target.await
        target.done = false
        target.cancel = false
        target.later = false
        if ( ! is ) {
            target.await = true;
        //} else {
        //    target.await = false;
        }
        setValue([...value])
    }

    const onCancel = (event) => {
        const target = value[event.target.dataset.key]
        const is = target.cancel
        target.await = false
        target.done = false
        target.later = false
        if ( ! is ) {
            target.cancel = true;
        //} else {
        //    target.cancel = false;
        }
        setValue([...value])
    }

    const onLater = (event) => {
        const target = value[event.target.dataset.key]
        const is = target.later
        target.await = false
        target.cancel = false
        target.done = false
        if ( ! is ) {
            target.later = true;
        //} else {
        //    target.later = false;
        }
        setValue([...value])
    }

    const loadPipeline = (doc) => {
        let cout = 0
        const output = deepReduce(doc, (memo, value, path) => {
            if (value && typeof value === "string") {
                const task = {
                    key: cout++,
                    done: false,
                    later: false,
                    cancel: false,
                    await: false,
                    path: path.map( x => (isNaN(x)) ? x : ""),
                    value
                }
                memo.push(task)
            }
            return memo
        }, []);

        return output
    }

    const loadYaml = (newValue) => new Promise((success, failure) => {
        try {
            yaml.loadAll(newValue, function (doc) {
                const pl = loadPipeline(doc)
                success(pl)
                //save(doc)
            })
        } catch(e) {
            failure(e)
        }
    })

    const onChange = (newValue) => {
        save(newValue)
        loadYaml(newValue)
            .then( pl => {
                setValue(pl)
            })
            .catch( e => {
                setValue(e.message)
            })
    }

    const save = (pl) => {
        localStorage.setItem('pl', JSON.stringify(pl))
    }

    const load = () => {
        return JSON.parse(localStorage.getItem('pl'))
    }

    const Ed = React.createRef();

    const writeLine = (line, pattern, sign) => {
        const session = Ed.current.editor.session
        const content = session.getValue()
        let current_line = 0
        let accurate_line = 0
        const pl = content.split('\n').map( (x,i) => {
            if (x && x[x.length-1] !== ":" && x[x.length-1] !== ">" && x[x.length-1] !== "|") {
                if (current_line === line && x.trim()[0] === "-") {
                    session.replace(new Range(accurate_line, 0, accurate_line, Number.MAX_VALUE), x + " --")
                    current_line++
                } else if (current_line === line && x.trim()[0] === "-") {
                    accurate_line++
                }
            }
            accurate_line++
        //    if (i === line)
        //        return x + " TOTOTOOKOKOKOK"
        //    else
        //        return x
        //    if (x) {
        //        if (current_line  === line)
        //            session.replace(new Range(accurate_line, Number.MAX_VALUE, accurate_line, Number.MAX_VALUE), x + " --")
        //        current_line++
        //    }
        //    accurate_line++
        })
        //save(pl.join('\n'))
        //alert(line)
}

    const onLoad = (editor) => {
        const session = editor.session
        //let textContent = yaml.dump(load(), {
        //    'styles': {
        //        '!!null': 'canonical' // dump null as ~
        //    },
        //    'sortKeys': true        // sort object keys
        //});
        let textContent = load() || ""
        editor.focus();
        session.insert({
            row: session.getLength(),
            column: 0
        }, textContent)

    }

  //const html = '<textarea id="result" style={{flex: 1, border: "none", overflow: "auto", outline: "none"}} disabled={true}></textarea>' 
  
  return (
     // Infinty as a string causing error but is necessary TODO
    <div className="App" style={{ display:"flex", minHeight:"40em" }}>
      <header className="App-header">
      </header>
      <AceEditor style={{flex: 1}}
      ref={Ed}
      placeholder="Read the doc : https://guillaumefe.github.io/linrd/"
      maxLines= 'Infinity'
      mode="java"
      theme="github"
      onChange={onChange}
      name="UNIQUE_ID_OF_DIV"
      editorProps={{ $blockScrolling: true }}
      onLoad = {onLoad}
      />
      <ListGroup id="result" style={{flex: 1, padding: "10px"}}>
        {
            ( ! value.map) ? "ERROR : " + value.toString() : value.map( x => {
                    return <ListGroup.Item style={{display: "flex"}}>
                        <div style={{flex: 1}}>{"[" + x.key +  "]"} {x.path.join(" ") + x.value}</div>
                        <div style={{flex:0.1}}>
                        <Button data-key={x.key} variant={(x.later) ? "warning" : "outline-warning"} size="sm" style={{width:"60px", marginBottom: "1px"}} onClick={onLater}>Later</Button>
                        <Button data-key={x.key} variant={(x.done) ? "success" : "outline-success"} size="sm" style={{width:"60px", marginBottom: "1px"}} onClick={onDone}>Done</Button>
                        <Button data-key={x.key} variant={(x.await) ? "primary" : "outline-primary"} size="sm" style={{width:"60px", marginBottom: "1px"}} onClick={onAwait}>Await</Button>
                        <Button data-key={x.key} variant={(x.cancel) ? "info" : "outline-info"} size="sm" style={{width:"60px", marginBottom: "1px"}} onClick={onCancel}>Cancel</Button>
                        </div>
                        </ListGroup.Item>
                })
        }
      </ListGroup>
    </div>
  );
}

export default App;
