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
import { API } from 'aws-amplify';

import { invokeApig, s3Upload, s3Delete } from '../libs/awsLibs';
import Notice from '../components/Notice';

import './CourseBuilder.css';
import config from '../config';
import asyncComponent from '../components/AsyncComponent';
import {
  titleNotEmpty, descriptionNotEmpty, priceNotEmpty,
  keyPointsNotEmpty, validCouponCode,
} from '../components/CourseBuilder/formValidation';

// asych load each form components
const CourseForm = asyncComponent(() => import('../components/CourseBuilder/CourseForm'));
const CourseTOCForm = asyncComponent(() => import('../components/CourseBuilder/CourseTOCForm'));
const CoursePromo = asyncComponent(() => import('../components/CourseBuilder/CoursePromo'));
const CourseUsers = asyncComponent(() => import('../components/CourseBuilder/CourseUsers'));
const CourseModules = asyncComponent(() => import('../components/CourseBuilder/CourseModules'));

/*
  forms to update the course options / publication status
 */
const CourseOptions = (props) => {
  const { course } = props;
  const courseOptions = course.courseOptions ? course.courseOptions : {
    showOneByOne: false,
  };

  return (
    <div className="mt-2">
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
      course: {
        courseId: '',
      },
      loading: true,
      bg_handle: null,
      bg_pic_data: null,
    };
  }
  componentDidMount = async () => {
    // load the user then the course
    const { course } = this.state;

    API.get('default', `/courses/${this.props.match.params.courseId}`)
      .then((res) => {
        // take out null entries before reassign default values
        Object.entries(res).forEach(([k, v]) => {
          if (v === null) { delete res[k]; }
        });

        const result = Object.assign({
          tagline: '',
          key_points: [],
          bg_pic: '',
          bg_key: '',
          clientList: [],
          coupons: [{ code: null, discount: 100.0 }],
          promoContent: '',
        }, res);

        if (result != null) {
          this.setState({ course: result, loading: false });
        }

        // setup the picture preview
        if (course.bg_pic !== null && course.bg_pic !== '') {
          // course.bg_pic should be a string
          this.setState({ bg_handle: course.bg_pic });
          this.updatePicture(course.bg_pic);
        }
      })
      .catch((err) => {
        console.log('something went wrong');
        console.log(err);
      });
  }
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
    const { course } = this.state;

    // need a better way to handle s3 files
    /*
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
    */

    // console.log('should send updates on new course settings');
    API.put('default', `/courses/${this.props.match.params.courseId}`, {
      body: { course },
    })
      .then(() => {
        this.props.addNotification('Course updated ...');
      })
      .catch((err) => {
        console.log('error getting courses');
        console.log(err);
      });
  }
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
  handlePromoChange = (content) => {
    const newCourse = this.state.course;
    newCourse.promoContent = content;
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
    const { course } = this.state;

    return titleNotEmpty(course) &&
      descriptionNotEmpty(course) &&
      priceNotEmpty(course) &&
      keyPointsNotEmpty(course) &&
      validCouponCode(course);
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
    const { course, loading } = this.state;
    const { currentUser } = this.props;

    if (!currentUser) {
      return (<Notice content="User is not authenticated." />);
    } else if (!currentUser.isAdmin) {
      return <Notice content="You need to be admin to manage a course" />;
    } else if (loading) {
      return <Notice content="Loading course ..." />;
    }

    return (
      <div className="mt-2 text-left">
        <Helmet>
          <title>Course Builder for {course.name} - {config.site_name}</title>
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
                >General { !titleNotEmpty(course) ? <span className="text-danger">*</span> : null }
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.settingActiveTab === 'promo_page' })}
                  onClick={() => { this.toggle('promo_page'); }}
                >Promo Page {
                  !keyPointsNotEmpty(course) || !validCouponCode(course) ?
                    <span className="text-danger">*</span> : null
                }
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.settingActiveTab === 'toc_page' })}
                  onClick={() => { this.toggle('toc_page'); }}
                >TOC Page { !descriptionNotEmpty(course) ? <span className="text-danger">*</span> : null }
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
                  handleUpdateCourse={this.handleUpdateCourse}
                  validateGeneralForm={this.validateGeneralForm}
                />
              </TabPane>
              <TabPane tabId="promo_page">
                <CoursePromo
                  {...this.state}
                  {...this.props}
                  handleChange={this.handleChange}
                  enableAddKeyPoint={this.enableAddKeyPoint}
                  newKeyPoint={this.newKeyPoint}
                  deleteKeyPoint={this.deleteKeyPoint}
                  toggleCompany={this.toggleCompany}
                  autoGenCouponCode={this.autoGenCouponCode}
                  handlePromoChange={this.handlePromoChange}
                  validateGeneralForm={this.validateGeneralForm}
                  handleUpdateCourse={this.handleUpdateCourse}
                />
              </TabPane>
              <TabPane tabId="toc_page">
                <CourseTOCForm
                  {...this.state}
                  {...this.props}
                  handleChange={this.handleChange}
                  handleUpdateCourse={this.handleUpdateCourse}
                  validateGeneralForm={this.validateGeneralForm}
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
