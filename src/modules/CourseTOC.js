import React from 'react';
import { Jumbotron, Container, Row, Col } from 'reactstrap';
import PropTypes from 'prop-types';
import CTOC from '../components/CTOC';

/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
const CourseTOC = (props) => {
  // loading screen
  const bgStyling = props.module.bg_pic ?
    { backgroundImage: `url(${props.module.bg_pic})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover' } :
    null;
  const titleFontStyling = props.module.title_font_color ?
    { color: props.module.title_font_color } : { color: 'black' };
  let styling = Object.assign({}, bgStyling);
  styling = Object.assign(styling, titleFontStyling);

  return (
    <div>
      <Jumbotron fluid style={styling}>
        <Container>
          <h1 className="display-3 course-toc-title">Welcome to {props.module.name}</h1>
          <p className="lead">{props.module.tagline}</p>
        </Container>
      </Jumbotron>
      <Container>
        <Row>
          <Col xs="12">
            <h3 className="display-4">Executive Summary</h3>
            { props.module.description.split('\n').map(para => (<p key={parseInt(Math.random() * 1000, 10)} className="lead text-left">{para}</p>)) }
          </Col>
          <Col xs="12">
            <h3 className="display-4 course-toc">Table of Contents</h3>
            <CTOC
              course={props.module}
              {...props}
              showLink
            />
          </Col>
          { /*
            <div className="col-12">
              <h2 className="display-4">Additional Resources</h2>
              <ul className="text-left">
                <li>Should show list of tables/images/etc</li>
              { Array.from(Array(randomInt(3,8)).keys()).map( (e,i) => {
                return (<li key={i}>{ loremIpsum()}</li>);
              })}
              </ul>
            </div>
          */ }
        </Row>
      </Container>
    </div>
  );
};

export default CourseTOC;

CourseTOC.propTypes = {
  match: PropTypes.shape(),
  module: PropTypes.shape().isRequired,
  demoMode: PropTypes.bool,
};

CourseTOC.defaultProps = {
  match: {},
  demoMode: false,
};
