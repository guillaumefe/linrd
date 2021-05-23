import React from "react"

import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
} from "react-bootstrap"

export const Menu = () => {
    return (
        <Navbar bg="light" expand="lg" style={{padding:"10px"}}>
        <Navbar.Brand href="#home">Linrd.ml</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#link">Link</Nav.Link>
        <NavDropdown title="Export" id="basic-nav-dropdown">
        <NavDropdown.Item href="#action/3.1">as Markdown</NavDropdown.Item>
        <NavDropdown.Item href="#action/3.2">as YAML</NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#action/3.4">Send by email</NavDropdown.Item>
        </NavDropdown>
        </Nav>
        <Form inline>
        <FormControl type="text" placeholder="Search" className="mr-sm-2" />
        </Form>
        </Navbar.Collapse>
        </Navbar>
    )
}
