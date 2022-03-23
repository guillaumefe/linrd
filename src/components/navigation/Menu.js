import React from "react"
import { useSelector, useDispatch } from 'react-redux';
import {
  updateSearchTerm
} from '../helpers/Reducer';

import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
} from "react-bootstrap"


export const Menu = () => {

    const dispatch = useDispatch()
    const onChange = (event) => {
        dispatch(updateSearchTerm(event.target.value))
    }

    return (
        <Navbar bg="light" expand="lg" style={{padding:"10px", display: "flex", justifyContent: "space-between"}}>
        <Navbar.Brand href="#home">Linrd.ml</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Form inline style={{flex:1}}>
        <FormControl onChange={onChange} type="text" placeholder="Search" className="mr-sm-2" />

	<div style={{display:"flex", wrap:"wrap", gap: "10px", display:"none"}}>
	    <span>
	      <input className="form-check-input" type="checkbox" value="" id="checkDoc" />
	      <label className="form-check-label" for="checkDoc">
	    	&nbsp;Documented
	      </label>
	    </span>

	    <span>
	      <input className="form-check-input" type="checkbox" value="" id="checkOnGoing" checked />
	      <label className="form-check-label" for="checkOnGoing">
	       &nbsp;Ongoing 
	      </label>
	    </span>

	    <span>
	      <input className="form-check-input" type="checkbox" value="" id="checkDelay" />
	      <label className="form-check-label" for="checkDelay">
	    	&nbsp;Delayed
	      </label>
	    </span>

	    <span>
	      <input className="form-check-input" type="checkbox" value="" id="checkAwait" checked />
	      <label className="form-check-label" for="checkAwait">
	    	&nbsp;Awaited
	      </label>
	    </span>

	    <span>
	      <input className="form-check-input" type="checkbox" value="" id="checkDone" />
	      <label className="form-check-label" for="checkDone">
	    	&nbsp;Done
	      </label>
	    </span>

	    <span>
	      <input className="form-check-input" type="checkbox" value="" id="checkCancel" />
	      <label className="form-check-label" for="checkCancel">
	    	&nbsp;Canceled
	      </label>
	    </span>
	</div>
        </Form>
        </Navbar.Collapse>
        </Navbar>
    )
}
