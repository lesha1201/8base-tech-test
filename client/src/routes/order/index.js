import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Grid } from '@8base/boost';

import { OrderInfoCard } from './OrderInfoCard';
import { OrderProductsCard } from './OrderProductsCard';

let Order = ({ match }) => (
  <Grid.Layout gap="md" columns="1fr 3fr" stretch>
    <Grid.Box>
      <OrderInfoCard orderId={match.params.id} />
    </Grid.Box>

    <Grid.Box scrollable>
      <OrderProductsCard orderId={match.params.id} />
    </Grid.Box>
  </Grid.Layout>
);

Order.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

Order = withRouter(Order);

export { Order };
