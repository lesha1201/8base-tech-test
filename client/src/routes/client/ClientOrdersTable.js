import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { Link } from 'react-router-dom';
import { Table, Link as StyledLink } from '@8base/boost';
import { DateTime } from 'luxon';

import { EMPTY_FIELD_MESSAGE } from 'shared/constants';
import { getOrderTotalPrice } from 'shared/utils/orders';

const ClientOrdersTable = ({ orders, loading }) => (
  <Table>
    <Table.Header columns="repeat(5, 1fr) 60px">
      <Table.HeaderCell>Address</Table.HeaderCell>
      <Table.HeaderCell>DeliveryDt</Table.HeaderCell>
      <Table.HeaderCell>Comment</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
      <Table.HeaderCell>Total Price</Table.HeaderCell>
    </Table.Header>

    <Table.Body loading={loading} data={orders}>
      {order => {
        const orderId = R.pathOr(false, ['id'], order);
        const address = R.pathOr(EMPTY_FIELD_MESSAGE, ['address'], order);
        const orderItems = R.pathOr([], ['orderItems', 'items'], order);

        return (
          <Table.BodyRow columns="repeat(5, 1fr) 60px" key={order.id}>
            <Table.BodyCell>
              {orderId ? (
                <StyledLink tagName={Link} to={`/orders/${orderId}`}>
                  {address}
                </StyledLink>
              ) : (
                address
              )}
            </Table.BodyCell>
            <Table.BodyCell>
              {order.deliveryDt ? DateTime.fromISO(order.deliveryDt).toFormat('ff') : EMPTY_FIELD_MESSAGE}
            </Table.BodyCell>
            <Table.BodyCell>{R.pathOr(EMPTY_FIELD_MESSAGE, ['comment'], order)}</Table.BodyCell>
            <Table.BodyCell>{R.pathOr(EMPTY_FIELD_MESSAGE, ['status'], order)}</Table.BodyCell>
            <Table.BodyCell>{getOrderTotalPrice(orderItems)}</Table.BodyCell>
          </Table.BodyRow>
        );
      }}
    </Table.Body>
  </Table>
);

ClientOrdersTable.propTypes = {
  orders: PropTypes.array.isRequired,
  loading: PropTypes.bool,
};

export { ClientOrdersTable };
