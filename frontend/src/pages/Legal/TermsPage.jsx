import { FileText } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FileText className="text-blue-600" size={48} />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                By accessing and using Trendorabay ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="text-gray-600 leading-relaxed">
                Permission is granted to temporarily download one copy of the materials on Trendorabay for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-4 space-y-2">
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on Trendorabay</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Products and Services</h2>
              <p className="text-gray-600 leading-relaxed">
                Trendorabay offers digital magazines, merchandise, and cultural content. All products are subject to availability. We reserve the right to discontinue any products at any time. Product descriptions and prices are subject to change without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Payment and Billing</h2>
              <p className="text-gray-600 leading-relaxed">
                By purchasing products from Trendorabay, you agree to provide current, complete, and accurate purchase and account information. You agree to promptly update your account and other information, including your email address and credit card numbers and expiration dates, so that we can complete your transactions and contact you as needed.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Shipping and Delivery</h2>
              <p className="text-gray-600 leading-relaxed">
                For physical products, we ship to the address you provide during checkout. Delivery times are estimates and cannot be guaranteed. Risk of loss and title for all merchandise ordered on this Site pass to you when the merchandise is delivered to the shipping carrier.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Returns and Refunds</h2>
              <p className="text-gray-600 leading-relaxed">
                We accept returns of physical merchandise within 30 days of delivery, provided items are unused and in original condition. Digital products, including magazines, are non-refundable once accessed. Shipping costs for returns are the responsibility of the customer unless the return is due to our error.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. User Content</h2>
              <p className="text-gray-600 leading-relaxed">
                Users may submit content including articles, comments, and community posts. By submitting content, you grant Trendorabay a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display such content. You represent and warrant that you own or have the necessary licenses for all content you submit.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Privacy Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                Your use of Trendorabay is also governed by our Privacy Policy, which can be found here. Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
              <p className="text-gray-600 leading-relaxed">
                All content, including but not limited to text, graphics, logos, images, and software, is the property of Trendorabay or its content suppliers and protected by international copyright laws. The compilation of all content on this site is the exclusive property of Trendorabay.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Disclaimer</h2>
              <p className="text-gray-600 leading-relaxed">
                The materials on Trendorabay are provided on an 'as is' basis. Trendorabay makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed">
                In no event shall Trendorabay or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Trendorabay, even if Trendorabay or a Trendorabay authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of [Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed">
                Trendorabay reserves the right, at its sole discretion, to modify or replace these Terms of Service at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
              <p className="text-gray-600 leading-relaxed">
                Questions about the Terms of Service should be sent to us at legal@trendorabay.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
