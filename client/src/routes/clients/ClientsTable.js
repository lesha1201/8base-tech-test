import React from 'react';
import { compose, withStateHandlers } from 'recompose';
import { Link } from 'react-router-dom';
import * as R from 'ramda';
import { TableBuilder, Dropdown, Icon, Menu, withModal, Link as StyledLink } from '@8base/boost';
import { Query } from 'react-apollo';

import * as sharedGraphQL from 'shared/graphql';
import { EMPTY_FIELD_MESSAGE } from 'shared/constants';

import { ClientCreateDialog } from './ClientCreateDialog';
import { ClientDeleteDialog } from './ClientDeleteDialog';
import { ClientEditDialog } from './ClientEditDialog';

const CLIENTS_TABLE_COLUMNS = [
  { name: 'firstName', title: 'First Name' },
  { name: 'lastName', title: 'Last Name' },
  { name: 'email', title: 'Email' },
  { name: 'phone', title: 'Phone' },
  { name: 'birthday', title: 'Birthday' },
  { name: 'actions', width: '60px', sortEnable: false },
];

class ClientsTable extends React.Component {
  onActionClick = () => {
    const { openModal } = this.props;
    openModal(ClientCreateDialog.id);
  };

  renderCell = (column, data) => {
    const { openModal } = this.props;

    let rendered = String(data[column.name]);

    switch (column.name) {
      case 'firstName': {
        const clientId = data.id;
        const clientName = R.pathOr(EMPTY_FIELD_MESSAGE, [column.name, 'firstName'], data);

        rendered = clientId ? (
          <Link className="tx-decor-none" to={`/client/${clientId}`}>
            <StyledLink tagName="span">{clientName}</StyledLink>
          </Link>
        ) : (
          clientName
        );
        break;
      }
      case 'lastName':
      case 'email':
      case 'phone':
      case 'birthday': {
        rendered = R.pathOr(EMPTY_FIELD_MESSAGE, [column.name], data);
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
                      openModal(ClientEditDialog.id, { client: data });
                      closeDropdown();
                    }}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      openModal(ClientDeleteDialog.id, { id: data.id });
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

    const total = R.pathOr(null, ['clientsList', 'count'], data);
    const tableData = R.pathOr([], ['clientsList', 'items'], data);
    const finalTableState = R.assocPath(['pagination', 'total'], total, tableState);

    return (
      <TableBuilder
        columns={CLIENTS_TABLE_COLUMNS}
        data={tableData}
        loading={loading}
        action="Create Client"
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
      <Query query={sharedGraphQL.CLIENTS_LIST_QUERY} variables={{ orderBy, skip, first }}>
        {this.renderTable}
      </Query>
    );
  }
}

ClientsTable = compose(
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
)(ClientsTable);

export { ClientsTable };
