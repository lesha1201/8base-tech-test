import React from 'react';
import * as R from 'ramda';
import { Form, Field } from '@8base/forms';
import { Dialog, Grid, Button, DateInputField, SelectField, ModalContext, InputField } from '@8base/boost';
import { graphql, Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE, ORDER_STATUSES } from 'shared/constants';

const ORDER_EDIT_DIALOG_ID = 'ORDER_EDIT_DIALOG_ID';
const statusOptions = ORDER_STATUSES.map(status => ({
  value: status,
  label: status,
}));

class OrderEditDialog extends React.Component {
  static contextType = ModalContext;

  createOnSubmit = R.memoize(id => async data => {
    await this.props.orderUpdate({ variables: { data: { ...data, id } } });

    this.context.closeModal(ORDER_EDIT_DIALOG_ID);
  });

  onClose = () => {
    this.context.closeModal(ORDER_EDIT_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="Edit Order" onClose={this.onClose} />

      <Dialog.Body scrollable>
        <Grid.Layout gap="md" stretch>
          <Grid.Box>
            <Query query={sharedGraphQL.CLIENTS_LIST_QUERY}>
              {({ data, loading }) => (
                <Field
                  name="client"
                  label="Client"
                  placeholder="Select a client"
                  component={SelectField}
                  loading={loading}
                  options={
                    loading
                      ? []
                      : R.pathOr([], ['clientsList', 'items'], data).map(client => ({
                          value: client.id,
                          label: `${client.firstName} ${client.lastName}`,
                        }))
                  }
                  stretch
                />
              )}
            </Query>
          </Grid.Box>

          <Grid.Box>
            <Field name="address" label="Address" placeholder="9 Calypso Alley" component={InputField} stretch />
          </Grid.Box>
          <Grid.Box>
            <Field name="deliveryDt" label="DeliveryDt" component={DateInputField} withTime />
          </Grid.Box>
          <Grid.Box>
            <Field name="comment" label="Comment" placeholder="Comment" component={InputField} stretch />
          </Grid.Box>

          <Grid.Box>
            <Field
              name="status"
              label="Status"
              placeholder="Select a status"
              component={SelectField}
              options={statusOptions}
              stretch
            />
          </Grid.Box>
        </Grid.Layout>
      </Dialog.Body>

      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit" loading={submitting}>
          Save Order
        </Button>
      </Dialog.Footer>
    </form>
  );

  renderContent = ({ args }) => (
    <Form
      type="UPDATE"
      tableSchemaName="Orders"
      onSubmit={this.createOnSubmit(args.order.id)}
      initialValues={args.order}
    >
      {this.renderFormContent}
    </Form>
  );

  render() {
    return (
      <Dialog id={ORDER_EDIT_DIALOG_ID} size="sm">
        {this.renderContent}
      </Dialog>
    );
  }
}

OrderEditDialog = graphql(sharedGraphQL.ORDER_UPDATE_MUTATION, {
  name: 'orderUpdate',
  options: {
    refetchQueries: ['OrdersList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Order successfuly edited',
    },
  },
})(OrderEditDialog);

OrderEditDialog.id = ORDER_EDIT_DIALOG_ID;

export { OrderEditDialog };
