import React, { Component } from 'react';
import {
  Col, Row, FormGroup, Input, Label, InputGroup, InputGroupAddon,
  Button, Card, CardBody, InputGroupText, CardText, FormText, CardDeck,
} from 'reactstrap';
import PropTypes from 'prop-types';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Editor from '../Editor';

/*
 * shows which clientst that attended your course
 */
const ClientTestimonials = props => (
  <Col>
    <Row>
      {
        props.clientList.map(c => (
          <Col xs="6" md="2" key={c}>
            <img className="img-fluid img-grayscale" alt={c} src={`/logos/${c}`} />
          </Col>
        ))
      }
    </Row>
    <FormGroup check className="row p-2">
      {
        props.companyList.map(c => (
          <Label key={c.name} check className="col-6 col-md-3">
            <Input
              type="checkbox"
              name="companies[]"
              value={c.logo}
              onChange={props.toggleCompany}
              checked={props.clientList.includes(c.logo)}
            />
            {` ${c.name}`}
          </Label>
        ))
      }
    </FormGroup>
  </Col>
);

ClientTestimonials.propTypes = {
  companyList: PropTypes.arrayOf(PropTypes.shape()),
  clientList: PropTypes.arrayOf(PropTypes.string),
  toggleCompany: PropTypes.func.isRequired,
};

ClientTestimonials.defaultProps = {
  companyList: [
    { logo: '256x256 BKR-rd.png', name: 'Bank Rakyat' },
    { logo: '256x256 IIT-rd.png', name: 'Insurance Islam TAIB' },
    { logo: '256x256 KN-rd.png', name: 'Khazanah Nasional' },
    { logo: '256x256 TI-rd.png', name: 'Thanachart Insurance' },
    { logo: '256x256 TMIG-rd.png', name: 'Tokyo Marine Insurance Group' },
    { logo: '256x256 WBG-rd.png', name: 'World Bank Group' },
    { logo: 'hsbc_amanah.gif', name: 'HSBC Amanah Takaful' },
    { logo: '256x80 BankIslam.png', name: 'Bank Islam' },
    { logo: '256 HLA.png', name: 'Hong Leong Assurance' },
    { logo: '256x512 Etiqa.png', name: 'Etiqa Insurance' },
    { logo: '256x256 TuneIns.png', name: 'Tune Insurance' },
  ],
  clientList: [],
};


/*
  handles course promo things
 */
/**
 * Adds two numbers together.
 * @param {shape} file event
 * @param {shape} tab event
 * @param {shape} e event
 * @returns {JSX} the common builder
 */
