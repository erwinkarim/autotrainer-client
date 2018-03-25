import React, { Component } from 'react';
import { Container, Row, Col, FormGroup, Input, Button } from 'reactstrap';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import Notice from '../components/Notice';
import config from '../config';
import { invokeApig } from '../libs/awsLibs';
import './CertCheck.css';

const Cert = (props) => {
  const dateHandle = new Date(props.cert.certIssued);
  return (
    <div className="cert cert-background d-flex align-items-center justify-content-center flex-column">
      <div className="py-4"><h2>CERTIFICATE OF COMPLETION</h2></div>
      <div className="cert-text py-4">This certifies that</div>
      <div className="pb-4">{props.cert.actualname}</div>
      <div className="cert-text pb-4">has completed the short course entitled</div>
      <div className="pb-4"><strong>{props.cert.coursename.toUpperCase()}</strong></div>
      <div className="pb-4"><img className="cert-logo" src="/logos/learn.part1.png" alt="learn@AP" /></div>
      <div className="w-80 d-flex justify-content-between  pb-4">
        <span className="cert-text col-4 pt-4"><small>{props.cert.certId}</small></span>
        <span className="col-4" />
        <span className="cert-text col-4 pt-4">{`${dateHandle.toLocaleString('en-us', { day: 'numeric', month: 'long', year: 'numeric' })}`}</span>
      </div>
    </div>
  );
};

Cert.propTypes = {
  cert: PropTypes.shape({
    certId: PropTypes.string,
    actualname: PropTypes.string,
    coursename: PropTypes.string,
    courseowner: PropTypes.string,
    certIssued: PropTypes.number,
  }).isRequired,
};

Cert.defaultProps = {
  cert: {
    actualname: 'FirstName LastName',
    coursename: 'The CourseName',
    courseowner: 'CourseOwner',
    certIssued: Date.now(),
  },
};

/**
 * Display the cert
 * @param {int} e The second number.
 * @param {int} prevProps The first number.
 * @param {int} prevState The second number.
 * @returns {int} The sum of the two numbers.
 */
export default class CertCheck extends Component {
  /**
   * Display the cert
   * @param {int} props The second number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      certNo: '',
      cert: null,
      checking: false,
      checked: false,
      found: false,
    };
  }
  componentDidMount = () => {
    if (this.props.isAuthenticated) {
      this.retrieveCertFromUrl();
    }
  }
  componentDidUpdate = async (prevProps) => {
    /*
      get the cert info
      1. after authenticated is done
      2. authenticated state changed from false to true
      3. there's a certNo in the current url params
    */
    if (!prevProps.isAuthenticated && this.props.isAuthenticated) {
      console.log('prevProps.isAuthenticated', prevProps.isAuthenticated);
      console.log('this.props.isAuthenticated', this.props.isAuthenticated);

      this.retrieveCertFromUrl();
    }
  }
  retrieveCertFromUrl = async () => {
    const urlState = new URL(window.location.href);
    const certNo = urlState.searchParams.get('certNo');

    if (certNo) {
      try {
        await this.setState({ certNo, checking: true, found: false });
        const result = await this.checkCert();
        if (result) {
          this.setState({ found: true, cert: result });
        }
      } catch (e) {
        console.log(e);
      }
      this.setState({ checking: false, checked: true });
    }
  }
  handleCheckCert = async () => {
    this.setState({ checking: true, found: false });
    this.props.history.push(`/verify_cert?certNo=${this.state.certNo}`);

    // re-write the url
    try {
      const result = await this.checkCert();
      if (result) {
        this.setState({ found: true, cert: result });
      }
    } catch (err) {
      console.log('error cert lookup');
      console.log(err);
    }

    // always happens
    this.setState({ checking: false, checked: true });
  }
  checkCert = () => invokeApig({
    endpoint: config.apiGateway.ENROLMENT_URL,
    method: 'POST',
    path: '/enrolment/cert_lookup',
    queryParams: { certId: this.state.certNo },
  })
  enableBtn = () => (this.state.certNo.length > 0 || !this.state.checking)
  render = () => {
    // check if authenticated
    if (this.props.currentUser === null) {
      return (<Notice title="Unauthenticated" content="Please log in to verify certificate" />);
    }

    let CheckingState = null;
    if (this.state.checking) {
      CheckingState = (<Notice content={`Checking certificate ${this.state.certNo} ...`} />);
    } else if (this.state.checked) {
      if (this.state.found) {
        CheckingState = (<Cert cert={this.state.cert} />);
      } else {
        CheckingState = (<Notice content={`Certificate ${this.state.certNo} not found ...`} />);
      }
    }

    return (
      <Container className="mt-3">
        <Helmet>
          <title>Verify Certificate - {config.site_name}</title>
        </Helmet>
        <Row>
          <Col xs="12" className="text-left">
            <h3>Verify a Certificate</h3>
            <p>All certificates issued by learn@AP have a unique identification number</p>
            <p>To verify a certificate, please key in the ID number below</p>
          </Col>
          <Col xs="12">
            <FormGroup>
              <Input
                type="text"
                placeholder="Certificate No."
                value={this.state.certNo}
                onChange={
                  (e) => {
                    this.setState({ certNo: e.target.value, found: false, checked: false });
                  }
                }
              />
            </FormGroup>
            <p className="text-center">
              <Button color="primary" onClick={this.handleCheckCert} disabled={!this.enableBtn()}>
                { this.state.checking ? 'Verifying' : 'Verify'}
              </Button>
            </p>
          </Col>
          <Col xs="12">{ CheckingState }</Col>
        </Row>
      </Container>
    );
  }
}

CertCheck.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  history: PropTypes.shape.isRequired,
  currentUser: PropTypes.shape.isRequired,
};
