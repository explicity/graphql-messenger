import React, { Component } from 'react';
import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { Header, Segment } from 'semantic-ui-react';

import { MessageList } from '../Messages';
import MessageForm from '../Messages/MessageForm';

class Routing extends Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <Header as="h3" block>
            <Link to="/add-message"> Add message</Link>
          </Header>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/new/1" />} />
            <Route exact path="/new/:page" component={MessageList} />
            <Route exact path="/add-message" component={MessageForm} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default Routing;
