import React, { Component } from 'react';
import PDF from 'react-pdf-js';
import PropTypes from 'prop-types';
import { Button, FormGroup, Col, Row, Input, Navbar, Nav, NavItem, Form } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { HotKeys } from 'react-hotkeys';

/**
 * Adds two numbers together.
 * @param {int} page The first number.
 * @param {int} pages The first number.
 * @param {int} e The second number.
 * @returns {int} The sum of the two numbers.
 */
export default class DocPreview extends Component {
  /**
   * Adds two numbers together.
   * @param {object} props property
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = { docHeight: '2em' };
  }
  onDocumentComplete = (pages) => {
    this.setState({ page: 1, pages });

    // if single page document, trigger complete
    if (pages === 1) {
      this.props.triggerComplete();
    }

    // report page height
    this.setState({ docHeight: `${document.body.scrollHeight}px` });
  }
  onPageComplete = (page) => {
    this.setState({ page });
  }
  handlePrevious = (e) => {
    // sanity checks
    if (this.state.page === 1) {
      return;
    }

    e.preventDefault();
    this.setState({ page: this.state.page - 1 });
  }
  handleNext = (e) => {
    // sanity check
    if (this.state.page === this.state.pages) {
      return;
    }

    e.preventDefault();
    this.setState({ page: this.state.page + 1 });
    if (this.state.page + 1 === this.state.pages) {
      this.props.triggerComplete();
    }
  }
  renderPagination = (page, pages) => {
    const disableLeft = page === 1;
    const disableRight = page === pages;
    const previousButton = <Button onClick={this.handlePrevious} disabled={disableLeft}><FontAwesomeIcon icon="arrow-left" /></Button>;
    const nextButton = <Button autoFocus onClick={this.handleNext} disabled={disableRight}><FontAwesomeIcon icon="arrow-right" /></Button>;

    return (
      <div>
        <Navbar color="light" light className="justify-content-between my-2">
          <Form inline>
            {previousButton}
          </Form>
          <Nav navbar>
            <NavItem>Page {page} of {pages}</NavItem>
          </Nav>
          <Form inline>
            {nextButton}
          </Form>
        </Navbar>
        <span className="text-muted"><small>Hint: use arrow keys to navigate page</small></span>
      </div>
    );
  }
  render = () => {
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    }

    if (this.props.file === '' || this.props.file === null) {
      return <p>Nothing to see</p>;
    }

    const fileName = this.props.file instanceof File ?
      `${this.props.file.name} (${this.props.file.size / 1000} KB)` :
      this.props.file;

    const handler = {
      moveLeft: this.handlePrevious,
      moveRight: this.handleNext,
    };

    return (
      <HotKeys handlers={handler}>
        <Row style={{ minHeight: this.state.docHeight }}>
          <Col sm="12">
            <h3>PDF Viewer</h3>
            <hr />
            { pagination }
            {
              this.props.showPath ?
                <FormGroup className="mt-2"><Input disabled value={fileName} /></FormGroup> :
                null
            }
            <div className="border">
              <PDF
                file={this.props.file}
                onDocumentComplete={this.onDocumentComplete}
                onPageComplete={this.onPageComplete}
                page={this.state.page}
                pdf={(input) => { this.pdf = input; }}
                fillWidth
              />
            </div>
          </Col>
          <Col sm="12">
            { pagination }
          </Col>
        </Row>
      </HotKeys>

    );
  }
}

DocPreview.propTypes = {
  triggerComplete: PropTypes.func,
  file: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape,
  ]).isRequired,
  showPath: PropTypes.bool,
};

DocPreview.defaultProps = {
  showPath: false,
  triggerComplete: () => 0,
};
