/* ============================================================================
This is a carousel component
============================================================================ */
import React, { Component } from "react";
import { Carousel, Row, Col } from "antd";

export default class CarouselComponent extends Component {
  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
  }
  next() {
    this.carousel.next();
  }
  previous() {
    this.carousel.prev();
  }

  render() {
    return (
      <div id="carousel-container">
        <Carousel autoplay={false}>
          <Row justify="center">
            <Col span={12}>
              <div style={{ float: "left", backgroundColor: "pink" }}>
                Number 1
              </div>
            </Col>
            <Col span={12}>
              <div style={{ float: "right", backgroundColor: "blue" }}>
                Number 2
              </div>
            </Col>
          </Row>
          <Col span={10}>
            <div style={{ backgroundColor: "pink" }}>Number 3</div>
          </Col>
          <Col span={12}>
            <div style={{ backgroundColor: "blue" }}>Number 4</div>
          </Col>
        </Carousel>
      </div>
    );
  }
}
