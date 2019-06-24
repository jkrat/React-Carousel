import React from 'react';
import PropTypes from 'prop-types';

const CarouselItem = ({ content }) => {
  return <div className="carouselItem">{content.card}</div>;
};

CarouselItem.propTypes = {
  content: PropTypes.object.isRequired
};

export default CarouselItem;
