import React, { useState, Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { Comment, Icon } from 'semantic-ui-react';

import { ReplyList } from '../Replies';

import {
  POST_MESSAGE_LIKE_MUTATION,
  POST_MESSAGE_DISLIKE_MUTATION,
  MESSAGES_QUERY
} from '../../queries';

const LINKS_PER_PAGE = 5;

class MessageItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showReviewForm: false
    };

    this.toggleForm = this.toggleForm.bind(this);
  }

  toggleForm() {
    this.setState({
      showReviewForm: !this.state.showReviewForm
    });
  }

  render() {
    const { id, body, replies, likeCounter, dislikeCounter } = this.props;
    const { showReviewForm } = this.state;

    const _updateStoreAfterAction = (store, action) => {
      const orderBy = 'createdAt_DESC';
      const isNewPage = this.props.location.pathname.includes('new');
      const page = parseInt(this.props.match.params.page, 10);
      const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
      const first = isNewPage ? LINKS_PER_PAGE : 100;

      const data = store.readQuery({
        query: MESSAGES_QUERY,
        variables: { first, skip, orderBy }
      });

      const currentMessage = data.messages.messagesList.find(
        item => item.id === id
      );
      
      currentMessage.likeCounter = action.likeCounter;
      currentMessage.dislikeCounter = action.dislikeCounter;

      store.writeQuery({
        query: MESSAGES_QUERY,
        data,
        variables: { first, skip, orderBy }
      });
    };
    return (
      <Comment>
        <Comment.Avatar
          as="a"
          src="https://react.semantic-ui.com/images/avatar/small/christian.jpg"
        />
        <Comment.Content>
          <Comment.Author as="a">
            #{id.slice(id.length - 4, id.length - 1)}
          </Comment.Author>
          <Comment.Text>{body}</Comment.Text>
          <Comment.Actions>
            <Mutation
              mutation={POST_MESSAGE_LIKE_MUTATION}
              variables={{ messageId: id }}
              update={(store, { data: { postMessageLike } }) => {
                _updateStoreAfterAction(store, postMessageLike);
              }}
            >
              {postMutation => (
                <Comment.Action onClick={postMutation}>
                  <Icon name="thumbs up outline" />
                  {likeCounter}
                </Comment.Action>
              )}
            </Mutation>

            <Mutation
              mutation={POST_MESSAGE_DISLIKE_MUTATION}
              variables={{ messageId: id }}
              update={(store, { data: { postMessageDislike } }) => {
                _updateStoreAfterAction(store, postMessageDislike);
              }}
            >
              {postMutation => (
                <Comment.Action>
                  <Icon name="thumbs down outline" onClick={postMutation} />
                  {dislikeCounter}
                </Comment.Action>
              )}
            </Mutation>
            <Comment.Action onClick={() => this.toggleForm()}>
              Reply
            </Comment.Action>
          </Comment.Actions>
        </Comment.Content>
        <ReplyList
          id={id}
          replies={replies}
          isFormShown={showReviewForm}
          closeForm={() => this.toggleForm()}
        />
      </Comment>
    );
  }
}

export default withRouter(MessageItem);
