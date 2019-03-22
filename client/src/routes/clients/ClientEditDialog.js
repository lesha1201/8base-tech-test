import React from 'react';
import * as R from 'ramda';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, DateInputField, ModalContext, InputField, Column } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';

const CLIENT_EDIT_DIALOG_ID = 'CLIENT_EDIT_DIALOG_ID';

class ClientEditDialog extends React.Component {
  static contextType = ModalContext;

  createOnSubmit = R.memoize(id => async data => {
    await this.props.clientUpdate({ variables: { data: { ...data, id } } });

    this.context.closeModal(CLIENT_EDIT_DIALOG_ID);
  });

  onClose = () => {
    this.context.closeModal(CLIENT_EDIT_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="New Client" onClose={this.onClose} />
      <Dialog.Body scrollable>
        <Grid.Layout gap="sm" stretch>
          <Grid.Box>
            <Column gap="md">
              <Field name="firstName" label="First Name" placeholder="First Name" component={InputField} stretch />
              <Field name="lastName" label="Last Name" placeholder="Last Name" component={InputField} stretch />
              <Field name="email" label="Email" placeholder="email@8base.com" component={InputField} stretch />
              <Field name="phone" label="Phone" placeholder="+7 (999) 898 99 88" component={InputField} stretch />
              <Field name="birthday" label="Birthday" placeholder="Birthday" component={DateInputField} />
            </Column>
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>
      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit" loading={submitting}>
          Save Client
        </Button>
      </Dialog.Footer>
    </form>
  );

  renderContent = ({ args }) => (
    <Form
      type="CREATE"
      tableSchemaName="Clients"
      onSubmit={this.createOnSubmit(args.client.id)}
      initialValues={args.client}
    >
      {this.renderFormContent}
    </Form>
  );

  render() {
    return (
      <Dialog id={CLIENT_EDIT_DIALOG_ID} size="sm">
        {this.renderContent}
      </Dialog>
    );
  }
}

ClientEditDialog = graphql(sharedGraphQL.CLIENT_UPDATE_MUTATION, {
  name: 'clientUpdate',
  options: {
    refetchQueries: ['ClientsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Client successfuly edited',
    },
  },
})(ClientEditDialog);

ClientEditDialog.id = CLIENT_EDIT_DIALOG_ID;

export { ClientEditDialog };
