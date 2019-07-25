import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { Comment, Header, Segment } from 'semantic-ui-react';

import MessageItem from './MessageItem.jsx';

import {
  MESSAGES_QUERY,
  NEW_MESSAGES_SUBSCRIPTION,
  NEW_REPLIES_SUBSCRIPTION,
  ACTION_MESSAGES_SUBSCRIPTION
} from '../../queries';

const LINKS_PER_PAGE = 5;

class MessageList extends Component {
  _getQueryVariables = () => {
    const isNewPage = this.props.location.pathname.includes('new');
    const page = parseInt(this.props.match.params.page, 10);

    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = 'createdAt_DESC';
    return { first, skip, orderBy };
  };

  _getLinksToRender = data => {
    const isNewPage = this.props.location.pathname.includes('new');
    if (isNewPage) {
      return data.messages.messagesList;
    }
    const messages = data.messages.messagesList.slice();
    messages.sort((l1, l2) => l2.votes.length - l1.votes.length);
    return messages;
  };

  _nextPage = data => {
    const page = parseInt(this.props.match.params.page, 10);
    if (page <= data.messages.count / LINKS_PER_PAGE) {
      const nextPage = page + 1;
      this.props.history.push(`/new/${nextPage}`);
    }
  };

  _previousPage = () => {
    const page = parseInt(this.props.match.params.page, 10);
    if (page > 1) {
      const previousPage = page - 1;
      this.props.history.push(`/new/${previousPage}`);
    }
  };

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
        }
      });
    };

    const _subscribeToNewReplies = subscribeToMore => {
      subscribeToMore({
        document: NEW_REPLIES_SUBSCRIPTION,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const { newReply } = subscriptionData.data;
          const currentMessages = prev.messages.messagesList.map(item => {
            if (item.id === newReply.message.id) {
              item.replies.push({
                id: newReply.id,
                body: newReply.body,
                __typename: 'Reply'
              });
            }
            return item;
          });

          console.log(currentMessages);
          return {
            ...prev,
            messages: {
              ...prev.messages,
              messagesList: currentMessages,
              __typename: prev.messages.__typename
            }
          };
        }
      });
    };

    return (
      <Query query={MESSAGES_QUERY} variables={this._getQueryVariables()}>
        {({ loading, error, data, subscribeToMore }) => {
          console.log('data: ', data);
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Fetch error</div>;

          _subscribeToNewMessages(subscribeToMore);
          _subscribeToNewActions(subscribeToMore);
          _subscribeToNewReplies(subscribeToMore);

          const linksToRender = this._getLinksToRender(data);
          const isNewPage = this.props.location.pathname.includes('new');
          const pageIndex = this.props.match.params.page
            ? (this.props.match.params.page - 1) * LINKS_PER_PAGE
            : 0;

          const {
            messages: { messagesList }
          } = data;
          console.log('messagesList: ', messagesList);

          return (
            <React.Fragment>
              <Comment.Group>
                <Header as="h3" dividing>
                  Messages
                </Header>
                {linksToRender.map((item, index) => {
                  return (
                    <MessageItem
                      key={item.id}
                      {...item}
                      index={index + pageIndex}
                    />
                  );
                })}
              </Comment.Group>
              {isNewPage && (
                <div className="flex ml4 mv3 gray">
                  <button className="pointer mr2" onClick={this._previousPage}>
                    Previous
                  </button>
                  <button
                    className="pointer"
                    onClick={() => this._nextPage(data)}
                  >
                    Next
                  </button>
                </div>
              )}
            </React.Fragment>
          );
        }}
      </Query>
    );
  }
}

export default MessageList;
