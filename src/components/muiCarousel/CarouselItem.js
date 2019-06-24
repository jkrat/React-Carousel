import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  carouselItem: {
    minHeight: 100,
    transition: 'all .2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)'
    }
  }
});

const CarouselItem = ({ content }) => {
  const classes = useStyles();
  return <div className={classes.carouselItem}>{content.card}</div>;
};

CarouselItem.propTypes = {
  content: PropTypes.object.isRequired
};

export default CarouselItem;
