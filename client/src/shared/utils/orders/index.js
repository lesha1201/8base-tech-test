import * as R from 'ramda';

/**
 * Calculates total price of an order
 * @param {array} orderItems
 * @param {number} digitsCount
 */
export function getOrderTotalPrice(orderItems, digitsCount = 3) {
  const totalPrice = orderItems.reduce((acc, orderItem) => {
    const price = R.pathOr(0, ['product', 'price'], orderItem);
    const quantity = R.pathOr(0, ['quantity'], orderItem);
    return acc + price * quantity;
  }, 0);

  return parseFloat(totalPrice.toFixed(digitsCount));
}

/**
 * Calculates total price of all orders
 * @param {array} orders
 * @param {number} digitsCount
 */
export function getOrdersTotalPrice(orders, digitsCount = 3) {
  const totalPrice = orders.reduce((acc, order) => {
    const orderItems = R.pathOr([], ['orderItems', 'items'], order);
    return acc + getOrderTotalPrice(orderItems);
  }, 0);

  return parseFloat(totalPrice.toFixed(digitsCount));
}
