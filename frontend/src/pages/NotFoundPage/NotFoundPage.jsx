import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-2xl mx-auto text-center px-4">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Oops! The page you're looking for seems to have wandered off into the African savanna.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-gray-600 mb-6">
            This might have happened because:
          </p>
          <ul className="text-left text-gray-600 space-y-2 mb-6">
            <li>• The page has been moved or deleted</li>
            <li>• The URL was typed incorrectly</li>
            <li>• You followed a broken link</li>
            <li>• The content is no longer available</li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Home size={20} />
              Home Page
            </button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Looking for something specific?</h3>
          <p className="text-gray-600 mb-4">
            Try searching for what you need or browse our popular categories:
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <button
              onClick={() => navigate('/magazines')}
              className="bg-white p-3 rounded-lg hover:shadow-md transition-shadow text-sm"
            >
              <strong>Magazines</strong>
              <p className="text-gray-500 text-xs mt-1">Latest issues</p>
            </button>
            
            <button
              onClick={() => navigate('/merchandise')}
              className="bg-white p-3 rounded-lg hover:shadow-md transition-shadow text-sm"
            >
              <strong>Merchandise</strong>
              <p className="text-gray-500 text-xs mt-1">African fashion</p>
            </button>
            
            <button
              onClick={() => navigate('/stories')}
              className="bg-white p-3 rounded-lg hover:shadow-md transition-shadow text-sm"
            >
              <strong>Stories</strong>
              <p className="text-gray-500 text-xs mt-1">Cultural tales</p>
            </button>
            
            <button
              onClick={() => navigate('/community')}
              className="bg-white p-3 rounded-lg hover:shadow-md transition-shadow text-sm"
            >
              <strong>Community</strong>
              <p className="text-gray-500 text-xs mt-1">Connect & share</p>
            </button>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-500 text-sm">
            If you believe this is an error, please{' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-blue-600 hover:underline"
            >
              contact our support team
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
