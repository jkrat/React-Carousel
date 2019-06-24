import React from 'react';
import PropTypes from 'prop-types';
import './carousel.css';
import Hammer from 'hammerjs';
import CarouselItem from './CarouselItem';

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
    const { items, title } = this.props;
    return (
      <div className="container">
        <div className="carousel">
          <div className="title-container">
            <p className="title">{title}</p>
            <div className="swiper-navigation">
              <div className="arrow-container" onClick={this.prevSlide}>
                {'<<'}
              </div>
              <div className="arrow-container next" onClick={this.nextSlide}>
                {'>>'}
              </div>
            </div>
          </div>
          <div
            className="swiper-wrapper"
            ref={this.wrapper}
            onMouseDown={this.handleClickDown}
            onMouseUp={this.handleClickUp}
            onMouseMove={this.monitorSwipe}
          >
            <div
              className="swiper-slide"
              style={{ visibilty: 'hidden' }}
              ref={this.slide}
            >
              <CarouselItem content={items[0]} />
            </div>
            {items.slice(1).map(item => (
              <div className="swiper-slide" key={item.index}>
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

export default Carousel;
