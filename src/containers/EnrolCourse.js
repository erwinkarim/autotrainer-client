import React, { Component } from 'react';
import {
  Container, Row, Col, Card, CardTitle, CardText, Jumbotron, Button,
  FormGroup, Input, Label,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { Auth, API } from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react';

import config from '../config';
import { invokeApig } from '../libs/awsLibs';
import Notice from '../components/Notice';
import LoginBox from '../components/LoginBox';

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
  * 4. free enrolment: if you invited and the course is free. allow free enrolment
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

/*
  present but disable for now to provide future direction.
  Implement this when you have a payment gateway solution.
*/
const CreditCard = () => (
  <Col xs="12" md="6" className="mb-2">
    <Card body>
      <CardTitle>Credit Card</CardTitle>
      <CardText>Enrol using CC</CardText>
      <FormGroup>
        <Input disabled className="mb-2" placeholder="Name on Credit Card" />
        <Input disabled className="mb-2" placeholder="Credit Card Number" />
      </FormGroup>
      <FormGroup row className="mb-2">
        <Label sm={6}>CCV</Label>
        <Col sm={6}>
          <Input disabled className="mb-2" placeholder="CCV" />
        </Col>
      </FormGroup>
      <FormGroup row className="mb-2">
        <Label sm={6}>Expiration Date</Label>
        <Col sm={3}>
          <Input disabled type="select">
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(e => <option key={e}>{e}</option>)
            }
          </Input>
        </Col>
        <Col sm={3}>
          <Input disabled type="select">
            {
              [2018, 2019, 2020, 2021, 2022, 2023].map(e => <option key={e}>{e}</option>)
            }
          </Input>
        </Col>
      </FormGroup>
      <Button color="primary" disabled>Purchase</Button>
    </Card>
  </Col>
);

const FreeEnrolment = props => (
  <Col xs="12" md="6" className="mb-2">
    <Card body>
      <CardText>
        Click below to enrol in this free course.
      </CardText>
      <Button color="primary" onClick={props.handleFreeEnrolment}>Enrol</Button>
    </Card>
  </Col>
);

FreeEnrolment.propTypes = {
  handleFreeEnrolment: PropTypes.func.isRequired,
};

/**
 * Adds two numbers together.
 * @param {int} body The first number.
 * @param {int} e The first number.
 * @param {int} courseId The first number.
 * @returns {int} The sum of the two numbers.
 */
class EnrolCourse extends Component {
  /**
   * Adds two numbers together.
   * @param {shape} props The props
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      isLoading: true,
      course: null,
      enrolment: null,
      invited: false,
      paymentInfo: {
        couponCode: '',
        nameOnCard: '',
        cardNumber: '',
        cardCCV: '',
        cardExpMonth: 1,
        cardExpYear: 2018,
      },
    };
  }
  componentDidMount = async () => {
    const courseId = this.props.match.params.id;

    // get currentUser
    Auth.currentAuthenticatedUser()
      .then((cu) => {
        console.log('cu', cu);
        this.setState({ currentUser: cu });

        // check if i'm invited
        API.get('default', '/enrolment/invited', { queryStringParameters: { email: this.state.currentUser.email } })
          .then((response) => {
            this.setState({
              invited:
                response.reduce((c, v) => c || (v.courseId === this.state.course.courseId), false),
            });
          })
          .catch((err) => {
            console.log('error getting course', err);
          });
      })
      .catch((err) => {
        console.log('error getting user', err);
      });

    // load basic coourse info
    API.get('default', `/courses/${courseId}`)
      .then((response) => {
        this.setState({ course: response, isLoading: false });
      })
      .catch((err) => {
        console.log('error getting course', err);
      });

    // check enrolment
    API.get('default', `/enrolment/${courseId}`)
      .then((response) => {
        this.setState({ enrolment: response, isLoading: false });
      })
      .catch((err) => {
        console.log('error getting course', err);
      });


    /*
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

    // check if i'm invited
    try {
      const results = await this.checkInvitation();
      this.setState({
        invited: results.reduce((c, v) => c || (v.courseId === this.state.course.courseId), false),
      });
    } catch (e) {
      console.log('error checking invitation');
      console.log(e);
    }
    */
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
  checkInvitation = () => invokeApig({
    path: '/enrolment/invited',
    queryParams: { email: this.props.currentUser.email },
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

    API.post('default', `/courses/${this.props.match.params.id}/purchase`, {
      body: { method: 'coupon', code: this.state.paymentInfo.couponCode },
    })
      .then((response) => {
        this.setState({ enrolment: response });
      })
      .catch((err) => {
        console.log('error when buying a course through coupon');
        console.log(err);
      });

    /*
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
    */
  }
  handleFreeEnrolment = async () => {
    API.post('default', `/courses/${this.props.match.params.id}/purchase`, {
      body: { method: 'invitedFree', email: this.state.currentUser.email },
    })
      .then((response) => {
        this.setState({ enrolment: response });
      })
      .catch((err) => {
        console.log('error when buying a course through coupon');
        console.log(err);
      });

    /*
    try {
      const result = await this.purchaseCourse({
        method: 'invitedFree',
        email: this.props.currentUser.email,
      });

      // successfully enroled
      this.setState({ enrolment: result });
    } catch (e) {
      console.log('error when trying to enrol');
      console.log(e);
    }
    */
  }
  render = () => {
    const {
      isLoading, course, enrolment, invited, currentUser,
    } = this.state;

    if (!currentUser) {
      return <LoginBox {...this.props} />;
    }

    if (course === null) {
      return <Notice content="Course is loading" />;
    }
    /*
    const { isAuthenticated } = this.props;

    if (!isAuthenticated) {
      return <LoginBox {...this.props} />;
    }
    */

    if (isLoading) {
      return <Notice content="Loading ..." />;
    }

    if (course.status !== 'published') {
      return <Notice content="Course not yet published" />;
    }

    let body = null;
    if ((invited || parseInt(course.price, 10) === 0) && (enrolment === undefined || enrolment === null)) {
      // the enrolment is not recorded and the course is free
      body = (
        <Row>
          <FreeEnrolment {...this.state} handleFreeEnrolment={this.handleFreeEnrolment} />
        </Row>
      );
    } else if (enrolment === undefined || enrolment === null) {
      body = (
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
      );
    } else {
      // enrolment is defined
      body = (
        <Row>
          <Col>
            <p>Congratulations, you have enrolled in {course.name}. </p>
            <Button color="primary" tag={Link} to={`/courses/toc/${course.courseId}`}>Continue to Table of Contents</Button>
          </Col>
        </Row>
      );
    }

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

export default withAuthenticator(EnrolCourse);
