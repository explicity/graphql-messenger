import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Form, Button } from 'semantic-ui-react';

import { POST_MESSAGE_MUTATION, MESSAGES_QUERY } from '../../queries';

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
    })
}

  render() {
    const { body } = this.state;
    console.log('body: ', body);

    const _updateStoreAfterAddingMessage = (store, newMessage) => {
      const orderBy = 'createdAt_DESC';
      const data = store.readQuery({
        query: MESSAGES_QUERY,
        variables: {
          orderBy
        }
      });

      data.messages.messagesList.unshift(newMessage);
      data.messages.count++;

      store.writeQuery({
        query: MESSAGES_QUERY,
        data
      });
    };

    return (
      <Form reply>
        <Form.TextArea onChange={this.handleChange} />
        <Mutation
          mutation={POST_MESSAGE_MUTATION}
          variables={{ body }}
          update={(store, { data: { postMessage } }) => {
            _updateStoreAfterAddingMessage(store, postMessage);
          }}
          onCompleted={() => this.props.history.push('/')}
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
