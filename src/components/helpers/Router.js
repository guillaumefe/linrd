import React from "react"
import { Menu } from "../navigation/Menu" 
import { Viewer } from '../navigation/Viewer';
import { Editor } from '../navigation/Editor';

import {
  BrowserRouter,
  Switch,
  Route,
} from "react-router-dom";

export function Router () {
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
	return <code style={{textAlign:'left'}}>
		<h4>
		# How to use Linrd
		</h4>
		
		<p>- STEP 1, Write your different tasks like this: ></p>
		<ul>
			<li>
				Task 1
				<ul>
					<li> Task 1.1</li>
					<li> Task 1.2
						<ul>
							<li> Task 1.2.1</li>
						</ul>
					</li>
				</ul>
			</li>
			<li>Task 2</li>
			<li>Task 3</li>
		</ul>

		<p>- STEP 2, Unscramble it task by task by removing the > sign</p>

		<p>- STEP 3, Click on one of the action buttons to make a decision: ></p>
			<ul>
			<li>doc : to document the context of the tasks</li>
			<li>delay : to postpone a task</li>
			<li>await : to indicate that you are waiting</li>
			<li>done : to indicate a completed task</li>
			<li>cancel : to cancel a task</li>
			</ul>

		<p>- STEP 4, Finish the pipeline, then start it again until the end of the project</p>

	      </code>;
}

function Users() {
  return <h2>Users</h2>;
}
