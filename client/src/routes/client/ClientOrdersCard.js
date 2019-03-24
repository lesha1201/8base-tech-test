import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { Card, Heading, Text } from '@8base/boost';
import { Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { getOrdersTotalPrice } from 'shared/utils/orders';

import { ClientOrdersTable } from './ClientOrdersTable';

const ClientOrdersCard = ({ clientId }) => (
  <Query query={sharedGraphQL.CLIENT_ORDERS_LIST_QUERY} variables={{ id: clientId }}>
    {({ data, loading }) => {
      const orders = R.pathOr([], ['client', 'orders', 'items'], data);

      return (
        <Card padding="md" stretch>
          <Card.Header>
            <Heading type="h4" text="Client Orders" />
          </Card.Header>

          <Card.Section padding="md">
            <Text weight="semibold">Orders total: </Text>
            <Text>{getOrdersTotalPrice(orders)}</Text>
          </Card.Section>

          <Card.Body padding="none" stretch scrollable>
            <ClientOrdersTable orders={orders} loading={loading} />
          </Card.Body>
        </Card>
      );
    }}
  </Query>
);

ClientOrdersCard.propTypes = {
  clientId: PropTypes.string.isRequired,
};

export { ClientOrdersCard };
