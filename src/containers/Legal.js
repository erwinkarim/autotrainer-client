import React, { Component } from "react";
import {Container, Row, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import loremIpsum from 'lorem-ipsum';
import './Legal.css'
import classnames from 'classnames';
import randomInt from 'random-int';


export default class Legal extends Component {
  constructor(props){
    super(props)
    this.state = {
      activeTab:'TermsOfUse'
    }
  }
  toggleTab = (tab) => { if (this.state.activeTab !== tab){ this.setState({ activeTab: tab }); } }
  render(){
    return (<Container className="mt-2">
      <Row>
        <div className="col-12">
          <Nav tabs>
            <NavItem>
             <NavLink className={classnames({ active: this.state.activeTab === 'TermsOfUse' })} onClick={() => { this.toggleTab('TermsOfUse'); }} >
               Terms of Use
             </NavLink>
           </NavItem>
            <NavItem>
             <NavLink className={classnames({ active: this.state.activeTab === 'PrivacyPolicy' })} onClick={() => { this.toggleTab('PrivacyPolicy'); }} >
              Privacy Policy
             </NavLink>
           </NavItem>
          </Nav>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="TermsOfUse" className="text-left">
              <h4>Terms of Use</h4>
              { Array.from( Array(randomInt(5,8)).keys() ).map( (e,i) => { return (<p key={i}>{loremIpsum({count:randomInt(4,5), units:'paragraphs'})}</p>)})}
            </TabPane>
            <TabPane tabId="PrivacyPolicy" className="text-left">
              <h4>Privacy Policy</h4>
              { Array.from( Array(randomInt(5,8)).keys() ).map( (e,i) => { return (<p key={i}>{loremIpsum({count:randomInt(4,5), units:'paragraphs'})}</p>)})}
            </TabPane>

          </TabContent>

        </div>
      </Row>
    </Container>)
  }
}
