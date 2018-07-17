import React, { Component } from 'react';
import {
  Container, Row, Col, Card, CardTitle, CardText, Jumbotron, Button,
  FormGroup, Input,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';
import Notice from '../components/Notice';

/*
 * course enrolment form
 * 1. checks enrolment status
 * 2. presents users w/ 2 choice, purchase through coupon or cc
 * 3. if course already enrol, just show link to course TOC
 });
 */

/*
  * handeling enrolment sign-up / payment
  * 1. coupon code: if enter coupon code, and ok, send message and refesh
        the page to update enrolment status
  * 2. credit card: somehow use api to validate payment, etc and update
        enrolment status
  * 3. contact author: maybe later
  */

const CouponCard = () => (
  <Col xs="12" md="6" className="mb-2">
    <Card body>
      <CardTitle>Coupon</CardTitle>
      <CardText>Enrol using coupon code</CardText>
      <FormGroup>
        <Input />
      </FormGroup>
      <Button color="primary">Send Code</Button>
    </Card>
  </Col>
);

const CreditCard = () => (
  <Col xs="12" md="6" className="mb-2">
    <Card body>
      <CardTitle>Credit Card</CardTitle>
      <CardText>Enrol using CC</CardText>
      <FormGroup>
        <Input className="mb-2" placeholder="Name on Credit Card" />
        <Input className="mb-2" placeholder="Credit Card Number" />
        <Input className="mb-2" placeholder="CCV" />
        <Input className="mb-2" placeholder="expiration date" />
      </FormGroup>
      <Button color="primary">Purchase</Button>
    </Card>
  </Col>
);

/**
 * Adds two numbers together.
 * @param {int} e The first number.
 * @param {int} courseId The first number.
 * @returns {int} The sum of the two numbers.
 */
export default class EnrolCourse extends Component {
  /**
   * Adds two numbers together.
   * @param {shape} props The props
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      course: null,
      enrolment: null,
    };
  }
  componentDidMount = async () => {
    // load basic coourse info
    try {
      const results = await this.getCourse();
      this.setState({ course: results, isLoading: false });
    } catch (e) {
      console.log('error loading course');
      console.log(e);
    }

    // check enrolment
    try {
      const results = await this.getEnrolmentStatus();
      this.setState({ enrolment: results });
    } catch (e) {
      console.log('error loading enrolment');
      console.log(e);
    }
  }
  getCourse = () => {
    const courseId = this.props.match.params.id;
    console.log(`requesting courseId ${courseId}`);
    return invokeApig({ path: `/courses/${courseId}` });
  }
  getEnrolmentStatus = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    path: `/enrolment/${this.props.match.params.id}`,
  })
  render = () => {
    const { isAuthenticated } = this.props;
    const { isLoading, course, enrolment } = this.state;

    if (!isAuthenticated) {
      return <Notice content="Unauthenticated" />;
    }

    if (isLoading) {
      return <Notice content="Loading ..." />;
    }

    const body = (enrolment === undefined || enrolment === null) ? (
      <Row>
        <Col xs="12">
          <p>You may enrol into {course.name} via those two methods :-</p>
        </Col>
        <CouponCard {...this.props} />
        <CreditCard {...this.props} />
      </Row>
    ) : (
      <Row>
        <Col>
          <p>Congratulations, you have enrolled in {course.name}. </p>
          <Button color="primary" tag={Link} to={`/courses/toc/${course.courseId}`}>Continue to Table of Contents</Button>
        </Col>
      </Row>
    );

    // doing the styling
    const bgStyling = this.state.course.bg_pic ?
      { backgroundImage: `url(${this.state.course.bg_pic})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } :
      null;
    const titleFontStyling = this.state.course.title_font_color ?
      { color: this.state.course.title_font_color } : { color: 'black' };
    let styling = Object.assign({}, bgStyling);
    styling = Object.assign(styling, titleFontStyling);

    const frame = (
      <div className="mb-2">
        <Helmet>
          <title>Enroling {course.name} - {config.site_name}</title>
        </Helmet>
        <Jumbotron fluid style={styling}>
          <Container>
            <h4 className="display-3">Enroling { course.name }</h4>
          </Container>
        </Jumbotron>
        <Container className="mt-2">
          { body }
        </Container>
      </div>
    );

    return frame;
  }
}

EnrolCourse.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  isAuthenticated: PropTypes.bool,
};

EnrolCourse.defaultProps = {
  isAuthenticated: false,
};
