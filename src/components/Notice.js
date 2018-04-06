import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import PropTypes from 'prop-types';

/**
 * The Constructor
 * @param {json} props the props
 * @returns {null} The sum of the two numbers.
 */
const Notice = props => (
  <Container className="mt-3 mb-2">
    <Row>
      <Col>
        <Card>
          <CardBody>
            { props.title !== '' ? (<CardTitle>{props.title}</CardTitle>) : null }
            <CardText>{props.content}</CardText>
          </CardBody>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Notice;

Notice.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

Notice.defaultProps = {
  title: '', content: 'No content',
};
