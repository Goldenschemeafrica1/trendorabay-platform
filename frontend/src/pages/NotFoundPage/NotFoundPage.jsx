import { useNavigate } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-amber-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-600 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-600 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
        {/* 404 Number */}
        <div className="mb-6 relative">
          <h1 className="text-[180px] font-bold leading-none bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-600 bg-clip-text text-transparent">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className="text-6xl">🌍</span>
          </div>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Oops! The page you're looking for seems to have wandered off into the African savanna. Let's help you find your way back.
        </p>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-10 mb-10 border border-amber-100">
          <p className="text-gray-700 mb-6 text-lg font-medium">
            This might have happened because:
          </p>
          <ul className="text-left text-gray-600 space-y-3 mb-8 max-w-md mx-auto">
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-1">•</span>
              <span>The page has been moved or deleted</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-1">•</span>
              <span>The URL was typed incorrectly</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-1">•</span>
              <span>You followed a broken link</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-1">•</span>
              <span>The content is no longer available</span>
            </li>
          </ul>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 bg-gray-100 text-gray-800 px-8 py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium border-2 border-gray-200 hover:border-gray-300"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-600 text-white px-8 py-4 rounded-xl hover:from-amber-700 hover:via-orange-600 hover:to-yellow-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              <Home size={20} />
              Home Page
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Looking for something specific?</h3>
          <p className="text-gray-600 mb-6">
            Explore our popular categories and discover amazing African content
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate('/magazines')}
              className="bg-white p-5 rounded-xl hover:shadow-xl transition-all duration-200 text-sm group border border-amber-200 hover:border-amber-300"
            >
              <div className="text-3xl mb-2">📰</div>
              <strong className="text-gray-800 group-hover:text-amber-600 transition-colors">Magazines</strong>
              <p className="text-gray-500 text-xs mt-1">Latest issues</p>
            </button>
            
            <button
              onClick={() => navigate('/merchandise')}
              className="bg-white p-5 rounded-xl hover:shadow-xl transition-all duration-200 text-sm group border border-amber-200 hover:border-amber-300"
            >
              <div className="text-3xl mb-2">👕</div>
              <strong className="text-gray-800 group-hover:text-amber-600 transition-colors">Merchandise</strong>
              <p className="text-gray-500 text-xs mt-1">African fashion</p>
            </button>
            
            <button
              onClick={() => navigate('/stories')}
              className="bg-white p-5 rounded-xl hover:shadow-xl transition-all duration-200 text-sm group border border-amber-200 hover:border-amber-300"
            >
              <div className="text-3xl mb-2">📖</div>
              <strong className="text-gray-800 group-hover:text-amber-600 transition-colors">Stories</strong>
              <p className="text-gray-500 text-xs mt-1">Cultural tales</p>
            </button>
            
            <button
              onClick={() => navigate('/community')}
              className="bg-white p-5 rounded-xl hover:shadow-xl transition-all duration-200 text-sm group border border-amber-200 hover:border-amber-300"
            >
              <div className="text-3xl mb-2">🤝</div>
              <strong className="text-gray-800 group-hover:text-amber-600 transition-colors">Community</strong>
              <p className="text-gray-500 text-xs mt-1">Connect & share</p>
            </button>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-gray-500">
            If you believe this is an error, please{' '}
            <button
              onClick={() => navigate('/contact')}
              className="text-amber-600 hover:text-amber-700 font-medium underline decoration-amber-300 hover:decoration-amber-500 underline-offset-4 transition-all"
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
