import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { Form, Button } from 'semantic-ui-react';

import { POST_REPLY_MUTATION, MESSAGES_QUERY } from '../../queries';
import { MESSAGES_PER_PAGE } from '../../constants/messages';
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
      const isNewPage = this.props.location.pathname.includes('new');
      const page = parseInt(this.props.match.params.page, 10);
      const skip = isNewPage ? (page - 1) * MESSAGES_PER_PAGE : 0;
      const first = isNewPage ? MESSAGES_PER_PAGE : 100;

      const data = store.readQuery({
        query: MESSAGES_QUERY,
        variables: { first, skip, orderBy }
      });

      const reviewedProduct = data.messages.messagesList.find(
        item => item.id === messageId
      );

      const exist = reviewedProduct.replies.find(
        reply => reply.id === newReply.id
      );

      if (!exist) {
        reviewedProduct.replies.push(newReply);
      }

      store.writeQuery({
        query: MESSAGES_QUERY,
        data,
        variables: { first, skip, orderBy }
      });
      this.props.closeForm();
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
              disabled={!body}
              onClick={postMutation}
            />
          )}
        </Mutation>
      </Form>
    );
  }
}

export default withRouter(ReplyForm);
