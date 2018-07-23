import React, { Component } from 'react';
import {
  Container, Row, Col, Nav, NavItem, NavLink, TabContent,
  TabPane, Jumbotron, FormGroup, Label, InputGroup, Input, InputGroupAddon,
  InputGroupText, Button, FormText, CardDeck, Card, CardBody, CardText,
} from 'reactstrap';
import classnames from 'classnames';
import toTitleCase from 'titlecase';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { invokeApig, s3Upload, s3Delete } from '../libs/awsLibs';
import Notice from '../components/Notice';
import './CourseBuilder.css';
import config from '../config';
import CoursePromo from '../components/CourseBuilder/CoursePromo';
import CourseUsers from '../components/CourseBuilder/CourseUsers';
import CourseModules from '../components/CourseBuilder/CourseModules';

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

/*
  forms to update the course options / publication status
 */
const CourseOptions = (props) => {
  const { course } = props;
  const courseOptions = course.courseOptions ? course.courseOptions : {
    showOneByOne: false,
  };

  return (
    <div>
      <FormGroup>
        <Label>Publication Status</Label>
        <Input type="select" id="status" value={course.status} onChange={props.handleChange}>
          <option value="unpublished">Not Published</option>
          <option value="published">Published</option>
        </Input>
      </FormGroup>
      <FormGroup check>
        <Label check>
          <Input
            type="checkbox"
            id="courseOptions"
            name="showOneByOne"
            onChange={props.handleChange}
            value={courseOptions.showOneByOne}
            checked={courseOptions.showOneByOne}
          />
          Show chapters one-by-one
          <small className="text-muted"> Students only see the current and next unread chapter in their TOC.</small>
        </Label>
      </FormGroup>
      <Button className="mt-2" color="primary" onClick={props.handleUpdateCourse}>Update course options</Button>
    </div>
  );
};

CourseOptions.propTypes = {
  course: PropTypes.shape().isRequired,
  handleChange: PropTypes.func.isRequired,
  handleUpdateCourse: PropTypes.func.isRequired,
};

// filter coupon code
const couponCodeFilter = code => code
  .toUpperCase()
  .split('')
  .filter(c => c.match(/[A-Z0-9]/))
  .join('')
  .substring(0, 16);

/**
 * Adds two numbers together.
 * @param {shape} file event
 * @param {shape} tab event
 * @param {shape} e event
 * @returns {JSX} the common builder
 */
