import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { Table } from '@8base/boost';

import { EMPTY_FIELD_MESSAGE } from 'shared/constants';

import { ProductImage } from '../products/ProductImage';

const OrderProductsTable = ({ products, loading }) => (
  <Table>
    <Table.Header columns="repeat(5, 1fr) 60px">
      <Table.HeaderCell>Picture</Table.HeaderCell>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Description</Table.HeaderCell>
      <Table.HeaderCell>Price</Table.HeaderCell>
      <Table.HeaderCell>Quantity</Table.HeaderCell>
    </Table.Header>

    <Table.Body loading={loading} data={products}>
      {({ id, product, quantity }) => (
        <Table.BodyRow columns="repeat(5, 1fr) 60px" key={id}>
          <Table.BodyCell>
            <ProductImage imageUrl={R.pathOr(undefined, ['picture', 'downloadUrl'], product)} />
          </Table.BodyCell>
          <Table.BodyCell>{R.pathOr(EMPTY_FIELD_MESSAGE, ['name'], product)}</Table.BodyCell>
          <Table.BodyCell>{R.pathOr(EMPTY_FIELD_MESSAGE, ['description'], product)}</Table.BodyCell>
          <Table.BodyCell>{R.pathOr(EMPTY_FIELD_MESSAGE, ['price'], product)}</Table.BodyCell>
          <Table.BodyCell>{quantity || 0}</Table.BodyCell>
        </Table.BodyRow>
      )}
    </Table.Body>
  </Table>
);

OrderProductsTable.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export { OrderProductsTable };
