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

    const onValue = (event, type) => {
        // get from left
        let count = 1
        const origin = tasks.filter(task => task.key.toString() === event.target.dataset.key.toString())[0];
        const result = value.split('\n').map( line => {
            if (count.toString() === parseInt(origin.line, 10).toString()){
                if(line[line.length-1] === ":") {
			//...
                } else {
	            let reg = ""
		    if (type === 'duration') {
		      reg = /\(duration=.*?\)/
		    } else if (type === 'cost') {
			reg = /\(cost=.*?\)/
		    } else if (type === 'notes') {
			reg = /\(notes=.*?\)/
		    }
		    if (reg && line.match(reg)) {
		      line = line.trimEnd().replace(reg, "");
		    }
                    line = line.trimEnd() + " ("+type+"=" + (event.target.value) + ")"
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
        onAct(event, "--")
    }

    const onAwait = (event) => {
        onAct(event, "&-")
    }

    const onCancel = (event) => {
        onAct(event, "x-")
    }

    const onDelay = (event) => {
        onAct(event, "*-")
    }

    const onDoc = (event) => {
        onAct(event, "+-")
    }

    const onDuration = (event) => {
        onValue(event, 'duration')
    }

    const onCost = (event) => {
        onValue(event, 'cost')
    }

    const onNotes = (event) => {
	onValue(event, 'notes')
    }

  //<pr>{x.value}</pr>

  let pipeline_duration = 0
  let pipeline_cost = 0
  let pipeline_notes = 0
  for (let task in tasks) {
	  if (tasks[task].duration) 
    		pipeline_duration += Number(tasks[task].duration) 
	  if (tasks[task].cost) 
    		pipeline_cost += Number(tasks[task].cost) 
	  if (tasks[task].notes) 
    		pipeline_notes += 1 
  }

  function escapeRegExp(input) {
	const source = typeof input === 'string' || input instanceof String ? input : '';
	return source.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  return (
      <main>
      <section style={{"text-align": "left", "padding":"1em"}}>
        <b><code>{tasks.length + " tasks" + " | " + Number(pipeline_duration/60).toFixed(2) + " hours | " + pipeline_cost + " $"}</code></b>
	<br/>
        <b><code style={{"color" : "grey"}}>{pipeline_notes + " notes"}</code></b>
      </section>
      <section>
      <ListGroup id="result" style={{padding: "10px" }}>
      {
	 (! tasks.length && "You're done :)") || [tasks.filter( x => (x.path.join(" ") + x.value).toString().toLowerCase().match( escapeRegExp(searchterm.toLowerCase())) )[0]].map( x => {
          if(x.parent['type'] !== "recipe" && x.parent['type'] !== "document") {
	      let counter = x.key + 1
              return <section>
		  <ListGroup.Item key={x.key} style={{display: "flex", justifyContent: "space-between"}}>
                  <div style={{textAlign: "left", wordBreak: "break-word"}}>
                  <i>{"# " + '[' + counter + '] ' + x.path.join(" > ")}</i>
                  <br />
                  <br />
                  <p style={{"text-transform": "capitalize"}}><ReactMarkdown remarkPlugins={[gfm]} children={x.value}/></p>
	          <form>
		    <p style={{"width": "300px"}}>
		      <b>Duration in minutes : </b>
		      <input data-key={x.key} value = {x.duration} style={{"border":"none"}} placeholder="Duration in minutes" onChange={onDuration}></input>
		    </p>
		    <p style={{"width": "300px"}}>
		      <b>Cost in dollars : </b>
		      <input data-key={x.key} value = {x.cost} style={{"border":"none"}} data-key={x.key} placeholder="Cost in dollars" onChange={onCost}></input>
		    </p>
		    <p style={{"width": "300px"}}>
		      <b>Notes : </b>
		      <input data-key={x.key} value = {x.notes} style={{"border":"none"}} data-key={x.key} placeholder="Your notes" onChange={onNotes}></input>
		    </p>
		  </form>
                  </div>
                  <div style={{flex:0.1}}>
                  <Button data-key={x.key} variant={(x.doc) ? "info" : "outline-info"} size="sm" style={{width:"70px", marginBottom: "1px"}} onClick={onDoc}>Doc !</Button>
                  <Button data-key={x.key} variant={(x.delay) ? "warning" : "outline-warning"} size="sm" style={{width:"70px", marginBottom: "1px"}} onClick={onDelay}>Delay</Button>
                  <Button data-key={x.key} variant={(x.await) ? "primary" : "outline-primary"} size="sm" style={{width:"70px", marginBottom: "1px"}} onClick={onAwait}>Await</Button>
                  <Button data-key={x.key} variant={(x.done) ? "success" : "outline-success"} size="sm" style={{width:"70px", marginBottom: "1px"}} onClick={onDone}>Done</Button>
                  <Button data-key={x.key} variant={(x.cancel) ? "dark" : "outline-dark"} size="sm" style={{width:"70px", marginBottom: "1px"}} onClick={onCancel}>Cancel</Button>
                  </div>
                  </ListGroup.Item>
                  </section>
          }
      })
      }
      <pre>{error}</pre>
      </ListGroup>
      </section>
      </main>
  );
}
