import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import { TableBuilder, Dropdown, Icon, Menu, withModal, Link as StyledLink } from '@8base/boost';
import { Query } from 'react-apollo';
import { DateTime } from 'luxon';

import * as sharedGraphQL from 'shared/graphql';
import { EMPTY_FIELD_MESSAGE } from 'shared/constants';
import { getOrderTotalPrice } from 'shared/utils/orders';

import { OrderCreateDialog } from './OrderCreateDialog';
import { OrderDeleteDialog } from './OrderDeleteDialog';
import { OrderEditDialog } from './OrderEditDialog';

const ORDERS_TABLE_COLUMNS = [
  { name: 'client', title: 'Client', sortEnable: false },
  { name: 'address', title: 'Address' },
  { name: 'deliveryDt', title: 'DeliveryDt' },
  { name: 'comment', title: 'Comment', sortEnable: false },
  { name: 'status', title: 'Status' },
  { name: 'totalPrice', title: 'Total Price', sortEnable: false },
  { name: 'actions', width: '60px', sortEnable: false },
];

class OrdersTable extends React.Component {
  onActionClick = () => {
    const { openModal } = this.props;
    openModal(OrderCreateDialog.id);
  };

  renderCell = (column, data) => {
    const { openModal } = this.props;

    let rendered = String(data[column.name]);

    switch (column.name) {
      case 'client': {
        const orderId = data.id;
        const clientName = R.pathOr(EMPTY_FIELD_MESSAGE, [column.name, 'firstName'], data);

        rendered = orderId ? (
          <StyledLink tagName={Link} to={`/orders/${orderId}`}>
            {clientName}
          </StyledLink>
        ) : (
          clientName
        );
        break;
      }
      case 'deliveryDt': {
        rendered = data.deliveryDt ? DateTime.fromISO(data.deliveryDt).toFormat('ff') : EMPTY_FIELD_MESSAGE;
        break;
      }
      case 'address':
      case 'comment': {
        rendered = R.pathOr(EMPTY_FIELD_MESSAGE, [column.name], data);
        break;
      }
      case 'totalPrice': {
        const items = R.pathOr([], ['orderItems', 'items'], data);
        rendered = getOrderTotalPrice(items);
        break;
      }
      case 'actions': {
        rendered = (
          <Dropdown defaultOpen={false}>
            <Dropdown.Head>
              <Icon name="More" size="sm" color="LIGHT_GRAY2" />
            </Dropdown.Head>
            <Dropdown.Body pin="right">
              {({ closeDropdown }) => (
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      openModal(OrderEditDialog.id, { order: data });
                      closeDropdown();
                    }}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      openModal(OrderDeleteDialog.id, { id: data.id });
                      closeDropdown();
                    }}
                  >
                    Delete
                  </Menu.Item>
                </Menu>
              )}
            </Dropdown.Body>
          </Dropdown>
        );
        break;
      }
      default: {
        break;
      }
    }

    return rendered;
  };

  renderTable = ({ data, loading }) => {
    const { tableState, onChange } = this.props;

    const total = R.pathOr(null, ['ordersList', 'count'], data);
    const tableData = R.pathOr([], ['ordersList', 'items'], data);
    const finalTableState = R.assocPath(['pagination', 'total'], total, tableState);

    return (
      <TableBuilder
        columns={ORDERS_TABLE_COLUMNS}
        data={tableData}
        loading={loading}
        action="Create Order"
        onActionClick={this.onActionClick}
        tableState={finalTableState}
        onChange={onChange}
        renderCell={this.renderCell}
        withPagination
      />
    );
  };

  render() {
    const { tableState } = this.props;

    const skip = (tableState.pagination.page - 1) * tableState.pagination.pageSize;
    const first = tableState.pagination.pageSize;
    const orderBy = R.propOr([], 'sort', tableState).map(({ name, order }) => `${name}_${order}`);

    return (
      <Query query={sharedGraphQL.ORDERS_LIST_QUERY} variables={{ orderBy, skip, first }}>
        {this.renderTable}
      </Query>
    );
  }
}

OrdersTable = compose(
  withModal,
  withStateHandlers(
    { tableState: { pagination: { page: 1, pageSize: 20 } } },
    {
      onChange: ({ tableState }) => value => ({
        tableState: {
          ...tableState,
          ...value,
        },
      }),
    }
  )
)(OrdersTable);

export { OrdersTable };
