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
  selectSearchTerm,
  selectPointer,
} from '../helpers/Reducer';

import ListGroup from "react-bootstrap/ListGroup"
import Button from "react-bootstrap/Button"
import 'bootstrap/dist/css/bootstrap.min.css';

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function Viewer() {

  const _tasks = useSelector(selectTasks)
  const tasks = [..._tasks] 

  const value = useSelector(selectValue)
  const searchterm = useSelector(selectSearchTerm)
  const error = useSelector(selectError)
  const dispatch = useDispatch()

  function getPointer () {
	  let pointer = -1
	  for (let index in tasks) {
	    const reg = /-$/
            const task = tasks[index]
	    if (! task.value.match(reg)) {
	      pointer = index
              break
	    }
	  }
	  if (pointer === -1) {
            let NEED_UPDATE = false
	    for (let index in tasks) {
	      const reg = /[*&+]-$/
              const task = tasks[index]
	      if (task.value.match(reg)) {
                NEED_UPDATE = true
	      }
	    }
            if (NEED_UPDATE) {
		    resetSprint(pointer)
	    }
	  }
	  return pointer
  }

 function resetSprint (pointer) {
        // get from left
	
        //result = value.split('\n').map( line => line.trimEnd().replace(reg, ""))
	//reg = /[&]-$/
        //result = value.split('\n').map( line => line.trimEnd().replace(reg, ""))
	//reg = /[+]-$/
        //result = value.split('\n').map( line => line.trimEnd().replace(reg, ""))

	//nettoyage des flags Delay en fin de boucle
	const reg = /[*&+]-/

        const result = value.split('\n').map( line => line.replace(reg, ""))
	// const reg = /[&]-/
        // const result = value.split('\n').map( line => line.replace(reg, ""))
	// const reg = /[+]-/
        // const result = value.split('\n').map( line => line.replace(reg, ""))
	
        // update right
        const val = result.join("\n")
        dispatch(update(val))

	for (let index in tasks) {
	      const reg = /-$/
              const task = tasks[index]
	      if (! task.value.match(reg)) {
	        pointer = index
                //break
	      }
	}

	 setTimeout( () => {
		 loadYaml(val).then((t)=>{
			 dispatch(updateTasks(t))
		 }, (err) => {
			 dispatch(updateTasks([]))
			 dispatch(displayError(err))
		 }) 
	 }, 500)
  }

  const onValue = (type, key, content) => {

        // get from left
        let count = 1
        const origin = tasks.filter(task => task.key.toString() === key.toString())[0];
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
		    } else if (type === 'person') {
			reg = /\(person=.*?\)/
		    } else if (type === 'deadline') {
			reg = /\(deadline=.*?\)/
		    }
		    if (reg && line.match(reg)) {
		      line = line.trimEnd().replace(reg, "");
		    }
                    line = line.trimEnd() + " ("+type+"=" + (content) + ")"
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
                    if (line.trimEnd()[line.length-1] === "-") {
                        line = line.trimEnd().slice(0, line.length-2)
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
        loadYaml(val).then((t)=>{
            dispatch(updateTasks(t))
        }, (err) => {
            dispatch(updateTasks([]))
            dispatch(displayError(err))
        }) 
		
	  	const _event = new Event('USER_ACTION');
		document.dispatchEvent(_event);

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
	onValue('duration', event.target.dataset.key, event.target.value)
  }

  const onCost = (event) => {
	onValue('cost', event.target.dataset.key, event.target.value)
  }

  const onPerson = (event) => {
	onValue('person', event.target.dataset.key, event.target.value)
  }

  const onDeadline = (key, date) => {
	onValue('deadline', key, date.toISOString())
  }

  //<pr>{x.value}</pr>

  const unique_person = []
  let pipeline_duration = 0
			

  let pipeline_cost = 0
  let pipeline_person = 0
  for (let task in tasks) {
	  if (tasks[task].duration) { 
	        //const reg = /-$/
	        //if (! tasks[task].value.match(reg)) {
    		  pipeline_duration += Number(tasks[task].duration)
	       //}

	  }

	  if (tasks[task].cost) 
    		pipeline_cost += Number(tasks[task].cost) 
	  if (tasks[task].person){ 
		const _persons = tasks[task].person.split(',')
		for (let p in _persons) {
			if (unique_person.indexOf(_persons[p].toLowerCase()) === -1) {
					unique_person.push(_persons[p].toLowerCase())
				pipeline_person += 1 
			}
		}
	  }
  }

  function escapeRegExp(input) {
	const source = typeof input === 'string' || input instanceof String ? input : '';
	return source.replace(/[-[/\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  
  /*replace() here have the aim to correct patterns like (duration=) when there is no value for attribute*/
  function displayTask(x) {
          if(x.parent['type'] !== "recipe" && x.parent['type'] !== "document") {
              return <section>
		  <ListGroup.Item key={x.key} style={{display: "flex", justifyContent: "space-between"}}>
                  <div style={{textAlign: "left", wordBreak: "break-word"}}>
                  <i>{"# " + x.path.join(" > ")}</i>
                  <br />
                  <br />
                  <ReactMarkdown remarkPlugins={[gfm]} children={(x.value.length > 0) ? (x.value[0].toUpperCase() + x.value.slice(1, x.value.length)).replace(/\(.*?=\)/,'') : ""}/>

	          <form>
	          <div style={{marginTop: "30px"}}>
		    <div style={{width:"100%"}}>
		    <code style={{"float":"left", "width": "300px"}}>
		      <b>Duration in minutes : </b>
		      <input type="number" data-key={x.key} value = {Math.abs(x.duration)} style={{"border":"none"}} placeholder="Duration in minutes" onChange={onDuration}></input>
		    </code>
		    <code style={{"float":"left", "width": "300px", "marginTop":"10px"}}>
		      <b>Cost in dollars : </b>
		      <input type="number" data-key={x.key} value = {x.cost} style={{"border":"none"}} data-key={x.key} placeholder="Cost in dollars" onChange={onCost}></input>
		    </code>
		    <code style={{"float":"left", "width": "300px", "marginTop":"10px"}}>
		      <b>Person : </b>
		      <input data-key={x.key} value = {x.person} style={{"border":"none"}} data-key={x.key} placeholder="Who is responsible?" onChange={onPerson}></input>
		    </code>
	            </div>
		    <div style={{"float":"left", "width": "300px", "marginTop":"10px"}}>
		    <code>
		      <b>Deadline : </b>
	            </code>
		    <DatePicker
		        showTimeSelect 
		        selected={Date.parse(x.deadline)}
		        dateFormat="MMMM d, yyyy h:mmaa"
		        onChange={date => onDeadline(x.key, date)}
		    />
	            </div>
	          </div>
		  </form>
                  </div>
				  <div style={{fontWeight:"bold", height:"70px", width:"70px", margin: "1%", padding: "1%", border: (!x.value.match(/\[.\]/g)) ? "" : "1px solid black"}}>
					  {(!x.value.match(/\[.\]/g)) ? "" : (x.value.match(/\[x\]/g)) ? Math.round(x.value.match(/\[x\]/g).length / x.value.match(/\[.\]/g).length * 100) +"%" : 0 + "%"}
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
  }

// Affiche "1 heure(s) et 42 minute(s)"
//Number(pipeline_duration/60).toFixed(2)

  function get_metadata() {
	  //const timeString = `${Math.floor(pipeline_duration/60)}h${Math.round((pipeline_duration/60 - Math.floor(pipeline_duration/60)) * 60).toString().padStart(2, '0')}`;

		let timeString;
		const minutes = Math.floor(pipeline_duration);
		const seconds = Math.round(minutes*60);
		const hours = Math.floor(minutes/60);
		const days = Math.floor(hours/24);

		if (days > 0) {
		  timeString = `${days}j ${hours % 24}h`;
		} else if (hours > 0) {
		  timeString = `${hours}h`;
		} else {
		  timeString = `${minutes}m`;
		}
		
	  return <div> 
        <b>
		<code>
		  {tasks.filter(task => !task.delay).reduce((count, task) => {
			const matches = task.value.match(/\[ \]/g);
			if (matches) {
			  return count + matches.length;
			}
			return count + 1;
		  }, 0) + " tasks" + " | " + timeString + " | " + pipeline_cost + " $"
		  }
		</code>

	
		</b>
	<br/>
        <b><code style={{"color" : "grey"}}>{pipeline_person + " " + ((pipeline_person > 1) ? "persons" : "person") + ((!unique_person.length) ? "" : ": ") + unique_person}</code></b>
	</div>
  }

  const MAX_LIMIT = 25
  let LIMIT = 0

  return (
      <main>
      <section style={{"textAlign": "left", "padding":"1em"}}>
	  {(searchterm) ? '' : get_metadata()}
      <ListGroup id="result" style={{padding: "10px" }}>
      {
	 (! tasks.length && getPointer() <0 && ! error && "You're done :)") || 
	      getPointer() > -1 && tasks.filter( x => (x.path.join(" ") + x.value)
		         .toString().toLowerCase()
		         .match( escapeRegExp(searchterm.toLowerCase()))
		       ) 
	               
		       //.filter( (a) => ! a.value.trim().endsWith('*-') ) 
	      
	               //.filter( (a) => ! a.value.trim().endsWith('&-'))
	               
	               .map( x => {
			  if (! searchterm) {
				if (! x.value.trim().endsWith('*-')) {
				    if (MAX_LIMIT > LIMIT) {  
					LIMIT++
			  	    	return displayTask(x) 
				    }
				}
			  } else {
			  	return displayTask(x) 
			  }
		       })
      }
      <pre>{error}</pre>
      </ListGroup>
      </section>
      </main>
  );
}
