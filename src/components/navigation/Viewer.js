import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {loadYaml} from "../services/Load.js"
import {
  update,
  updateTasks,
  displayError,
  selectTasks,
  selectError,
  selectValue,
  selectSearchTerm
} from '../helpers/Reducer';

import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/Button"
import 'bootstrap/dist/css/bootstrap.min.css';

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

export function Viewer() {
  const tasks = useSelector(selectTasks)
  const value = useSelector(selectValue)
  const searchterm = useSelector(selectSearchTerm)
  const error = useSelector(selectError)
  const dispatch = useDispatch()

    const onAct = (event, symbol) => {
        // get from left
        let count = 1
        const origin = tasks.filter(task => task.key.toString() === event.target.dataset.key.toString())[0];
        const result = value.split('\n').map( line => {
            if (count.toString() === parseInt(origin.line, 10).toString()){
                if(line[line.length-1] === ":") {
                    line = line.slice(0, line.length-1) + " " +symbol+":"
                } else {
                    if (line[line.length-1] === "-") {
                        line = line.slice(0, line.length-2)
                    }
                    line = line.trimEnd() + " " +symbol
                }
            }
            count++
            return line
        })
        // update right
        const val = result.join("\n")
        dispatch(update(val))
        loadYaml(val).then((tasks)=>{
            dispatch(updateTasks(tasks))
        }, (err) => {
            dispatch(updateTasks([]))
            dispatch(displayError(err))
        }) 
    }

    const onDone = (event) => {
        onAct(event, "--", origin)
    }

    const onAwait = (event) => {
        onAct(event, "&-", origin)
    }

    const onCancel = (event) => {
        onAct(event, "x-", origin)
    }

    const onDelay = (event) => {
        onAct(event, "*-", origin)
    }

    const onDoc = (event) => {
        onAct(event, "+-", origin)
    }

  //<pr>{x.value}</pr>
  return (
      <ListGroup id="result" style={{padding: "10px" }}>
      {tasks.filter( x => (x.path.join(" ") + x.value).toString().match(searchterm) ).map( x => {
          if(x.parent['type'] !== "recipe" && x.parent['type'] !== "document") {
              return <ListGroup.Item key={x.key} style={{display: "flex", justifyContent: "space-between"}}>
                  <div style={{textAlign: "left", wordBreak: "break-word"}}>
                  <b>{"# " + x.path.join(" > ")}</b>
                  <br />
                  <ReactMarkdown remarkPlugins={[gfm]} children={x.value}/>
                  </div>
                  <div style={{flex:0.1}}>
                  <Button data-key={x.key} variant={(x.doc) ? "info" : "outline-info"} size="sm" style={{width:"70px", marginBottom: "1px"}} onClick={onDoc}>Doc !</Button>
                  <Button data-key={x.key} variant={(x.delay) ? "warning" : "outline-warning"} size="sm" style={{width:"70px", marginBottom: "1px"}} onClick={onDelay}>Delay</Button>
                  <Button data-key={x.key} variant={(x.await) ? "primary" : "outline-primary"} size="sm" style={{width:"70px", marginBottom: "1px"}} onClick={onAwait}>Await</Button>
                  <Button data-key={x.key} variant={(x.done) ? "success" : "outline-success"} size="sm" style={{width:"70px", marginBottom: "1px"}} onClick={onDone}>Done</Button>
                  <Button data-key={x.key} variant={(x.cancel) ? "dark" : "outline-dark"} size="sm" style={{width:"70px", marginBottom: "1px"}} onClick={onCancel}>Cancel</Button>
                  </div>
                  </ListGroup.Item>
          }
      })}
      <pre>{error}</pre>
      </ListGroup>
  );
}
