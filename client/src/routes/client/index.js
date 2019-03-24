import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Grid } from '@8base/boost';

import { ClientInfoCard } from './ClientInfoCard';
import { ClientOrdersCard } from './ClientOrdersCard';

let Client = ({ match }) => (
  <Grid.Layout gap="md" columns="1fr 3fr" stretch>
    <Grid.Box>
      <ClientInfoCard clientId={match.params.id} />
    </Grid.Box>

    <Grid.Box scrollable>
      <ClientOrdersCard clientId={match.params.id} />
    </Grid.Box>
  </Grid.Layout>
);

Client.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

Client = withRouter(Client);

export { Client };
