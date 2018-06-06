import React, { Component } from "react";
import PDF from 'react-pdf-js';
import { Button, FormGroup, Col, Row, Input, Navbar, Nav, NavItem, Form } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

export default class DocPreview extends Component {
  constructor(props){
    super(props)
    this.state = {docHeight:'2em'};
  }
  onDocumentComplete = (pages) => {
    this.setState({ page: 1, pages });

    //if single page document, trigger complete
    if(pages === 1){
      this.props.triggerComplete();
    }

    //report page height
    console.log('document.body.scrollHeight', document.body.scrollHeight);
    this.setState({docHeight:`${document.body.scrollHeight}px` });

  }
  onPageComplete = (page) => {
    this.setState({ page });
  }
  handlePrevious = (e) => {
    e.preventDefault();
    this.setState({ page: this.state.page - 1 });
  }
  handleNext = (e) => {
    e.preventDefault()
    this.setState({ page: this.state.page + 1 });
    if(this.state.page+1 === this.state.pages){
      this.props.triggerComplete();
    }
  }
  renderPagination = (page, pages) => {
    var disableLeft = page === 1;
    var disableRight = page === pages;
    let previousButton = <Button onClick={this.handlePrevious} disabled={disableLeft}><FontAwesomeIcon icon="arrow-left" /></Button>;
    let nextButton = <Button onClick={this.handleNext} disabled={disableRight}><FontAwesomeIcon icon="arrow-right" /></Button>;

    return (
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
      );
  }
  render(){
    let pagination = null;
    if (this.state.pages) {
      pagination = this.renderPagination(this.state.page, this.state.pages);
    };

    if (this.props.file === '' || this.props.file === null){
      return <p>Nothing to see</p>;
    }

    var fileName = this.props.file instanceof File ? `${this.props.file.name} (${this.props.file.size/1000} KB)`: this.props.file;

    return (
      <Row style={ {minHeight:this.state.docHeight}}>
        <Col sm="12">
          <h3>Preview</h3>
          <hr />
          { pagination }
          {
            this.props.showPath ?
              <FormGroup className="mt-2"><Input disabled={true} value={fileName} /></FormGroup> :
              null
          }
          <div className="border">
          <PDF file={ this.props.file }
            onDocumentComplete={this.onDocumentComplete}
            onPageComplete={this.onPageComplete}
            page={this.state.page}
            pdf={ (input) => { this.pdf = input;}}
            fillWidth
          />
          </div>
        </Col>
        <Col sm="12">
          { pagination }
        </Col>
      </Row>

    )
  }
}

DocPreview.defaultProps = {
  showPath:false,
  triggerComplete: () => { return 0;}
}
