import React from 'react';
import './PrivacyPage.css';

const PrivacyPage = () => {
  return (
    <div className="privacy-page">
      <div className="container">
        <div className="privacy-header">
          <h1>Privacy Policy</h1>
        </div>

        <div className="privacy-content">
          <section>
            <h2>Introduction</h2>
            <p>
              Trendorabay ("us", "we", or "our") operates the trendorabay.com website and related services. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2>Information We Collect</h2>
            <p>
              We collect several different types of information for various purposes to provide and improve our service to you.
            </p>
            
            <h3>Personal Data</h3>
            <p>
              While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:
            </p>
            <ul>
              <li>Email address</li>
              <li>First name and last name</li>
              <li>Phone number</li>
              <li>Address, State, Province, ZIP/Postal code, City</li>
              <li>Cookies and Usage Data</li>
            </ul>

            <h3>Usage Data</h3>
            <p>
              We may also collect information on how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol (IP) address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.
            </p>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <p>
              Trendorabay uses the collected data for various purposes:
            </p>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To notify you about changes to our Service</li>
              <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our Service</li>
              <li>To monitor the usage of our Service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To process payments and fulfill orders</li>
              <li>To send you newsletters and marketing communications (with your consent)</li>
            </ul>
          </section>

          <section>
            <h2>Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>
          </section>

          <section>
            <h2>Data Security</h2>
            <p>
              The security of your data is important to us. We use commercially reasonable administrative, technical, and physical measures to protect your personal data from unauthorized access, use, or disclosure. However, remember that no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2>Data Retention</h2>
            <p>
              We will retain your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
            </p>
          </section>

          <section>
            <h2>Your Data Protection Rights</h2>
            <p>
              You have certain data protection rights. We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your Personal Data.
            </p>
            <ul>
              <li><strong>Right to Access:</strong> The right to request copies of your personal data</li>
              <li><strong>Right to Rectification:</strong> The right to request correction of inaccurate personal data</li>
              <li><strong>Right to Erasure:</strong> The right to request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> The right to request restriction of processing your personal data</li>
              <li><strong>Right to Data Portability:</strong> The right to request transfer of your personal data</li>
            </ul>
          </section>

          <section>
            <h2>Third-Party Services</h2>
            <p>
              Our Service may contain links to other sites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
            </p>
            <p>
              We have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.
            </p>
          </section>

          <section>
            <h2>Children's Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 13 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 13. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us.
            </p>
          </section>

          <section>
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the top. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <div className="contact-info">
              <p>By email: privacy@trendorabay.com</p>
              <p>By visiting this page on our website: trendorabay.com/contact</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
