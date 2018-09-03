import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText, CardFooter, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { Auth } from 'aws-amplify';
// import AWS from 'aws-sdk';

/**
 * Course Cards
 * @param {shape} props The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */
const CourseCard = (props) => {
  // const identityId = AWS.config.credentials._identityId;
  // should get identity Id from Auth
  let identityId = '';

  const cred = Auth.currentUserCredentials();
  identityId = cred._identityId;

  // const identityId = '';
  const { className } = props;
  let footer;

  if (props.course.userId === identityId) {
    footer = <span>You own this course</span>;
  } else if (
    props.enrolments.find(e => e.courseId === props.course.courseId) === undefined
  ) {
    footer = <Button color="primary" tag={Link} to={`/courses/promo/${props.course.courseId}`}>Learn More</Button>;
  } else {
    footer = <Button color="info" tag={Link} to={`/courses/toc/${props.course.courseId}`}>Enroled</Button>;
  }

  return (
    <Card className={className}>
      <CardBody>
        <CardTitle className="course-card-title"><Link href="/" to={`/courses/promo/${props.course.courseId}`}>{props.course.name}</Link></CardTitle>
        <CardText className="lead">{props.course.tagline}</CardText>
        <CardText className="text-justify">{props.course.description.split('\n')[0]}</CardText>
      </CardBody>
      <CardFooter className="course-card-footer">{ footer }</CardFooter>
    </Card>
  );
};

CourseCard.propTypes = {
  course: PropTypes.shape({
    courseId: PropTypes.string,
    tagline: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string,
    userId: PropTypes.string,
  }),
  className: PropTypes.string,
  enrolments: PropTypes.arrayOf(PropTypes.shape({ courseId: PropTypes.string })).isRequired,
};

CourseCard.defaultProps = {
  course: {
    courseId: 'xxx',
    tagline: 'Testing',
    description: 'Test description',
  },
  className: '',
};

export default CourseCard;
