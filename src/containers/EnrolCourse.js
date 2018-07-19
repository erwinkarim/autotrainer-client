import React, { Component } from 'react';
import {
  Container, Row, Col, Card, CardTitle, CardText, Jumbotron, Button,
  FormGroup, Input, Label, Form,
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

const CouponCard = props => (
  <Col xs="12" md="6" className="mb-2">
    <Card body>
      <CardTitle>Coupon</CardTitle>
      <CardText>Enrol using coupon code</CardText>
      <FormGroup>
        <Input placeholder="Enter Coupon Code" id="couponCode" value={props.paymentInfo.couponCode} onChange={props.hadndleFormChange} />
      </FormGroup>
      <Button
        color="primary"
        onClick={props.handleCouponPurchase}
        disabled={props.paymentInfo.couponCode.length === 0}
      >
        Send Code
      </Button>
    </Card>
  </Col>
);

CouponCard.propTypes = {
  handleCouponPurchase: PropTypes.func.isRequired,
  hadndleFormChange: PropTypes.func.isRequired,
  paymentInfo: PropTypes.shape().isRequired,
};

const CreditCard = () => (
  <Col xs="12" md="6" className="mb-2">
    <Card body>
      <CardTitle>Credit Card</CardTitle>
      <CardText>Enrol using CC</CardText>
      <FormGroup>
        <Input className="mb-2" placeholder="Name on Credit Card" />
        <Input className="mb-2" placeholder="Credit Card Number" />
      </FormGroup>
      <Form inline>
        <FormGroup className="mr-2 mb-2 w-100">
          <Label className="mr-2">CCV</Label>
          <Input className="mb-2" placeholder="CCV" />
        </FormGroup>
        <FormGroup className="mr-2 mb-2">
          <Label className="mr-2">Expiration Date</Label>
          <Input type="select" className="mr-2">
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(e => <option key={e}>{e}</option>)
            }
          </Input>
          <Input type="select" className="mr-2">
            {
              [2018, 2019, 2020, 2021, 2022, 2023].map(e => <option key={e}>{e}</option>)
            }
          </Input>
        </FormGroup>
      </Form>
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
      paymentInfo: {
        couponCode: '',
        nameOnCard: '',
        cardNumber: '',
        cardCCV: '',
        cardExpMonth: 1,
        cardExpYear: 2018,
      }
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
  purchaseCourse = body => invokeApig({
    method: 'POST',
    path: `/courses/${this.props.match.params.id}/purchase`,
    body,
  })
  hadndleFormChange = (e) => {
    const newPaymentInfo = this.state.paymentInfo;
    if (e.target.id === 'couponCode') {
      newPaymentInfo[e.target.id] = e.target.value.toUpperCase();
    } else {
      newPaymentInfo[e.target.id] = e.target.value;
    }
    this.setState({ paymentInfo: newPaymentInfo });
  }
  handleCouponPurchase = async () => {
    console.log('should handle coupon purchase');
    try {
      const result = await this.purchaseCourse({
        method: 'coupon',
        code: this.state.paymentInfo.couponCode,
      });

      // a successful result will give an enrolment obj
      this.setState({
        enrolment: result,
      });
      // if successful, update enrolment ,etc hahaha
    } catch (e) {
      console.log('error when buying a course through coupon');
      console.log(e);
    }
  }
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
        <CouponCard
          {...this.props}
          {...this.state}
          handleCouponPurchase={this.handleCouponPurchase}
          hadndleFormChange={this.hadndleFormChange}
        />
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
