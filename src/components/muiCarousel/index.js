import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import Hammer from 'hammerjs';
import CarouselItem from './CarouselItem';

const styles = theme => ({
  container: {
    padding: '0 2rem',
    maxWidth: 900,
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      padding: '0 4rem'
    }
  },
  carousel: {
    [theme.breakpoints.up('md')]: {
      padding: '0 2.5rem'
    }
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 20
  },
  title: {
    fontSize: theme.spacing(3)
  },
  swiperNavigation: {
    display: 'none',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  arrowContainer: {
    cursor: 'pointer',
    width: theme.spacing(6),
    height: theme.spacing(5)
  },
  nextArrow: {
    marginLeft: theme.spacing(3)
  },
  swiperWrapper: {
    marginTop: theme.spacing(2),
    display: 'flex',
    transform: 'translate3d(0px, 0px, 0px)',
    transitionDuration: '0ms'
  },
  swiperSlide: {
    marginRight: theme.spacing(5),
    flexShrink: 0,
    width: '90%',
    [theme.breakpoints.up('sm')]: {
      width: 'inherit'
    }
  }
});

class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.wrapper = React.createRef();
    this.slide = React.createRef();
    this.state = {
      slideWidth: null,
      clickStatus: false,
      mousePosition: 0,
      slidesTransform: 0,
      slidesPosition: 0
    };

    this.handleClickDown = this.handleClickDown.bind(this);
    this.handleClickUp = this.handleClickUp.bind(this);
    this.monitorSwipe = this.monitorSwipe.bind(this);
    this.prevSlide = this.prevSlide.bind(this);
    this.nextSlide = this.nextSlide.bind(this);
  }

  prevSlide() {
    const newPosition = this.getNewPosition(
      this.state.slidesPosition + this.state.slideWidth
    );
    this.positionSlides(newPosition);
    this.setState({
      slidesTransform: newPosition,
      slidesPosition: newPosition
    });
  }

  nextSlide() {
    const newPosition = this.getNewPosition(
      this.state.slidesPosition - this.state.slideWidth
    );
    this.positionSlides(newPosition);
    this.setState({
      slidesTransform: newPosition,
      slidesPosition: newPosition
    });
  }

  componentDidMount() {
    this.setState({
      slideWidth: Math.round(
        this.slide.current.getBoundingClientRect().width + 40
      )
    });
    this.hammerTime = new Hammer(this.wrapper.current);
    this.hammerTime.on('swipeleft', this.nextSlide);
    this.hammerTime.on('swiperight', this.prevSlide);
  }

  componentWillUnmount() {
    this.hammerTime.off('swipeleft', this.nextSlide);
    this.hammerTime.off('swiperight', this.prevSlide);
  }

  handleClickDown(e) {
    this.wrapper.current.style.transitionDuration = '0ms';
    this.setState({ clickStatus: true, mousePosition: e.clientX });
  }

  handleClickUp() {
    this.wrapper.current.style.transitionDuration = '600ms';
    this.setState({ clickStatus: false });

    const newPosition = this.getNewPosition(
      Math.round(this.state.slidesTransform / this.state.slideWidth) *
        this.state.slideWidth
    );

    this.setState({
      slidesTransform: newPosition,
      slidesPosition: newPosition
    });
    this.moveSlides(newPosition);
  }

  getNewPosition(positionValue) {
    if (positionValue >= 0) {
      return 0;
    } else if (
      positionValue <=
      this.state.slideWidth * -(this.props.items.length - 1)
    ) {
      return this.state.slideWidth * -(this.props.items.length - 1);
    } else {
      return positionValue;
    }
  }

  monitorSwipe(e) {
    if (this.state.clickStatus) {
      let xDiff = e.clientX - this.state.mousePosition;
      this.moveSlides(this.state.slidesPosition + xDiff);
      this.setState({
        slidesTransform: this.state.slidesPosition + xDiff
      });
    }
  }

  moveSlides(location) {
    this.wrapper.current.style.transform = `translate3d(${location}px, 0px, 0px)`;
  }

  positionSlides(location) {
    this.wrapper.current.style.transitionDuration = '600ms';
    this.wrapper.current.style.transform = `translate3d(${location}px, 0px, 0px)`;
  }

  render() {
    const { classes, items, title } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.carousel}>
          <div className={classes.titleContainer}>
            <p className={classes.title}>{title}</p>
            <div className={classes.swiperNavigation}>
              <div className={classes.arrowContainer} onClick={this.prevSlide}>
                {'<<'}
              </div>
              <div
                className={classNames(
                  classes.arrowContainer,
                  classes.nextArrow
                )}
                onClick={this.nextSlide}
              >
                {'>>'}
              </div>
            </div>
          </div>
          <div
            className={classes.swiperWrapper}
            ref={this.wrapper}
            onMouseDown={this.handleClickDown}
            onMouseUp={this.handleClickUp}
            onMouseMove={this.monitorSwipe}
          >
            <div
              className={classes.swiperSlide}
              style={{ visibilty: 'hidden' }}
              ref={this.slide}
            >
              <CarouselItem content={items[0]} />
            </div>
            {items.slice(1).map(item => (
              <div className={classes.swiperSlide} key={item.index}>
                <CarouselItem content={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Carousel.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string
};

export default withStyles(styles)(Carousel);
