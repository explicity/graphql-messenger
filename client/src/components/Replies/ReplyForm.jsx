import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Form, Button } from 'semantic-ui-react';

import { POST_REPLY_MUTATION, MESSAGES_QUERY } from '../../queries';

class ReplyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      body: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const { value } = event.target;
    this.setState({
      body: value
    });
  }

  render() {
    const { messageId } = this.props;
    const { body } = this.state;

    const _updateStoreAfterAddingReview = (store, newReply, messageId) => {
      const orderBy = 'createdAt_DESC';
      const data = store.readQuery({
        query: MESSAGES_QUERY,
        variables: {
          orderBy
        }
      });
      const reviewedProduct = data.messages.messagesList.find(
        item => item.id === messageId
      );
      reviewedProduct.replies.push(newReply);
      store.writeQuery({ query: MESSAGES_QUERY, data });
      this.props.closeForm()
    };

    return (
      <Form reply>
        <Form.TextArea onChange={this.handleChange} />
        <Mutation
          mutation={POST_REPLY_MUTATION}
          variables={{ messageId, body }}
          update={(store, { data: { postReply } }) => {
            _updateStoreAfterAddingReview(store, postReply, messageId);
          }}
        >
          {postMutation => (
            <Button
              content="Add Reply"
              labelPosition="left"
              icon="edit"
              primary
              onClick={postMutation}
            />
          )}
        </Mutation>
      </Form>
    );
  }
}

export default ReplyForm;
