# pipelinr
An effective task engine.

## What is Pipelinr?

A todo engine. It's goal is to read as fast as possible a classical 
todolist writed down on a file and to deliver the firsts tasks actionables.

## Installation
```
pip3 install pipelinr
```

## Usage
```
pipelinr -f [path to todo]

Example:
pipelinr -f example/todo
```

## How do I use it?

You have to write a file more or less like this:
```
# Project
do a
 do b first
 do c
  do d
   do e before d
    this has to be done prior to e
end  # the last line MUST be a "end" tag
```

Save your file as 'todo' or other custom name. If you saved your file 
as 'todo', mv in the file folder in command line and then execute pipelinr 
without argument:

```
ls -l  .
-rw-r--r--  1 ... todo

pipelinr  # will find todo
```

You can also open a specific file:
```
pipelinr -f my_specific_file
```

By doing so, Pipelinr will display a bunch of *actionables tasks*
There are the first tasks that can be done in the list
Each task in the list is a task you should do first.
```
[#Project]

[1] Do b first
[2] This has to be done prior to e
```
Pipelinr can determine actionables tasks among millions of tasks, in seconds
