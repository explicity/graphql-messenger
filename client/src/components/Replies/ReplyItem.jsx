import React from 'react';

import { Comment } from 'semantic-ui-react';

const ReplyItem = ({ id, body }) => {
  return (
    <Comment>
      <Comment.Avatar
        as="a"
        src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg"
      />
      <Comment.Content>
        <Comment.Author as="a">
          #{id.slice(id.length - 4, id.length - 1)}
        </Comment.Author>

        <Comment.Text>{body}</Comment.Text>
      </Comment.Content>
    </Comment>
  );
};

export default ReplyItem;
