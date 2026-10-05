import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const CommunityCard = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleJoinClick = () => {
    if (user?.id) {
      // User is logged in, navigate to communities page
      navigate('/communities');
    } else {
      // User is not logged in, show message and redirect to login page
      toast.error('You must login to access communities');
      localStorage.setItem('redirectAfterLogin', '/communities');
      navigate('/login');
    }
  };

  return (
    <section className="nl-section">
      <div className="community-card">
        <div className="eyebrow">Community</div>
        <h2>Join Our Community</h2>
        <p className="subtitle">Connect with storytellers, creators and innovators across Africa.</p>
        <p className="body">Be part of a growing community of writers, readers, and changemakers shaping the African narrative. Share ideas, collaborate on projects, and amplify voices that matter.</p>
        <button className="join-btn" onClick={handleJoinClick}>
          Join Community <span className="arrow">→</span>
        </button>
      </div>
    </section>
  );
};

export default CommunityCard;
