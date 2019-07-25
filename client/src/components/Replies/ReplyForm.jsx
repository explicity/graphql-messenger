import React, { Component } from 'react';

class ReplyForm extends Component {
  render() {
    return (
      <Form reply>
        <Form.TextArea />
        <Button content="Add Reply" labelPosition="left" icon="edit" primary />
      </Form>
    );
  }
}

export default ReplyForm;
