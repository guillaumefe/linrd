import React from "react"
import { Menu } from "./Menu" 
import { Viewer } from '../pipelinr/Pipelinr';
import { Editor } from '../pipelinr/Pipelinr';

import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";

export const Router = () => {
    return (
    <BrowserRouter>
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users">
            <Users />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
    </BrowserRouter>
    )
}


function Home() {
    return (
      <main style={{display:"flex"}}>
        <section style={{ flex: 1, minWidth:"50%" }}>
            <Editor/>
        </section>
        <section style={{ flex:1, maxWidth:"50%" }}>
            <Menu />
            <Viewer />
        </section>
      </main>
    )
}
function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}