export default class CourseBuilder extends Component {
  /**
   * Adds two numbers together.
   * @param {shape} props object
   * @returns {JSX} the common builder
   */
  constructor(props) {
    super(props);
    this.state = {
      settingActiveTab: 'general',
      userDropdownOpen: false,
      course: null,
      loading: true,
      bg_handle: null,
      bg_pic_data: null,
    };
  }
  componentDidMount = async () => {
    // load the course
    const handle = this;
    try {
      const result = await this.getCourse();
      result.tagline = result.tagline === undefined || result.tagline === null ? '' : result.tagline;
      result.key_points =
        result.key_points === undefined || result.key_points === null ? [] : result.key_points;
      result.bg_pic = result.bg_pic === undefined || result.bg_pic === null ? '' : result.bg_pic;
      result.bg_key = result.bg_key === undefined || result.bg_key === null ? '' : result.bg_key;
      result.clientList =
        result.clientList === undefined || result.clientList === null ? [] : result.clientList;
      result.coupons =
        result.coupons === undefined || result.coupons === null ? [{ code: '', discount: 100.0 }] : result.coupons;

      if (result != null) {
        handle.setState({ course: result, loading: false });
      }

      // setup the picture preview
      if (this.state.course.bg_pic !== null && this.state.course.bg_pic !== '') {
        // course.bg_pic should be a string
        this.setState({ bg_handle: this.state.course.bg_pic });
        this.updatePicture(this.state.course.bg_pic);
      }
    } catch (e) {
      console.log(e);
    }
  }
  getCourse = () => invokeApig({ path: `/courses/${this.props.match.params.courseId}` })
  toggleCompany = (e) => {
    // update company list
    if (e.target.value !== undefined) {
      // add if not there, delete if it's there
      const newCourse = this.state.course;
      const newCoList = newCourse.clientList;
      if (newCoList.includes(e.target.value)) {
        newCoList.splice(newCoList.findIndex(elm => elm === e.target.value), 1);
      } else {
        newCoList.push(e.target.value);
      }

      // if more than 8, slice the first element
      if (newCoList.length > 6) {
        newCoList.splice(0, 1);
      }

      newCourse.clientList = newCoList;
      this.setState({ course: newCourse });
    }
  }
  toggle = (tab) => {
    if (this.state.settingActiveTab !== tab) {
      this.setState({ settingActiveTab: tab });
    }
  }
  autoGenCouponCode = () => {
    console.log('auto generate coupon code');
    const newCourse = this.state.course;
    newCourse.coupons = [{ code: couponCodeFilter(uuid.v4()), discount: 100.0 }];

    this.setState({ course: newCourse });
  }
  handleUpdateCourse = async (e) => {
    e.preventDefault();
    const handle = this;

    // upload new file
    if (handle.state.bg_handle instanceof Object) {
      // delete old one, upload new one

      let oldKey = null;

      if (handle.state.course.bg_pic !== null) {
        oldKey = handle.state.course.bg_key;
      }

      // upload new file
      try {
        const newFile = await s3Upload(handle.state.bg_handle);
        handle.state.course.bg_pic = newFile.Location;
        handle.state.course.bg_key = newFile.key;
        if (oldKey) {
          // delete old file if applicable
          await s3Delete(oldKey);
        }
        handle.setState({ bg_handle: newFile.Location });
      } catch (err) {
        console.log('error uploading new file');
        console.error(err);
        return;
      }
    }

    console.log('should send updates on new course settings');
    try {
      await this.updateCourse();
      // so annoying when doing multple updates ...
      // this.props.history.push(`/courses/promo/${this.state.course.courseId}`);
      this.props.addNotification('Course updated ...');
    } catch (err) {
      console.log(err);
    }
  }
  updateCourse = () => invokeApig({
    path: `/courses/${this.props.match.params.courseId}`,
    method: 'PUT',
    body: this.state.course,
  })
  handleChange = (e) => {
    const newCourse = this.state.course;
    const handle = this;

    console.log('e.target.id', e.target.id);
    // either handle key points or others
    if (e.target.id === 'key_points') {
      newCourse[e.target.id][parseInt(e.target.dataset.position, 10)][e.target.dataset.key] =
        e.target.dataset.key === 'title' ? toTitleCase(e.target.value) :
          e.target.value;
    } else if (e.target.id === 'courseOptions') {
      // build courseOptions if there isn't one
      if (!newCourse.courseOptions) {
        newCourse.courseOptions = {};
      }

      if (e.target.type === 'checkbox') {
        // build the course option default value if there isn't one
        if (newCourse.courseOptions[e.target.name]) {
          newCourse.courseOptions[e.target.name] = !newCourse.courseOptions[e.target.name];
        } else {
          newCourse.courseOptions[e.target.name] = true;
        }
      } else {
        newCourse.courseOptions[e.target.name] = e.target.value;
      }
      console.log('e.target.type', e.target.type);
      console.log('e.target.name', e.target.name);
    } else if (e.target.id === 'coupons') {
      // coupon code must be alphanumric capital letters
      // newCourse[e.target.id] = (e.target.value).toUpperCase();
      newCourse[e.target.id] = [{ code: couponCodeFilter(e.target.value), discount: 100.0 }];
    } else {
      // all others
      newCourse[e.target.id] =
        e.target.id === 'name' ? toTitleCase(e.target.value) :
          e.target.value;
    }

    // additional checks if the target id is bg_pic
    // load as datastream
    if (e.target.id === 'bg_pic') {
      // do nothing if files are undefined
      if (e.target.files[0] === undefined || e.target.files[0] === null) {
        return;
      }

      if (e.target.files[0].size > 1024 * 1024 * 2) {
        console.log('file too big');
        this.props.addNotification('File size too big', 'danger');
        return;
      }

      if (e.target.files[0].type !== 'image/jpeg') {
        console.log('must be image file');
        this.props.addNotification('File is not an image', 'danger');
        return;
      }

      // handle the file
      handle.setState({ bg_handle: e.target.files[0] });
      handle.updatePicture(e.target.files[0]);
    }

    this.setState({ course: newCourse });
  }
  updatePicture = (file) => {
    const handle = this;
    if (file instanceof Object) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handle.setState({ bg_pic_data: reader.result });
      };
      reader.readAsDataURL(file);
      return;
    }

    // think it's a string
    handle.setState({ bg_pic_data: file });
  }
  validateGeneralForm = () => {
    // validate the general form
    const titleNotEmpty = this.state.course.name.length > 0;
    const descriptionNotEmpty = this.state.course.description.length > 0;
    const priceNotEmpty = this.state.course.price !== '';
    const keyPointsNotEmpty =
      (this.state.course.key_points === undefined || this.state.course.key_points === null ?
        true : (
          this.state.course.key_points.reduce((v, e) =>
            v && (e.title.length > 0 && e.subtext.length > 0), true)
        ));

    return titleNotEmpty && descriptionNotEmpty && priceNotEmpty && keyPointsNotEmpty;
  }
  newKeyPoint = () => {
    const newCourse = this.state.course;
    const keyPoint = { title: '', subtext: '' };
    if (newCourse.key_points === undefined) {
      newCourse.key_points = [keyPoint];
    } else {
      newCourse.key_points.push(keyPoint);
    }
    this.setState({ course: newCourse });
  }
  deleteKeyPoint = (e) => {
    const newCourse = this.state.course;
    newCourse.key_points.splice(parseInt(e.target.dataset.position, 10), 1);
    this.setState(newCourse);
  }
  enableAddKeyPoint = () => {
    if (this.state.course.key_points === undefined) {
      return true;
    }
    return this.state.course.key_points.length < 3;
  }
  render = () => {
    if (this.state.loading) {
      return <Notice content="Loading course ..." />;
    }

    // user is authenticated
    if (!this.props.isAuthenticated) {
      return (<Notice content="User is not authenticated." />);
    }

    // you need to be admin to see this for now
    if (!this.props.currentUser['cognito:groups'].includes('admin')) {
      return <Notice content="You need to be admin to manage a course" />;
    }

    // course has been loaded
    if (this.state.course === null) {
      // return note('Course is note loaded yet ...')
      return (<Notice content="Course is not loaded yet ..." />);
    }

    /*
      userId in dynamoDb is identity pool id *which links to user pool id*, but
      what we only got is user pool id
    console.log("currentUser", this.props.currentUser);
    console.log("course.userId", this.state.course.userId);
    console.log("cognito:username", this.props.currentUser["cognito:username"]);
    if(this.state.course.userId !== this.props.currentUser["cognito:username"]){
      return (<Notice title="Unauthorized" content="You can't access this resource" />);
    }
    */

    return (
      <div className="mt-2 text-left">
        <Helmet>
          <title>Course Builder for {this.state.course.name} - {config.site_name}</title>
        </Helmet>
        <Row className="mb-2">
          <Col xs="12">
            <h3>Course Settings</h3>
            <hr />
          </Col>
          <Col xs="12">
            <Nav tabs className="d-flex justify-content-center">
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.settingActiveTab === 'general' })}
                  onClick={() => { this.toggle('general'); }}
                >General
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.settingActiveTab === 'promo_page' })}
                  onClick={() => { this.toggle('promo_page'); }}
                >Promo Page
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.settingActiveTab === 'pub_status' })}
                  onClick={() => { this.toggle('pub_status'); }}
                >Options
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.settingActiveTab === 'users' })}
                  onClick={() => { this.toggle('users'); }}
                >Users
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.settingActiveTab}>
              <TabPane tabId="general">
                <CourseForm
                  {...this.state}
                  handleChange={this.handleChange}
                  enableAddKeyPoint={this.enableAddKeyPoint}
                  newKeyPoint={this.newKeyPoint}
                  handleUpdateCourse={this.handleUpdateCourse}
                  deleteKeyPoint={this.deleteKeyPoint}
                  validateGeneralForm={this.validateGeneralForm}
                  toggleCompany={this.toggleCompany}
                  autoGenCouponCode={this.autoGenCouponCode}
                />
              </TabPane>
              <TabPane tabId="promo_page">
                <CoursePromo
                  {...this.state}
                  {...this.props}
                  handleChange={this.handleChange}
                  handleUpdateCourse={this.handleUpdateCourse}
                />
              </TabPane>
              <TabPane tabId="pub_status">
                <CourseOptions
                  {...this.state}
                  {...this.props}
                  handleChange={this.handleChange}
                  handleUpdateCourse={this.handleUpdateCourse}
                />
              </TabPane>
              { /*
                <TabPane tabId='stats' className="mb-2">
                  <p>Warning: Not yet configured</p>
                  <ul>
                    <li>Distributed: {randomInt(40,540)} users </li>
                    <li>Started: {randomInt(40,540)} users </li>
                    <li>Finished: {randomInt(40,540)} users </li>
                  </ul>
                </TabPane>
              */
              }
              <TabPane tabId="users">
                <CourseUsers {...this.state} {...this.props} />
              </TabPane>
            </TabContent>
          </Col>
        </Row>
        <CourseModules {...this.state} {...this.props} />
      </div>
    );
  }
}

CourseBuilder.propTypes = {
  addNotification: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  currentUser: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

CourseBuilder.defaultProps = {
  isAuthenticated: false,
};
