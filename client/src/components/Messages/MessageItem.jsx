import React from 'react';
import { Mutation } from 'react-apollo';
import { Comment, Icon } from 'semantic-ui-react';

import { POST_MESSAGE_LIKE_MUTATION, POST_MESSAGE_DISLIKE_MUTATION, MESSAGES_QUERY } from '../../queries';

const MessageItem = ({ id, body, likeCounter, dislikeCounter }) => {
    
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
  console.log('likeCounter: ', likeCounter);
  return (
    <Comment>
      <Comment.Content>
        <Comment.Author>
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
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  );
};

export default MessageItem;
