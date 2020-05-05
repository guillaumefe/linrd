# pipelinr
An effective task engine.

GNU GENERAL PUBLIC LICENSE
Version 3, 29 June 2007

# What is Pipelinr?

A todo engine. It's goal is to read as fast as possible a classical 
todolist writed down on a file and to deliver the last tasks actionables.

# How do I use it?

You have to write a file more or less like this:

```
# project
1. c
- do this first
2. b
- c
- d
1. do this second
1. do this before previous
2. do that after 1.
- do x when you want
- do y same time
- this has to be done prior to y
etc.
```

Save your file as 'todo' or other custom name. If you saved your file 
as 'todo', mv in the file folder in command line and then execute pipelinr 
without argument:

```
cd mydir
touch todo
vim todo
pipelinr
```

You can also open a specific file:
```
pipelinr -f my_specific_file
```

By doing so, Pipelinr will display a bunch of *actionable tasks*

Each task in the list is a task you should do first.
