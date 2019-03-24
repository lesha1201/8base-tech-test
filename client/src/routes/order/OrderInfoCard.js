import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { Link } from 'react-router-dom';
import { Card, Heading, Grid, Text, Loader, Link as StyledLink } from '@8base/boost';
import { Query } from 'react-apollo';
import { DateTime } from 'luxon';

import * as sharedGraphQL from 'shared/graphql';
import { EMPTY_FIELD_MESSAGE } from 'shared/constants';

let OrderInfoCard = ({ orderId }) => (
  <Query query={sharedGraphQL.ORDER_QUERY} variables={{ id: orderId }}>
    {({ data, loading }) => {
      const clientId = R.pathOr(false, ['order', 'client', 'id'], data);
      const clientName = R.pathOr(EMPTY_FIELD_MESSAGE, ['order', 'client', 'firstName'], data);

      return (
        <Card padding="md" stretch>
          <Card.Header>
            <Heading type="h4" text="Order Info" />
          </Card.Header>

          <Card.Body padding="md" stretch>
            {loading ? (
              <Loader stretch />
            ) : (
              <Grid.Layout gap="md" alignContent="start">
                <Grid.Box>
                  <Text weight="semibold">Client:</Text>
                  {clientId ? (
                    <Link className="tx-decor-none" to={`/clients/${clientId}`}>
                      <StyledLink tagName="span">{clientName}</StyledLink>
                    </Link>
                  ) : (
                    clientName
                  )}
                </Grid.Box>

                <Grid.Box>
                  <Text weight="semibold">DeliveryDt:</Text>
                  <Text>
                    {data.order && data.order.deliveryDt
                      ? DateTime.fromISO(data.order.deliveryDt).toFormat('ff')
                      : EMPTY_FIELD_MESSAGE}
                  </Text>
                </Grid.Box>

                <Grid.Box>
                  <Text weight="semibold">Address:</Text>
                  <Text>{R.pathOr(EMPTY_FIELD_MESSAGE, ['order', 'address'], data)}</Text>
                </Grid.Box>

                <Grid.Box>
                  <Text weight="semibold">Comment:</Text>
                  <Text>{R.pathOr(EMPTY_FIELD_MESSAGE, ['order', 'comment'], data)}</Text>
                </Grid.Box>

                <Grid.Box>
                  <Text weight="semibold">Status:</Text>
                  <Text>{R.pathOr(EMPTY_FIELD_MESSAGE, ['order', 'status'], data)}</Text>
                </Grid.Box>
              </Grid.Layout>
            )}
          </Card.Body>
        </Card>
      );
    }}
  </Query>
);

OrderInfoCard.propTypes = {
  orderId: PropTypes.string.isRequired,
};

export { OrderInfoCard };
