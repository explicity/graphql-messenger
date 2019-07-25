import gql from 'graphql-tag';

export const MESSAGES_QUERY = gql`
  query messagesQuery($orderBy: MessagesOrderByInput) {
    messages(orderBy: $orderBy) {
      count
      messagesList {
        id
        body
        likeCounter
        dislikeCounter
        replies {
          id
          body
        }
      }
    }
  }
`;

export const POST_MESSAGE_MUTATION = gql`
  mutation MessageMutation($body: String!) {
    postMessage(body: $body) {
      id
      body
      likeCounter
      dislikeCounter
      replies {
        id
        body
      }
    }
  }
`;

export const POST_MESSAGE_LIKE_MUTATION = gql`
  mutation MessageLikeMutation($messageId: ID!) {
    postMessageLike(messageId: $messageId) {
      id
      likeCounter
      dislikeCounter
    }
  }
`;

export const POST_MESSAGE_DISLIKE_MUTATION = gql`
  mutation MessageDislikeMutation($messageId: ID!) {
    postMessageDislike(messageId: $messageId) {
      id
      likeCounter
      dislikeCounter
    }
  }
`;

export const NEW_MESSAGES_SUBSCRIPTION = gql`
  subscription {
    newMessage {
      id
      body
      likeCounter
      dislikeCounter
      replies {
        id
        body
      }
    }
  }
`;

export const ACTION_MESSAGES_SUBSCRIPTION = gql`
  subscription {
    newMessageAction {
      id
      body
      likeCounter
      dislikeCounter
    }
  }
`;

export const POST_REPLY_MUTATION = gql`
  mutation ReplyMutation($messageId: ID!, $body: String!) {
    postReply(messageId: $messageId, body: $body) {
      id
      body
    }
  }
`;
