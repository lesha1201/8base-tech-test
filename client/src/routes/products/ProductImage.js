import React from 'react';
import PropTypes from 'prop-types';

const ProductImage = ({ imageUrl }) => <img src={imageUrl} alt="Product" style={{ width: '5rem', height: '5rem' }} />;

ProductImage.propTypes = {
  imageUrl: PropTypes.string,
};

ProductImage.defaultProps = {
  imageUrl: 'https://www.unesale.com/ProductImages/Large/notfound.png',
};

export { ProductImage };
