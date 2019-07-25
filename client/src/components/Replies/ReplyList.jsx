import React, { Component } from 'react';
import { Comment, Form, Button, Header } from 'semantic-ui-react';

import ReplyItem from './ReplyItem.jsx';
import ReplyForm from './ReplyForm.jsx';

const ReplyList = ({ id, isFormShown, closeForm, replies }) => {
  return (
    <React.Fragment>
      <Comment.Group>
        {replies.length > 0 && (
          <Header as="h4" dividing>
            Replies
          </Header>
        )}
        {replies.map(item => (
          <ReplyItem key={item.id} {...item} />
        ))}
      </Comment.Group>
      {isFormShown && (
        <React.Fragment>
          <ReplyForm messageId={id} closeForm={closeForm} />
          <Button
            content="Close form"
            icon="close"
            secondary
            onClick={closeForm}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ReplyList;
