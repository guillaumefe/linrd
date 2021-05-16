import React from 'react';
import { Editor } from './features/pipelinr/Pipelinr';
import { Viewer } from './features/pipelinr/Pipelinr';
import './App.css';

function App() {
  return (
    <div className="App" style={{ display:"flex", minHeight:"40em" }}>
        <Editor />
        <Viewer style={{flex: 1, padding: "10px"}} />
    </div>
  );
}

export default App;
