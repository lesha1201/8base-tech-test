import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { Card, Heading, Text } from '@8base/boost';
import { Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { getOrderTotalPrice } from 'shared/utils/orders';

import { OrderProductsTable } from './OrderProductsTable';

const OrderProductsCard = ({ orderId }) => (
  <Query query={sharedGraphQL.ORDER_PRODUCTS_LIST_QUERY} variables={{ id: orderId }}>
    {({ data, loading }) => {
      const products = R.pathOr([], ['order', 'orderItems', 'items'], data);

      return (
        <Card padding="md" stretch>
          <Card.Header>
            <Heading type="h4" text="Order Products" />
          </Card.Header>

          <Card.Section padding="md">
            <Text weight="semibold">Total: </Text>
            <Text>{getOrderTotalPrice(products)}</Text>
          </Card.Section>

          <Card.Body padding="none" stretch scrollable>
            <OrderProductsTable products={products} loading={loading} />
          </Card.Body>
        </Card>
      );
    }}
  </Query>
);

OrderProductsCard.propTypes = {
  orderId: PropTypes.string.isRequired,
};

export { OrderProductsCard };
