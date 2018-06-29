import React, { Component } from 'react';
import { Container, Row, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

const TOC = `This site is provided by Actuarial Partners Consulting ("APC") for informational purposes only. By accessing the site, you are indicating your acceptance of these Terms of Use.

Your use of this site is at your own risk. The content is provided “as is” and without warranties of any kind, either expressed or implied. APC disclaims all warranties, including any implied warranties of merchantability, fitness for a particular purpose, title, or non-infringement. APC does not warrant that the functions or content contained in this site will be uninterrupted or error-free, that defects will be corrected, or that this site or the server that makes it available are free of viruses or other harmful components. APC does not warrant or make any representation regarding use, or the result of use, of the content in terms of accuracy, reliability, or otherwise. The content may include technical inaccuracies or typographical errors, and APC may make changes or improvements at any time. You, and not APC, assume the entire cost of all necessary servicing, repair or correction in the event of any loss or damage arising from the use of this site or its content. APC makes no warranties that your use of the content will not infringe the rights of others and assumes no liability or responsibility for errors or omissions in such content.

Intellectual Property Rights
The material and content accessible from this site (“the Content”), is the proprietary information of APC and APC retains all right, title, and interest in the Content. This site, including all Content, is copyrighted and protected by international copyright laws and treaty provisions.

Restrictions On Use
You may use this site solely for personal, non-commercial purposes and not for any other purpose.

You agree to use the Site solely for the use and benefit of you and your own organization, and not for resale or other transfer to, or use by or for the benefit of, any other person or entity. You agree not to use, transfer, distribute or dispose of any information contained in the Site in any manner that could compete with, or be detrimental to, the business of APC. You acknowledge that the Site has been developed, compiled, prepared, revised, selected and arranged by APC and others (including certain other information sources) through the application of methods and standards of judgment developed and applied through the expenditure of substantial time, effort and money and constitutes valuable intellectual property and trade secrets of APC and such others. No intellectual property rights are transferred to you by access to this site or otherwise. You agree to protect the proprietary rights of APC and all others having rights in the Site during and after the term of this agreement and to comply with all reasonable written requests made by APC or its suppliers of content, equipment or otherwise ("Suppliers") to protect their and others’ contractual, statutory and common law rights in the Site. You agree to notify APC in writing promptly upon becoming aware of any unauthorized access or use of the Site by any party or of any claim that the Site infringes upon any copyright, trademark or other contractual, statutory or common law rights.

Further Restrictions on Use
You may not copy, reproduce, recompile, decompile, disassemble, reverse engineer, distribute, publish, display, perform, modify, upload to, create derivative works from, transmit or in any way exploit any part of the site, except that you may download material from the site and/or print a reasonable number of copies for your personal use or use within your organization, provided that all copies retain all copyright and other proprietary notices.

Without limiting the generality of the foregoing, the analysis and presentation included in the site may not be recirculated, redistributed or published by you without the company’s prior written consent. Modification of the site’s content is a violation of company’s copyright and other proprietary rights. You may not use any of the trade-names, trade-marks, site-marks and logos displayed on the site (collectively "marks"), except as expressly provided in these terms. Nothing appearing on the site or elsewhere shall be construed as granting, by implication, estoppel, or otherwise, any license or right to use any marks. You will not use the site, the information contained therein or any of company’s names or marks in unsolicited mailings or spam material and will not spam or send unsolicited mailings to any person or entity using the site.

Third-party Sites
This site is hyperlinked to other sites which are not maintained by, or related to, APC. Hyperlinks to such sites are provided as a service to you. APC has not reviewed the sites and is not responsible for the content of those sites. Other internet sites which are linked to the Site have their own terms and conditions of use and privacy policies. Access to any other Internet sites linked to the Site is at your own risk and APC expressly disclaims any and all liability related to such websites. Hyperlinks are accessed at your own risk, and APC makes no representations or warranties about the content, completeness or accuracy of the hyperlinks or the sites hyperlinked to this site.

Linking and Framing
Without specific, written consent by Company, you specifically may not link to this Site, either the home page or to any other page that is located one or several levels down from the home page ("deep link"), nor are you permitted to bring up or present content of this site within another website ("frame").

Submissions
APC will treat any personal information that you submit through this site in accordance with its Privacy Policy.

Disclaimers
You accept that APC does not guarantee or warrant that files available for downloading from the Internet will be free of viruses, worms, Trojan horses or other code that may manifest contaminating or destructive properties. You are responsible for implementing sufficient procedures and checkpoints to satisfy your particular requirements for accuracy of data input and output, and for maintaining a means external to this site for the reconstruction of any lost data. APC does not assume any responsibility or risk for your use of this site.

All of the information in this site, whether historical in nature or forward-looking, speaks only as of the date the information is posted on this site, and APC does not undertake any obligation to update such information after it is posted or to remove such information from this site if it is not, or is no longer, accurate or complete.

APC does not warrant the accuracy or completeness of the Content or the reliability of any advice, opinion, statement or other information displayed or distributed through the site.

Not Professional Advice.
The Content should not be used to replace any written reports, statements, or notices provided by APC. The information in this site does not constitute accounting, consulting, investment, legal, tax or any other type of professional advice, and should be used only in conjunction with appropriate professional advisors who have full knowledge of the user's situation. Professionals and other persons should use the Content in the same manner as any other educational medium and should not rely on the Content to the exclusion of their own professional judgment.

Limitation On Liability
APC, its subsidiaries, affiliates, licensors, service providers, content providers, employees, agents, officers, and directors will not be liable for any incidental, direct, indirect, punitive, actual, consequential, special, exemplary, or other damages, including loss of revenue or income, pain and suffering, emotional distress, or similar damages, even if APC has been advised of the possibility of such damages.

Indemnity
You will indemnify and hold APC, its subsidiaries, affiliates, licensors, content providers, service providers, employees, agents, officers, directors, and contractors (the “Indemnified Parties”) harmless from any breach of these Terms of Use by you, including any use of Content other than as expressly authorized in these Terms of Use. You agree that the Indemnified Parties will have no liability in connection with any such breach or unauthorized use, and you agree to indemnify any and all resulting loss, damages, judgments, awards, costs, expenses, and attorneys’ fees of the Indemnified Parties in connection therewith. You will also indemnify and hold the Indemnified Parties harmless from and against any claims brought by third parties arising out of your use of the information accessed from this site.

Rights Reserved
All present and future rights in and to trade secrets, patents, copyrights, trade names, trademarks, service marks, databases, know-how and other proprietary rights of any type under the laws of any governmental authority, domestic or foreign, including rights in and to all applications and registrations relating to the Site (the "IP Rights") shall, as between you and APC, at all times be and remain the sole and exclusive property of APC. All present and future rights in and title to the Site (including the right to exploit the Site and any portions of the Site over any present or future technology) are reserved to APC.

Security
APC reserves the right to fully cooperate with any law enforcement authorities or court order requesting or directing APC to disclose the identity of anyone posting any e-mail messages, or publishing or otherwise making available any materials that are believed to violate these Terms of Use. By accepting this agreement you waive and hold harmless APC from any claims resulting from any action taken by APC during or as a result of its investigations and/or from any actions taken as a consequence of investigations by either APC or law enforcement authorities.

International Users and Choice of Law
This site is controlled, operated and administered by APC from its office within Malaysia. If you access this site from a location outside of Malaysia, you are responsible for compliance with all local laws. These Terms of Use shall be governed by the laws of Malaysia, without giving effect to its conflict of laws provisions.

Changes
APC reserves the right, at its sole discretion, to change, modify, add or remove any portion of these Terms of Use in whole or in part, at any time. Changes will be effective when notice of such change is posted. Your continued use of the site after any changes to these Terms of Use are posted will be considered acceptance of those changes.

APC may terminate, change, suspend or discontinue any aspect of the site, including the availability of any features of the site, at any time. APC may also impose limits on certain features and services or restrict your access to parts or all of the site without notice or liability.

Miscellaneous
If any part of these Terms of Use is unlawful, void or unenforceable, that part will be deemed severable and will not affect the validity and enforceability of any remaining provisions. These Terms of Use constitute the entire agreement among the parties relating to this subject matter. Notwithstanding the foregoing, any additional terms and conditions on this site will govern the items to which they pertain.

Last updated: July 15, 2016

Copyright© 2016 Actuarial Partners Consulting Sdn Bhd.

About Actuarial Partners Consulting Sdn Bhd

We are an actuarial consulting firm that has been partnering with clients in takaful, insurance and retirement benefits for more than 3 decades.
`;

const PrivacyPolicy = `
Effective Date: July 15, 2016

Actuarial Partners Consulting (“APC,” “we,” “our,” “us”) are committed to protecting the privacy of the users (“you,” “your”) of this site (“Website”). We collect personally identifiable information about you only with your permission. We respect your privacy and is committed to protecting the personal information you share with us. The purpose of this Privacy Policy is to set out the principles governing our use of personal information. If you give us personal information, we will treat it according to this policy and in compliance with our governing law in Malaysia, the Personal Data Protection Act 2010 (“PDPA”).

Collection of personal information: If you are required to register in order to use a feature of this Web site or to complete an online application form (e.g. to obtain e-mail updates or online publications), or to register for a subscription service, we will collect personally identifiable information about you, such as your name, e-mail address, country of residence, and other information which you voluntarily submit.

Security: We will use appropriate, commercially reasonable safeguards to maintain the confidentiality of your personal information. We will take appropriate technical and organizational measures to protect your personal information against (a) accidental or unlawful destruction, (b) accidental loss and (c) unauthorized alteration, disclosure or access.

Online tracking: APC may collect information during your visit to our website through the use of online tracking technology. No personally identifiable data are collected in this process. Typically, we collect information about the number of visitors to the Web site, to each Web page and the originating domain name of the visitor's Internet Service Provider. This tracking technology enables us to track pages and content accessed and viewed by users on our websites. The use of these technologies is intended to be used to improve the usability, performance and effectiveness of the Web site.

Cookies: A cookie is a text-only string of information stored on a user's hard drive that allows a website to remember them. For general users of the site, cookies are used only during a user session (to maintain a shopping cart, for instance) and are then deleted. We do use persistent cookies to identify users who take advantage of the customization features of this Website and to save this identification between site visits.

Authorized third-party agents: We also may share your personal information with authorized third-party agents or contractors in order to provide a requested service or transaction. For example, if we need to ship a publication to you, we must share your name and address with a shipping company. Another example is if you register for an event online, your personal information will be used to fulfill that request and may be shared with third parties involved with the event (a hotel, for instance). We will only provide third-party agents with the minimum amount of personal information necessary to complete the requested service or transaction.

Email: If you send an email message to us, we will use your email address and other information you provide to respond to your request.

Subscriptions: If you subscribe to one of our online publications, we use the information you provide to send you email updates. You can unsubscribe at any time by contacting our Webmaster, whose details are provided below.

Surveys: The information we collect in online surveys is used for internal research purposes. In general, we do not divulge individual responses to surveys. Exceptions to this policy are noted when users access particular surveys. On occasion, we may share responses with a cosponsor that works with us to analyze the data; in this case, we expect the cosponsor to maintain the same level of confidentiality and security as employed by APC.

Third parties: We do not sell or share personal information with third parties for their own separate use.

Legal requirements and illegal activities: We may respond to subpoenas, court orders, or legal process by disclosing your personal information and other related information, if necessary.

Accessing and updating: If your personal information changes or if you no longer wish to receive a service, please let the us know by emailing us and we will correct, update or remove your details. You are entitled to see the information held about you for a small fee. If you wish to do this, please contact us.

Modification: This privacy policy is subject to change. All changes will be posted on this Website and shall apply to information provided on or after the date of posting.

If you have any questions about APC’s privacy practices, please contact us at enquiry@actuarialpartners.com
`;

/**
 * Legal stuff
 * @param {int} tab The first number.
 * @param {int} num2 The second number.
 * @returns {int} The sum of the two numbers.
 */
export default class Legal extends Component {
  /**
   * Legal stuff
   * @param {int} props The first number.
   * @returns {int} The sum of the two numbers.
   */
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'TermsOfUse',
    };
  }
  toggleTab = (tab) => { if (this.state.activeTab !== tab) { this.setState({ activeTab: tab }); } }
  render = () => (
    <Container className="mt-2">

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
          <TabContent activeTab={this.state.activeTab} className="mt-3">
            <TabPane tabId="TermsOfUse" className="text-justify">
              <h4>Terms of Use</h4>
              { TOC.split('\n').map(para => (<p key={parseInt(Math.random() * 1000, 10)}>{para}</p>)) }
            </TabPane>
            <TabPane tabId="PrivacyPolicy" className="text-justify">
              <h4>Privacy Policy</h4>
              { PrivacyPolicy.split('\n').map(para => (<p key={parseInt(Math.random() * 1000, 10)}>{para}</p>)) }
            </TabPane>

          </TabContent>

        </div>
      </Row>
    </Container>
  )
}
