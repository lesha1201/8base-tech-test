import React from 'react';
import * as R from 'ramda';
import { Form, Field, Fieldset, FieldArray } from '@8base/forms';
import { Dialog, Grid, Icon, Button, DateInputField, SelectField, ModalContext, InputField } from '@8base/boost';
import { graphql, Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE, ORDER_STATUSES } from 'shared/constants';

const ORDER_CREATE_DIALOG_ID = 'ORDER_CREATE_DIALOG_ID';
const statusOptions = ORDER_STATUSES.map(status => ({
  value: status,
  label: status,
}));

class OrderCreateDialog extends React.Component {
  static contextType = ModalContext;

  initialValues = {
    orderItems: [{}],
  };

  onSubmit = async data => {
    await this.props.orderCreate({ variables: { data } });

    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  onClose = () => {
    this.context.closeModal(ORDER_CREATE_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="New Order" onClose={this.onClose} />

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

          <Query query={sharedGraphQL.PRODUCTS_LIST_QUERY}>
            {({ data, loading }) => (
              <FieldArray name="orderItems">
                {({ fields }) => (
                  <React.Fragment>
                    {fields.map((name, index) => (
                      <Grid.Box key={name}>
                        <Fieldset tableSchemaName="OrderItems">
                          <Grid.Layout gap="sm" columns="2fr 1fr auto" alignItems="end" stretch>
                            <Grid.Box>
                              <Field
                                name={`${name}.product`}
                                label="Product"
                                placeholder="Select a product"
                                component={SelectField}
                                loading={loading}
                                options={
                                  loading
                                    ? []
                                    : R.pathOr([], ['productsList', 'items'], data).map(product => ({
                                        value: product.id,
                                        label: `${product.name}`,
                                      }))
                                }
                                stretch
                              />
                            </Grid.Box>
                            <Grid.Box>
                              <Field
                                name={`${name}.quantity`}
                                label="Quantity"
                                placeholder="Qnt."
                                type="number"
                                component={InputField}
                                stretch
                              />
                            </Grid.Box>
                            <Grid.Box>
                              <Button
                                squared
                                type="button"
                                size="sm"
                                color="danger"
                                onClick={() => fields.remove(index)}
                              >
                                <Icon name="Trashcan" />
                              </Button>
                            </Grid.Box>
                          </Grid.Layout>
                        </Fieldset>
                      </Grid.Box>
                    ))}

                    <Grid.Box>
                      <Button type="button" size="sm" color="primary" onClick={() => fields.push({})}>
                        Add product
                      </Button>
                    </Grid.Box>
                  </React.Fragment>
                )}
              </FieldArray>
            )}
          </Query>

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
          Create Order
        </Button>
      </Dialog.Footer>
    </form>
  );

  render() {
    return (
      <Dialog id={ORDER_CREATE_DIALOG_ID} size="sm">
        <Form type="CREATE" tableSchemaName="Orders" onSubmit={this.onSubmit} initialValues={this.initialValues}>
          {this.renderFormContent}
        </Form>
      </Dialog>
    );
  }
}

OrderCreateDialog = graphql(sharedGraphQL.ORDER_CREATE_MUTATION, {
  name: 'orderCreate',
  options: {
    refetchQueries: ['OrdersList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Order successfuly created',
    },
  },
})(OrderCreateDialog);

OrderCreateDialog.id = ORDER_CREATE_DIALOG_ID;

export { OrderCreateDialog };
