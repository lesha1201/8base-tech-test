import React from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';
import { Card, Heading, Grid, Text, Loader } from '@8base/boost';
import { Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { EMPTY_FIELD_MESSAGE } from 'shared/constants';

let ClientInfoCard = ({ clientId }) => (
  <Query query={sharedGraphQL.CLIENT_QUERY} variables={{ id: clientId }}>
    {({ data, loading }) => (
      <Card padding="md" stretch>
        <Card.Header>
          <Heading type="h4" text="Client Info" />
        </Card.Header>

        <Card.Body padding="md" stretch>
          {loading ? (
            <Loader stretch />
          ) : (
            <Grid.Layout gap="md" alignContent="start">
              <Grid.Box>
                <Text weight="semibold">First name:</Text>
                <Text>{R.pathOr(EMPTY_FIELD_MESSAGE, ['client', 'firstName'], data)}</Text>
              </Grid.Box>

              <Grid.Box>
                <Text weight="semibold">Last name:</Text>
                <Text>{R.pathOr(EMPTY_FIELD_MESSAGE, ['client', 'lastName'], data)}</Text>
              </Grid.Box>

              <Grid.Box>
                <Text weight="semibold">Email:</Text>
                <Text>{R.pathOr(EMPTY_FIELD_MESSAGE, ['client', 'email'], data)}</Text>
              </Grid.Box>

              <Grid.Box>
                <Text weight="semibold">Phone:</Text>
                <Text>{R.pathOr(EMPTY_FIELD_MESSAGE, ['client', 'phone'], data)}</Text>
              </Grid.Box>

              <Grid.Box>
                <Text weight="semibold">Birthday:</Text>
                <Text>{R.pathOr(EMPTY_FIELD_MESSAGE, ['client', 'birthday'], data)}</Text>
              </Grid.Box>
            </Grid.Layout>
          )}
        </Card.Body>
      </Card>
    )}
  </Query>
);

ClientInfoCard.propTypes = {
  clientId: PropTypes.string.isRequired,
};

export { ClientInfoCard };
