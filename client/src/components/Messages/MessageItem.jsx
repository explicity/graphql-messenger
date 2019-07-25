import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { Comment, Icon } from 'semantic-ui-react';

import ReplyList from '../Replies/ReplyList.jsx';

import { POST_MESSAGE_LIKE_MUTATION, POST_MESSAGE_DISLIKE_MUTATION, MESSAGES_QUERY } from '../../queries';

const MessageItem = ({ id, body, replies, likeCounter, dislikeCounter }) => {
  const [showReviewForm, toggleForm] = useState(false);

  const _updateStoreAfterAction = (store, action) => {
    const orderBy = 'createdAt_DESC';
    const data = store.readQuery({
      query: MESSAGES_QUERY,
      variables: {
        orderBy
      }
    });

    const currentMessage = data.messages.messagesList.find(
      item => item.id === id
    );
    currentMessage.likeCounter = action.likeCounter;
    currentMessage.dislikeCounter = action.dislikeCounter;
    console.log(currentMessage);

    console.log('data: ', data);
    store.writeQuery({
      query: MESSAGES_QUERY,
      data
    });
  };
  return (
    <Comment>
      <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/christian.jpg' />
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
          <Comment.Action onClick={() => toggleForm(!showReviewForm)}>Reply</Comment.Action>
        </Comment.Actions>
      </Comment.Content>
      <ReplyList id={id} replies={replies} isFormShown={showReviewForm} closeForm={() => toggleForm(!showReviewForm)} />
    </Comment>
  );
};

export default MessageItem;
