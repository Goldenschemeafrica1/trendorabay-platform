import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag } from 'lucide-react';

const CheckoutSuccessPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear cart after successful checkout
    localStorage.removeItem('trendorabay-cart');
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="text-green-600" size={80} />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Order Successful!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </p>

        <div className="bg-gray-50 rounded-lg p-8 mb-8">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          <div className="text-left space-y-2">
            <p><strong>Order Number:</strong> #TRB{Math.floor(Math.random() * 1000000)}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Payment Method:</strong> Credit Card</p>
            <p><strong>Shipping Address:</strong> Will be added to your profile</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/merchandise')}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">What's Next?</h3>
          <ul className="text-left text-gray-600 space-y-1">
            <li>• You'll receive an email confirmation shortly</li>
            <li>• We'll process your order within 1-2 business days</li>
            <li>• You'll receive tracking information once shipped</li>
            <li>• Expected delivery: 5-7 business days</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
