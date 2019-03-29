import gql from 'graphql-tag';

/* Clients */
export const CLIENT_CREATE_MUTATION = gql`
  mutation ClientCreate($data: ClientCreateInput!) {
    clientCreate(data: $data) {
      id
    }
  }
`;

export const CLIENT_DELETE_MUTATION = gql`
  mutation ClientDelete($id: ID!) {
    clientDelete(data: { id: $id }) {
      success
    }
  }
`;

export const CLIENT_UPDATE_MUTATION = gql`
  mutation ClientUpdate($data: ClientUpdateInput!) {
    clientUpdate(data: $data) {
      id
    }
  }
`;

export const CLIENT_QUERY = gql`
  query Client($id: ID!) {
    client(id: $id) {
      id
      firstName
      lastName
      email
      phone
      birthday
    }
  }
`;

export const CLIENT_ORDERS_LIST_QUERY = gql`
  query Client($id: ID!) {
    client(id: $id) {
      id
      orders {
        items {
          id
          address
          deliveryDt
          comment
          status
          orderItems {
            items {
              id
              product {
                id
                name
                price
              }
              quantity
            }
          }
        }
      }
    }
  }
`;

export const CLIENTS_LIST_QUERY = gql`
  query ClientsList($orderBy: [ClientOrderBy], $skip: Int, $first: Int) {
    clientsList(orderBy: $orderBy, skip: $skip, first: $first) {
      items {
        id
        firstName
        lastName
        email
        phone
        birthday
      }
      count
    }
  }
`;

/* Orders */
export const ORDER_CREATE_MUTATION = gql`
  mutation OrderCreate($data: OrderCreateInput!) {
    orderCreate(data: $data) {
      id
    }
  }
`;

export const ORDER_DELETE_MUTATION = gql`
  mutation OrderDelete($id: ID!) {
    orderDelete(data: { id: $id }) {
      success
    }
  }
`;

export const ORDER_UPDATE_MUTATION = gql`
  mutation OrderUpdate($data: OrderUpdateInput!) {
    orderUpdate(data: $data) {
      id
    }
  }
`;

export const ORDER_QUERY = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      address
      deliveryDt
      comment
      status
      client {
        id
        firstName
      }
    }
  }
`;

export const ORDER_PRODUCTS_LIST_QUERY = gql`
  query Order($id: ID!) {
    order(id: $id) {
      id
      orderItems {
        items {
          id
          product {
            id
            name
            price
            picture {
              id
              downloadUrl
            }
          }
          quantity
        }
      }
    }
  }
`;

export const ORDERS_LIST_QUERY = gql`
  query OrdersList($orderBy: [OrderOrderBy], $skip: Int, $first: Int) {
    ordersList(orderBy: $orderBy, skip: $skip, first: $first) {
      items {
        id
        client {
          id
          firstName
        }
        address
        deliveryDt
        comment
        status
        orderItems {
          items {
            id
            product {
              id
              price
            }
            quantity
          }
        }
      }
      count
    }
  }
`;

/* Products */
export const PRODUCT_CREATE_MUTATION = gql`
  mutation ProductCreate($data: ProductCreateInput!) {
    productCreate(data: $data) {
      id
    }
  }
`;

export const PRODUCT_DELETE_MUTATION = gql`
  mutation ProductDelete($id: ID!) {
    productDelete(data: { id: $id }) {
      success
    }
  }
`;

export const PRODUCT_UPDATE_MUTATION = gql`
  mutation ProductUpdate($data: ProductUpdateInput!) {
    productUpdate(data: $data) {
      id
    }
  }
`;

export const PRODUCTS_LIST_QUERY = gql`
  query ProductsList($orderBy: [ProductOrderBy], $skip: Int, $first: Int) {
    productsList(orderBy: $orderBy, skip: $skip, first: $first) {
      items {
        id
        picture {
          id
          downloadUrl
        }
        name
        description
        price
      }
      count
    }
  }
`;
