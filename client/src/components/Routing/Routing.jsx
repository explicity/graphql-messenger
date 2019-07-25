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
import { Search } from '../Search';
import MessageForm from '../Messages/MessageForm';

class Routing extends Component {
  render() {
    return (
      <React.Fragment>
        <Router>
          <Segment clearing>
            <Header as="h2" floated="left">
              <Link to="/add-message"> Add message</Link>
            </Header>
            <Header as="h2" floated="right">
              <Link to="/search">Search</Link>
            </Header>
          </Segment>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/new/1" />} />
            <Route exact path="/new/:page" component={MessageList} />
            <Route exact path="/add-message" component={MessageForm} />
            <Route exact path="/search" component={Search} />
          </Switch>
        </Router>
      </React.Fragment>
    );
  }
}

export default Routing;
