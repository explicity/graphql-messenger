import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { Header, Comment } from 'semantic-ui-react';
import { MESSAGES_SEARCH_QUERY } from '../../queries';

import MessageItem from '../Messages/MessageItem.jsx';

class Search extends Component {
  state = {
    messages: [],
    filter: ''
  };
  _executeSearch = async () => {
    const { filter } = this.state;
    const result = await this.props.client.query({
      query: MESSAGES_SEARCH_QUERY,
      variables: { filter }
    });

    const messages = result.data.messages.messagesList;
    this.setState({ messages });
  };

  render() {
    const { messages } = this.state;
    return (
      <div>
        <div>
          Search
          <input
            type="text"
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        <Comment.Group>
          <Header as="h3" dividing>
            Results
          </Header>
          {messages.length > 0 ? (
            messages.map(message => (
              <MessageItem key={message.id} {...message} />
            ))
          ) : (
            <div>No results</div>
          )}
        </Comment.Group>
      </div>
    );
  }
}

export default withApollo(Search);
