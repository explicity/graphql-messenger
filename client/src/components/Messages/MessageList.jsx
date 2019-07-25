import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Comment, Header } from 'semantic-ui-react';

import MessageItem from './MessageItem.jsx';

import {
  MESSAGES_QUERY,
  NEW_MESSAGES_SUBSCRIPTION,
  ACTION_MESSAGES_SUBSCRIPTION
} from '../../queries';

class MessageList extends Component {
  render() {
    const orderBy = 'createdAt_DESC';

    const _subscribeToNewMessages = subscribeToMore => {
      subscribeToMore({
        document: NEW_MESSAGES_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const { newMessage } = subscriptionData.data;
          const exists = prev.messages.messagesList.find(
            ({ id }) => id === newMessage.id
          );
          if (exists) return prev;
          console.log('added');
          return {
            ...prev,
            messages: {
              messagesList: [newMessage, ...prev.messages.messagesList],
              count: prev.messages.messagesList.length + 1,
              __typename: prev.messages.__typename
            }
          };
        }
      });
    };

    const _subscribeToNewActions = subscribeToMore => {
      subscribeToMore({
        document: ACTION_MESSAGES_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const { newMessageAction } = subscriptionData.data;
        }
      });
    };

    return (
      <Query query={MESSAGES_QUERY} variables={{ orderBy }}>
        {({ loading, error, data, subscribeToMore }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Fetch error</div>;

          _subscribeToNewMessages(subscribeToMore);
          _subscribeToNewActions(subscribeToMore);

          const {
            messages: { messagesList }
          } = data;
          console.log('messagesList: ', messagesList);

          return (
            <Comment.Group>
              <Header as="h3" dividing>
                Messages
              </Header>
              {messagesList.map(item => {
                return <MessageItem key={item.id} {...item} />;
              })}
            </Comment.Group>
          );
        }}
      </Query>
    );
  }
}

export default MessageList;
