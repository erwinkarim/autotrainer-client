import React from 'react';
import {
  Col, Row,
  FormGroup, Label, InputGroup, Input, InputGroupAddon, InputGroupText,
  FormText, Jumbotron, Container, Button, CardDeck, CardBody, CardText, Card,
} from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

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
        props.companyList.sort((ca, cb) => ca.name > cb.name).map(c => (
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
  course form detaling the course info (name, modules, etc ..)
*/
const CourseForm = (props) => {
  if (props.course === undefined) {
    return (<div>Course not loaded yet ... </div>);
  }

  const bgStyling = props.bg_pic_data ?
    { backgroundImage: `url(${props.bg_pic_data})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } :
    {};
  const titleFontStyling = props.course.title_font_color ?
    { color: props.course.title_font_color } : { color: 'black' };
  let styling = Object.assign({}, bgStyling);
  styling = Object.assign(styling, titleFontStyling);

  let bgFileName = '';
  if (props.bg_handle) {
    bgFileName = (props.bg_handle instanceof Object ? props.bg_handle.name : props.bg_handle);
  }

  return (
    <div>
      <FormGroup>
        <Label>Name</Label>
        <h1 className="text-center">
          <InputGroup>
            <Input
              type="text"
              placeholder="Course Name. Should be less than 140 characters"
              className="display-3 text-center"
              style={{ fontSize: 'inherit' }}
              maxLength="140"
              id="name"
              value={props.course.name}
              onChange={props.handleChange}
            />
            <InputGroupAddon addonType="append" className="text-muted"><InputGroupText>{ 140 - props.course.name.length}</InputGroupText></InputGroupAddon>
          </InputGroup>
        </h1>
      </FormGroup>
      <FormGroup>
        <Label>Font Color</Label>
        <Input
          type="select"
          id="title_font_color"
          value={props.course.title_font_color}
          onChange={props.handleChange}
        >
          <option value="black">Black</option>
          <option value="darkslategray">Dark Slate Gray</option>
          <option value="gray">Gray</option>
          <option value="gainsboro">Gainsboro</option>
          <option value="ghostwhite">Ghost White</option>
          <option value="white">White</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label>Background Picture</Label>
        <Input type="file" placeholder="Background picture" id="bg_pic" onChange={props.handleChange} />
        <FormText color="muted">JPEG only images. Should fit in 1600x900 pixels and under 2 MB in size.</FormText>
        {
          props.course.bg_pic ? <Input disabled value={bgFileName} /> : null
        }
      </FormGroup>
      <p>Preview</p>
      <Jumbotron fluid style={styling} className="text-center">
        <Container>
          <h1 className="display-3 text-center">{props.course.name}</h1>
          { props.course.tagline !== undefined ? (<p className="lead">{props.course.tagline}</p>) : null}
          <p><Button outline color="primary">Enrol for RM{props.course.price}</Button></p>
        </Container>
      </Jumbotron>
      <FormGroup>
        <Label>Tagline</Label>
        <InputGroup>
          <Input
            type="text"
            placeholder="Tag Line. Should be less than 140 characters"
            id="tagline"
            className="lead text-center"
            maxLength="140"
            value={props.course.tagline}
            onChange={props.handleChange}
          />
          <InputGroupAddon addonType="append" className="text-muted">
            <InputGroupText>{ 140 - props.course.tagline.length }</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label>Description / Final Thoughts</Label>
        <Input className="lead" type="textarea" rows="20" id="description" value={props.course.description} onChange={props.handleChange} />
      </FormGroup>
      <FormGroup>
        <Label>Pricing</Label>
        <InputGroup>
          <InputGroupAddon addonType="prepend">RM</InputGroupAddon>
          <Input type="number" id="price" onChange={props.handleChange} value={props.course.price} />
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Label>Coupon Code</Label>
        <Input
          className="mb-2"
          placeholder="Type in your coupon code"
          id="coupons"
          onChange={props.handleChange}
          value={props.course.coupons[0].code}
        />
        <Button onClick={props.autoGenCouponCode}>Auto Generate</Button>
        <br />
        <small>
          Students can use the coupon code to instantly purchase the course.
          Restrictions: 0 or 8 to 16 alphanumeric characters only.
        </small>
      </FormGroup>
      <FormGroup>
        <Label>Key Points</Label>
        <CardDeck>
          {
            (props.course.key_points === undefined || props.course.key_points.length === 0) ?
            (<Card body><CardText>No key points configured.</CardText></Card>) :
            props.course.key_points.map((e, i) => (
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
                          onChange={props.handleChange}
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
                        onChange={props.handleChange}
                      />
                      <InputGroupAddon addonType="append" className="text-muted">
                        <InputGroupText>{ 140 - e.subtext.length }</InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                    <Button type="button" color="danger" data-position={i} onClick={props.deleteKeyPoint}><FontAwesomeIcon icon="minus" /></Button>
                  </FormGroup>
                </CardBody>
              </Card>
            ))
          }
          {
            props.enableAddKeyPoint() ?
              <Button type="button" onClick={props.newKeyPoint} disabled={!props.enableAddKeyPoint()}>New Key Points</Button> :
              null
          }
        </CardDeck>
      </FormGroup>
      <div>
        <Label>Client attendees</Label>
        <FormText>
          Select upto 6 companies that have attended this course.
          WARNING: We are not liable if you give out false information
        </FormText>
        <ClientTestimonials
          toggleCompany={props.toggleCompany}
          clientList={props.course.clientList}
        />
      </div>
      <Button color="primary" onClick={props.handleUpdateCourse} disabled={!props.validateGeneralForm()}>Update Course Setting</Button>
    </div>);
};

CourseForm.propTypes = {
  course: PropTypes.shape().isRequired,
  bg_pic_data: PropTypes.string,
  bg_handle: PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]),
  toggleCompany: PropTypes.func.isRequired,
  enableAddKeyPoint: PropTypes.func.isRequired,
  newKeyPoint: PropTypes.func.isRequired,
  handleUpdateCourse: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  deleteKeyPoint: PropTypes.func.isRequired,
  validateGeneralForm: PropTypes.func.isRequired,
  autoGenCouponCode: PropTypes.func.isRequired,
};

CourseForm.defaultProps = {
  bg_pic_data: {},
  bg_handle: {},
};

export default CourseForm;
