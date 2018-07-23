import React, { Component } from 'react';
import {
  Row, Col, Nav, NavItem, NavLink, TabContent,
  TabPane, FormGroup, Label, Input, Button,
} from 'reactstrap';
import classnames from 'classnames';
import toTitleCase from 'titlecase';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { invokeApig, s3Upload, s3Delete } from '../libs/awsLibs';
import Notice from '../components/Notice';
import './CourseBuilder.css';
import config from '../config';
import CourseForm from '../components/CourseBuilder/CourseForm';
import CoursePromo from '../components/CourseBuilder/CoursePromo';
import CourseUsers from '../components/CourseBuilder/CourseUsers';
import CourseModules from '../components/CourseBuilder/CourseModules';

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
