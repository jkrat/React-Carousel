import React from 'react';
import { makeStyles } from '@material-ui/styles';
import MuiCarousel from './components/muiCarousel';
import Carousel from './components/carousel';
import Card from './Card';

const useStyles = makeStyles(theme => ({
  body: {
    fontSize: 16
  },
  app: {
    height: 1200,
    background: '#5884b6'
  },
  block: {
    overflow: 'hidden'
  },
  section: {
    marginTop: '1rem',
    marginBottom: '2rem',
    [theme.breakpoints.up('md')]: {
      marginTop: '2rem'
    }
  }
}));

const App = () => {
  const classes = useStyles();
  const getCards = length => {
    let list = [];
    for (let i = 0; i < length; i++) {
      list.push({
        index: i,
        card: <Card />
      });
    }
    return list;
  };

  return (
    <div className={classes.app}>
      <div className={classes.block}>
        <div className={classes.section}>
          <MuiCarousel items={getCards(8)} title="Recipe Cards" />
        </div>
      </div>
    </div>
  );
};

export default App;
