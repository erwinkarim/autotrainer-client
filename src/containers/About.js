import React, { Component } from "react";
//import AWS from 'aws-sdk';
import { Container, Row, Col } from 'reactstrap';
import { Jumbotron } from 'reactstrap';
import './About.css';

export default class About extends Component{
  render(){
    return (
      <div>
        <Jumbotron fluid className="banner">
          <Container className="text-white text-shadow">
            <h2>About Us</h2>
            <p>Brief history of Actuarl Partners and learn@AP</p>
          </Container>
        </Jumbotron>
        <Container className="mt-2 text-left">
          <Row>
            <Col xs="12">
              <h2>Putting Years of Experience and Informed Strategies to Work for You</h2>
              <p>Actuarial Partners is more than a typical actuarial or consulting firm. With nearly 100 years of combined consulting experience, our partners are not only leaders in their field but are progressive and forward-thinking innovators.</p>
              <p>Our strengths are numerous, and our experience is vast... making Actuarial Partners the right source for:
              </p>
              <ul>
                <li>Traditional Actuarial Consulting</li>
                <li>Strategic Consulting</li>
                <li>Risk Management</li>
              </ul>
              <p>Our firm is distinguishable from other actuarial firms in that we pride ourselves on combining top-level strategic thinking and old-fashioned personal attention and sensibility to all of our clients for services such as: pension scheme valuation and design, pricing of insurance and Takaful products, determining appraisal values in mergers and acquisitions and the actuarial valuation of insurance and Takaful company liabilities.</p>
              <p> Our clients are spread across the globe; from Malaysia to the UK, with various countries in between like Singapore, Brunei, Indonesia, Thailand, Hong Kong, Sri Lanka, Mauritius, Saudi Arabia, Bahrain, Oman, Nigeria and Sudan. We are leaders in consulting to the growing Takaful (Islamic Insurance) industry. In Malaysia we are widely accepted as the industry expert on pensions and the actuarial aspects of Takaful.</p>
              <h2> Our History: A Glimpse Into Our Past</h2>
              <p>When the firm was established in Malaysia in 1977 it was a subsidiary of a leading UK based actuarial firm, Duncan C. Fraser & Co. Its primary mission: To provide outstanding actuarial services for the Far East market.</p>
              <p> The Malaysian company was initially headed by Huw-Wynne Griffith and succeeded by Adrian Waddingham in 1981. As time passed, the firm’s needs and clientele expanded. It was during this transition that Actuarial Partner’s current senior partner and office head, Zainal Kassim, started with the firm. Soon afterward in 1984, the firm was renamed Zainal Fraser & Co. Sdn Bhd, still under the Duncan C. Fraser & Co. umbrella.</p>
              <p> When William M. Mercer acquired the worldwide operations of Duncan C. Fraser & Co. in 1986, the combined Malaysian operation of Mercer and Zainal Fraser moved into the current office location and was renamed William M. Mercer Zainal Fraser to reflect the merger of two leading consultancies. Under Mercer, our company developed international “best practices” and adopted time-tested processes in all areas of its operations, in particular in the development of peer review and checking processes, codes of conduct and other global policies and processes.
              </p>
              <h2>Our Present: Building Value Together with Our Clients</h2>
              <p> Whilst the firm thrived and developed in Malaysia under Mercer’s umbrella, our firm’s expertise in insurance, Takaful and retirement consulting conflicted with Mercer’s shift in focus to human resource and investment consulting. This left our senior management with a dilemma.</p>
              <p> A decision was made that in order to take the insurance and Takaful practice to the next stage of development, a management buy out (MBO) of the actuarial practice of Mercer was the best option forward. After the completion of the MBO on 1st February 2011, the firm re-emerged as Actuarial Partners.</p>
              <p> The new name, Actuarial Partners, provides a glimpse into our strengths as an organisation, namely:</p>
              <ul>
                <li>Our Partners are Fellows of the Institute and Faculty of Actuaries in the UK, the Society of Actuaries in the United States and the Casualty Actuary Society in the United States. They are also Fellows of the Actuarial Society of Malaysia.</li>
                <li> We use our core actuarial expertise in building value for our clients. Indeed we take pride in our ability to partner with our clients to add value.</li>
              </ul>
              <p> The new Actuarial Partners logo depicts a family holding hands to signify our concern for our clients and our attitude towards our own staff. It is very much our conviction that we are ‘partners’ and we are here to build value together with our clients. The different sized hands show our interest in helping all clients, from the largest multinational corporations to the smallest local companies. The different colours indicate the diversity in our company as well as our ability and desire to reach out to diverse cultures around the world.</p>
              <p> Although our name has changed, our services and our strong business model have not. Current clients can expect the same quality of service and attention they received when the firm was under Mercer leadership. Our prospective business partners can rely on the accomplishments and the professional reputation of our firm to be maintained.</p>
              <h2>About learn@AP</h2>
              <p>Now talk about how learn@AP fits into the picture. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit </p>
            </Col>
          </Row>
        </Container>
      </div>
    );

  }
}
