#### Usage:
First do ```npm install``` or ```yarn install```.

### Git; Branch and Stability Info
Source control is `Git` exclusive:

* The `master` branch is updated only from the current state of the `staging` branch
* The `staging` branch must only be updated with commits from the `dev` branch
* The `dev` branch contains all the latest additions to the project
* All larger feature updates must be developed in their own branch and later merged into `dev`

### Dev guide
1. Install [ATOM] (https://atom.io/)
2. Install [NODE.js] (https://nodejs.org/en/)
3. Install [GIT BASH] (https://git-for-windows.github.io/)
4. Install JSX syntax highlighting for ATOM.
  - Open GIT BASH and run:
```
  apm install react
```
5. Clone this repo:
  - Open GIT BASH and run:
```
  git clone https://project_path
```
6. Open directory in ATOM:
  - Open GIT BASH and run:
```
  cd project_path
  atom .
```
7. Install NPM modules defined in package.json.
  - Open GIT BASH and run (in project_path directory):
```
  npm install
```
NOTE: you can always rm -rf node_modules and run npm install again.
8. Run webpack JS compiler. See package.json. This also acts as a webserver. Check localhost:8080
  - In GIT BASH and run:
```
  npm run dev
```
NOTE: webpack automatically compiles changes made in .js files to ./src/client.min.js, and automatically reloads changes in browser (localhost:8080)


##To hide client.min.js from tree view:

1. From the Menu Bar go to File > Settings > Packages type in the Filter "tree-view" click on the setting of this package and then check the "Hide Ignored Names" choice.

2. Now go to "Core Setting" by File > Settings . In the Ignored Names box enter "client.min.js" this will Hide client.min.js.



### Enable cross domain for development access to triglav_rest api
##### It can be done in two ways:
1. Install [Chrome extension Allow-Control-Allow-Origin: *](https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi?hl=en)
OR
2. Run Chrome with ```"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --disable-web-security --user-data-dir="C:\TEMP"```

## Using strings in components:

##### Just render text in elements
```js
import { FormattedMessage, defineMessages } from 'react-intl';
...
  render() {
    return (
      <div>
          <FormattedMessage
            id="prefix.login.login_message"
            defaultMessage="prefix.login.login_message"
            description="prefix.login.login_message"
          />
        </Link>
      </div>
    );
  }
...
```
##### Use strings inbetween tags

```js
import { defineMessages, injectIntl, intlShape, FormattedMessage } from 'react-intl';

export default class LoginForm extends React.Component {

  render() {

    return (
      <div>
        <input type="text"
          id="tb_idbr"
          className="tb_idbr"
          placeholder={this.context.intl.formatMessage({id:"prefix.login.user_name", defaultMessage: "prefix.login.user_name"})}
          style={{height: 30}}
        />
      </div>
    );
  }
}


LoginForm.contextTypes ={
 intl:React.PropTypes.object.isRequired
}


```


###### Long way, but extracts messages
```js
import { defineMessages, injectIntl, intlShape, FormattedMessage } from 'react-intl';

let messages = defineMessages({
    user_name: {
        id: 'prefix.login_user_name',
        defaultMessage: 'prefix.login_user_name',
        description: 'prefix.login.user_name',
    },
});

class LoginForm extends React.Component {

  render() {
    const {formatMessage} = this.props.intl;

    return (
        <div>
            <input type="text"
                id="tb_idbr"
                className="tb_idbr"
                placeholder={formatMessage(messages.user_name)}
                style={{height: 30}}
            />
        </div
    );
  }
}

LoginForm.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(LoginForm);
```

###### Shorter way to use strings in tags, but does not extract messages
```js
import { defineMessages, injectIntl, intlShape, FormattedMessage } from 'react-intl';

let messages = defineMessages({});

function testFunction (id, key){
  messages[id] = {
    "id": [key].toString(),
    "defaultMessage": [key].toString(),
    "description": [key].toString()
  };
};

testFunction("user_name", "prefix.login.user_name");
testFunction("password", "prefix.login.password");

class LoginForm extends React.Component {

  render() {
    const {formatMessage} = this.props.intl;

    return (
        <div>
            <input type="text"
                id="tb_idbr"
                className="tb_idbr"
                placeholder={formatMessage(messages.user_name)}
                style={{height: 30}}
            />
        </div
    );
  }
}

LoginForm.propTypes = {
    intl: intlShape.isRequired,
};

export default injectIntl(LoginForm);
```


## Links worth reading:

http://stackoverflow.com/questions/31709258/why-is-getinitialstate-not-being-called-for-my-react-class

https://toddmotto.com/react-create-class-versus-component/

#### how to use react classes
https://medium.com/@dan_abramov/how-to-use-classes-and-sleep-at-night-9af8de78ccb4#.behdtz7uv


#### async wait for redux react
http://jsbin.com/xopumutiwu/edit?js,output


#### redux react auth
https://auth0.com/blog/secure-your-react-and-redux-app-with-jwt-authentication/
http://www.thegreatcodeadventure.com/jwt-authentication-with-react-redux/
http://blog.slatepeak.com/build-a-react-redux-app-with-json-web-token-jwt-authentication/


#### proper use of connect es6
https://medium.com/@firasd/quick-start-tutorial-using-redux-in-react-apps-89b142d6c5c1#.k9t6bpkwl
##### map state to props, map dispatch to props
http://stackoverflow.com/questions/38202572/understanding-react-redux-and-mapstatetoprops
https://github.com/reactjs/react-redux/issues/291


#### timeout redux with callbacks and stuff (for science only)
http://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559


#### "proper" folder structure react
https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.1aa2js7lf


#### react-tooltip demo
http://wwayne.com/react-tooltip/
##### html built in events for react-tooltip (use without the "on" in front of events i.e click instead of onclick)
http://www.w3schools.com/tags/ref_eventattributes.asp


#### react component lifecycle (getInitialState is deprecated )
http://busypeoples.github.io/post/react-component-lifecycle/
https://plnkr.co/edit/0cN0tu?p=preview
https://codepen.io/netsi1964/pen/NRgyZX


#### react HOC vodoo
https://medium.com/@franleplant/react-higher-order-components-in-depth-cf9032ee6c3e#.p44gmavrt

*Have in mind that you have to build your library before publishing. The files under the `lib` folder are the ones that should be distributed.*

## Getting started

1. Setting up the name of your library
  * Open `webpack.config.js` file and change the value of `libraryName` variable.
  * Open `package.json` file and change the value of `main` property so it matches the name of your library.
2. Build your library
  * Run `npm install` to get the project's dependencies
  * Run `npm run build` to produce minified version of your library.
3. Development mode
  * Having all the dependencies installed run `npm run dev`. This command will generate an non-minified version of your library and will run a watcher so you get the compilation on file change.
4. Running the tests
  * Run `npm run test`

## Scripts

* `npm run build` - produces production version of your library under the `lib` folder
* `npm run dev` - produces development version of your library and runs a watcher
* `npm run test` - it runs the tests
* `npm run test:watch` - same as above but in a watch mode

## Coding guidelines

1. HTML/JSX
    * JSX attribute values are always in single quotations ('value').
    * Element IDs are always written in all lowercase. Words are separated with underscore.
    * Example: `<div id='main_menu_container'>`
    * Class attribute values are always in all lowercase, separated by a dash.
    * Example: `<div class="hidden-element-left">` or `<div className='hidden-element-left'>`
    * Links and routes names are written in all lowercase. Words are separated with underscore.
    * Example: `<a href='/user_posts'>`
2. CSS
    * Class attribute values are always in all lowercase, separated by a dash.
    * Example: `<div class="hidden-element-left">` or `<div className='hidden-element-left'>`
3. JS
    * There should be no semicolon at the end of each statement or line of code.
    * There should be no logging statements outside of try-catch blocks or Promise callbacks.
    * All variable names and function names are written in camel case.
    * Example:
    ``` js 
        function fetchUsers() {
            let i = 0
            const userName = 'Test'
        }
    ```
    * All String values are written in single quotes.
    * Example `const source = 'database'`
    * All class names and class instances are written in pascal case.
    * Example:
    ``` js 
        class UserType { ... }
        const Administrator = new UserType()
    ```
4. Redux
    * All action creators and reducers are written in camel case, since they are functions.
    * All action types are written in all capital letters, separated by underscore.
    * Example: `type: 'REMOVE_USER'`
    
    *If any piece of code does not follow these guidelines, it was probably written before these guidelines were established on 04.07.2019.

