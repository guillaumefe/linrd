import React from "react"
import { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  sortTasks,
  selectSearchTerm,
  updateSearchTerm,
} from '../helpers/Reducer';

import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
    Button
} from "react-bootstrap"

export const Menu = () => {

    const dispatch = useDispatch()
    const onChange = (event) => {
        dispatch(updateSearchTerm(event.target.value))
    }

    const onSort = () => {
        dispatch(sortTasks())
    }


    //useEffect(() => { dispatch(updateSearchTerm("")); },[]);

    return (
        <Navbar bg="light" expand="lg" style={{padding:"10px", display: "flex", justifyContent: "space-between"}}>
        <Navbar.Brand href="#home">Linrd.ml</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Form inline style={{flex:1}}>
        <FormControl onChange={onChange} type="text" placeholder="Search" className="mr-sm-2" />
        </Form>
	<Button onClick={onSort} style={{"marginLeft":"10px"}} size="sm">Best Match</Button>
        </Navbar.Collapse>
        </Navbar>
    )
}
