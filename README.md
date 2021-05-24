# ⚠️ Known issues on Safari, works well with firefox, chrome

Linrd.ml:

    - is a way to documente any project
    - uses deeped nested lists, knowed as "pipelines", as input
    - serves next task(s), as output
    - is provided to people who need better organization

How it works:

    - clear localstorage: &clear_localstorage
        - open your browser
        - right click on the interface
        - select "web console"
        - the web console is opening &-
        - on the web console:
            - select the tab "console"
            - write the following command : >
                ```
                localStorage.clear()
                ```
            - you have successfully cleared the local storage

    - this is a pipeline:
        - example : &ref |
            - write hello:
                - write :
                    - h
                    - e
                    - l
                    - l
                    - o
            - say world:
                - have a small pursed mouth
                - expel air by letting your vocal cords vibrate
                - let more and more air pass through, opening your mouth gradually, as the sound spreads
    - as you see:
        - crafting a pipeline is about detailing how to do something:
            - step by step:
                - using nested list:
                    - each new children clarifies the previous entry:
                    - each entry can add one or more:
                        - clarification:
                            - as new bullets point
                        - objects
                        - arrays
                    - every action is expected in order
    - furthermore:
        - with a bit of imagination:
            - you should find new usages
            - example: &example |
                - my shopping list: &shopping |
                    * [ ] egg
                    * [ ] bread
                    * [ ] butter
                    * [ ] milk
                    * [ ] honey
                    * [ ] vegetables
                - my watch list: &series |
                    * [ ] twd
                    * [X] futurama, waiting for more seasons &-
                - my hobby: &code
                    - documente pipelinr
                    - commit linrd.ml
                    - watch megaquizz
                - my professional carrier: &work
                    - work on IT projects
                - timetable:
                    - monday:
                        - *work
                        - *series
                    - tuesday:
                        - *work
                        - *code
                    - wednesday:
                        - *work
                        - *series
                    - thursday:
                        - *work
                        - *code
                    - friday:
                        - *work
                        - *shopping
                        - *code
                    - saturday:
                        - *code
                        - *shopping
                    - sunday:
                        - *series
                        - *work
            - test:
                # expected output:
                - open http://linrd.ml
                - paste:
                    - *example

                - enter the searchterm monday : |
                    ```
                    ##### SELECTED BUTTON: null
                    [23] How it works > as you see > with a bit of imagination > exmples > timetable > monday
                    IT projects

                    ##### SELECTED BUTTON: Await
                    [24] How it works > as you see > with a bit of imagination > exmples > timetable > monday
                    [ ] twd
                    [X] futurama, waiting for more seasons &-
                    ```

    - you can use the full YAML specification:
        - but ">" acts like "|" (if it's not, it's a bug!)
    - your changes are persistent and will be preserved reboot after reboot:
        - IF you want to get rid of a previous session:
            - *clear_localstorage
    - you can share pipelines between people:
        - a pipeline should be self-contained for all needed information
        - it's easy to copy/paste a pipeline from one Linrd instance to another Linrd instance:
            - test:
                - open Linrd in multiple browsers
                
    - Linrd :
        - is not fully ready
        - is quite already usable
    - the work in progress is about:
        - real time database over the network with end-to-end encryption clientside
        - reverse proxying one-time-generated URL linked to slots in db
        - add "sprint" feature: :
            - the main interface won't hold done/cancel/await/... anymore
            - but instead:
                - start:
                    - onClick:
                        - start Sprint interface, contains:
                            - chronometer
                            - progression percentage
                            - button stop
    - And more

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
