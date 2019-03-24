import React from 'react';
import { Form, Field } from '@8base/forms';
import { Dialog, Button, DateInputField, ModalContext, InputField, Column } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

const CLIENT_CREATE_DIALOG_ID = 'CLIENT_CREATE_DIALOG_ID';

class ClientCreateDialog extends React.Component {
  static contextType = ModalContext;

  onSubmit = async data => {
    await this.props.clientCreate({ variables: { data } });

    this.context.closeModal(CLIENT_CREATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(CLIENT_CREATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="New Client" onClose={this.onClose} />

      <Dialog.Body scrollable>
        <Column gap="md" stretch>
          <Field name="firstName" label="First Name" placeholder="First Name" component={InputField} stretch />
          <Field name="lastName" label="Last Name" placeholder="Last Name" component={InputField} stretch />
          <Field name="email" label="Email" placeholder="email@8base.com" component={InputField} stretch />
          <Field name="phone" label="Phone" placeholder="+7 (999) 898 99 88" component={InputField} stretch />
          <Field name="birthday" label="Birthday" component={DateInputField} />
        </Column>
      </Dialog.Body>

      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit" loading={submitting}>
          Create Client
        </Button>
      </Dialog.Footer>
    </form>
  );

  render() {
    return (
      <Dialog id={CLIENT_CREATE_DIALOG_ID} size="sm">
        <Form type="CREATE" tableSchemaName="Clients" onSubmit={this.onSubmit}>
          {this.renderFormContent}
        </Form>
      </Dialog>
    );
  }
}

ClientCreateDialog = graphql(sharedGraphQL.CLIENT_CREATE_MUTATION, {
  name: 'clientCreate',
  options: {
    refetchQueries: ['ClientsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Client successfuly created',
    },
  },
})(ClientCreateDialog);

ClientCreateDialog.id = CLIENT_CREATE_DIALOG_ID;

export { ClientCreateDialog };
