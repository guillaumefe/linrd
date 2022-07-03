import React from "react"
import { useSelector, useDispatch } from 'react-redux';
import {
  selectSearchTerm,
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
        dispatch(updateSearchTerm(" " + event.target.value))
    }

    const searchterm = useSelector(selectSearchTerm)

    return (
        <Navbar bg="light" expand="lg" style={{padding:"10px", display: "flex", justifyContent: "space-between"}}>
        <Navbar.Brand href="#home">Linrd.ml</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Form inline style={{flex:1}}>
        <FormControl onChange={onChange} value={searchterm} type="text" placeholder="Search" className="mr-sm-2" />
        </Form>
        </Navbar.Collapse>
        </Navbar>
    )
}
