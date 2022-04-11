

# How to build a project

- get the idea
- pipeline it
- process it

# How to pipeline

- get tasks: |
    - [x] task1
    - [x] task2
    - [ ] task3
- split it up in smaller components: |
    - task1:
        - [x] subtask1
        - [x] subtask2
        - [ ] subtask3
    - task2:
        - [x] subtask1
- call it a project: |
    - project:
        - [task1, task2]

- format as YAML

- **Linrd.ml** http://linrd.ml

    - is a way to documente any project
    - uses deeped nested lists, knowed as "pipelines", as input
    - serves next task(s), as output
    - is provided to people who need better organization
    - is secure by design https://linrd.ml