class CoursePromo extends Component {
  componentDidMount = () => {
    this.editor.setEditorStateFromRaw(this.props.course.promoContent);
  }
  render = () => {
    const {
      course, handleChange, toggleCompany, enableAddKeyPoint,
      newKeyPoint, deleteKeyPoint, autoGenCouponCode, handleUpdateCourse,
      validateGeneralForm, handlePromoChange,
    } = this.props;

    return (
      <div className="mt-2">
        <p>
          This will appear in your course promotion page. Which can viewed at{' '}
          {window.location.protocol}{'//'}{window.location.host}/courses/promo/{course.courseId}
        </p>
        <div className="pricing">
          <h4>Pricing</h4>
          <hr />
          <FormGroup>
            <Label>Pricing</Label>
            <InputGroup>
              <InputGroupAddon addonType="prepend">RM</InputGroupAddon>
              <Input type="number" id="price" onChange={handleChange} value={course.price} />
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Label>Coupon Code</Label>
            <Input
              className="mb-2"
              placeholder="Type in your coupon code"
              id="coupons"
              onChange={handleChange}
              value={course.coupons[0].code}
            />
            <Button onClick={autoGenCouponCode}>Auto Generate</Button>
            <br />
            <small>
              Students can use the coupon code to instantly purchase the course.
              Restrictions: 0 or 8 to 16 alphanumeric characters only.
            </small>
          </FormGroup>
        </div>
        <div className="keypoints">
          <h4>Key Points</h4>
          <hr />
          <small>
            Key points that will appear at the begining of the course promo page.
            Should use this oppurnity to hook your potential customers into reading further.
            Hence why the wordings need to be consice but catchy. If this space is empty,
            we will use the content from your TOC description for your promotional content.
          </small>
          <FormGroup>
            <CardDeck>
              {
                (course.key_points === undefined || course.key_points.length === 0) ?
                (<Card body><CardText>No key points configured.</CardText></Card>) :
                course.key_points.map((e, i) => (
                  <Card key={i}>
                    <CardBody>
                      <FormGroup>
                        <h4>
                          <InputGroup className="mb-2">
                            <Input
                              type="text"
                              placeholder={`Title for Point ${i + 1}. Should be less than 70 characters`}
                              style={{ fontSize: 'inherit' }}
                              className="card-title text-center"
                              maxLength="70"
                              id="key_points"
                              data-position={i}
                              data-key="title"
                              value={e.title}
                              onChange={handleChange}
                            />
                            <InputGroupAddon addonType="append" className="text-muted">
                              <InputGroupText>{ 70 - e.title.length }</InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </h4>
                        <InputGroup className="mb-2">
                          <Input
                            type="textarea"
                            placeholder={`Subtext for Point ${i + 1}. Should be less than 140 characters`}
                            rows="4"
                            maxLength="140"
                            id="key_points"
                            data-position={i}
                            data-key="subtext"
                            value={e.subtext}
                            onChange={handleChange}
                          />
                          <InputGroupAddon addonType="append" className="text-muted">
                            <InputGroupText>{ 140 - e.subtext.length }</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                        <Button type="button" color="danger" data-position={i} onClick={deleteKeyPoint}><FontAwesomeIcon icon="minus" /></Button>
                      </FormGroup>
                    </CardBody>
                  </Card>
                ))
              }
              {
                enableAddKeyPoint() ?
                  <Button type="button" onClick={newKeyPoint} disabled={!enableAddKeyPoint()}>New Key Points</Button> :
                  null
              }
            </CardDeck>
          </FormGroup>
        </div>
        <div className="promocontent">
          <h4>Promotional Content</h4>
          <hr />
          <small>
            Main body of the promotional content that you want to see in the page.
            Should be detailed, but direct points telling what one will gain from the course,
            how the course is structured and expectation for potential students that will
            take this course.
          </small>
          <FormGroup>
            <Editor
              ref={(editor) => { this.editor = editor; }}
              type="textarea"
              id="promoContent"
              value={course.promoContent}
              handleBodyUpdate={handlePromoChange}
              placeholder="Type in the things that you wanted to see in the promo page"
            />
          </FormGroup>
        </div>
        <div className="testimonials">
          <h4>Clients and Testimonails</h4>
          <hr />
          <div>
            <Label>Client attendees</Label>
            <FormText>
              Select upto 6 companies that have attended this course.
              WARNING: We are not liable if you give out false information
            </FormText>
            <ClientTestimonials
              toggleCompany={toggleCompany}
              clientList={course.clientList}
            />
          </div>
        </div>
        <Button color="primary" onClick={handleUpdateCourse} disabled={!validateGeneralForm()}>Update Course Setting</Button>
      </div>
    );
  }
}

CoursePromo.propTypes = {
  course: PropTypes.shape({
    courseId: PropTypes.string.isRequired,
    promoContent: PropTypes.string.isRequired,
    clientList: PropTypes.arrayOf(PropTypes.string).isRequired,
    key_points: PropTypes.arrayOf(PropTypes.shape()).isRequired,
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    coupons: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  toggleCompany: PropTypes.func.isRequired,
  enableAddKeyPoint: PropTypes.func.isRequired,
  newKeyPoint: PropTypes.func.isRequired,
  deleteKeyPoint: PropTypes.func.isRequired,
  autoGenCouponCode: PropTypes.func.isRequired,
  handleUpdateCourse: PropTypes.func.isRequired,
  validateGeneralForm: PropTypes.func.isRequired,
  handlePromoChange: PropTypes.func.isRequired,
};

export default CoursePromo;
