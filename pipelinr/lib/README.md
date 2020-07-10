# pipelinr
An effective task engine.

# /!\ DEV BRANCH

## What is Pipelinr?

A todo engine. It's goal is to read as fast as possible a classical 
todolist writed down on a file and to deliver the firsts tasks actionables.

## Installation
```
pip install -r requirements
python app.py
```

## Usage
```
The basic usage is as follows:
```
# goal.yml 

```
# goal.yml
- is:
    - this
- my
- goal

ppl = Pipelinr('goal.yml')
ppl.serve()

```
# in the browser
open http://localhost:5000
```

