import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Form, Button } from 'semantic-ui-react';

import { POST_MESSAGE_MUTATION, MESSAGES_QUERY } from '../../queries';

const LINKS_PER_PAGE = 5;
class MessageForm extends Component {
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
    const { body } = this.state;

    return (
      <Form reply>
        <Form.TextArea onChange={this.handleChange} />
        <Mutation
          mutation={POST_MESSAGE_MUTATION}
          variables={{ body }}
          update={(store, { data: { postMessage } }) => {
            const first = LINKS_PER_PAGE;
            const skip = 0;
            const orderBy = 'createdAt_DESC';
            const data = store.readQuery({
              query: MESSAGES_QUERY,
              variables: { first, skip, orderBy }
            });

            data.messages.messagesList.unshift(postMessage);
            data.messages.count++;
            store.writeQuery({
              query: MESSAGES_QUERY,
              data,
              variables: { first, skip, orderBy }
            });
          }}
          onCompleted={() => this.props.history.push('/new/1')}
        >
          {postMutation => (
            <Button
              content="Add Message"
              labelPosition="left"
              onClick={postMutation}
              icon="edit"
              primary
            />
          )}
        </Mutation>
      </Form>
    );
  }
}

export default MessageForm;
