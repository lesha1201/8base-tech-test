import React from 'react';
import * as R from 'ramda';
import { Form, Field } from '@8base/forms';
import { Dialog, Button, ModalContext, InputField, Column } from '@8base/boost';
import { graphql } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { TOAST_SUCCESS_MESSAGE } from 'shared/constants';
import { FileInputField } from 'shared/components';

const PRODUCT_EDIT_DIALOG_ID = 'PRODUCT_EDIT_DIALOG_ID';

class ProductEditDialog extends React.Component {
  static contextType = ModalContext;

  createOnSubmit = R.memoize(id => async data => {
    await this.props.productUpdate({ variables: { data: { ...data, id } } });

    this.context.closeModal(PRODUCT_EDIT_DIALOG_ID);
  });

  onClose = () => {
    this.context.closeModal(PRODUCT_EDIT_DIALOG_ID);
  };

  renderFormContent = ({ handleSubmit, invalid, submitting, pristine }) => (
    <form onSubmit={handleSubmit}>
      <Dialog.Header title="Edit Product" onClose={this.onClose} />

      <Dialog.Body scrollable>
        <Column gap="md" stretch>
          <Field name="picture" label="Picture" component={FileInputField} maxFiles={1} public={true} />
          <Field name="name" label="Name" placeholder="Name" component={InputField} stretch />
          <Field name="description" label="Description" placeholder="Description" component={InputField} stretch />
          <Field name="price" label="Price" placeholder="120.00" type="number" component={InputField} stretch />
        </Column>
      </Dialog.Body>

      <Dialog.Footer>
        <Button color="neutral" variant="outlined" disabled={submitting} onClick={this.onClose}>
          Cancel
        </Button>
        <Button color="primary" type="submit" loading={submitting}>
          Save Product
        </Button>
      </Dialog.Footer>
    </form>
  );

  renderContent = ({ args }) => (
    <Form
      type="UPDATE"
      tableSchemaName="Products"
      onSubmit={this.createOnSubmit(args.product.id)}
      initialValues={args.product}
    >
      {this.renderFormContent}
    </Form>
  );

  render() {
    return (
      <Dialog id={PRODUCT_EDIT_DIALOG_ID} size="sm">
        {this.renderContent}
      </Dialog>
    );
  }
}

ProductEditDialog = graphql(sharedGraphQL.PRODUCT_UPDATE_MUTATION, {
  name: 'productUpdate',
  options: {
    refetchQueries: ['ProductsList'],
    context: {
      [TOAST_SUCCESS_MESSAGE]: 'Product successfuly edited',
    },
  },
})(ProductEditDialog);

ProductEditDialog.id = PRODUCT_EDIT_DIALOG_ID;

export { ProductEditDialog };
