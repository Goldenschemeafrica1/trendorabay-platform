import { useNavigate } from 'react-router-dom';

const CommunityCard = () => {
  const navigate = useNavigate();

  return (
    <section className="nl-section">
      <div className="community-card">
        <div className="community-content">
          <span className="nl-kicker">Join Our Community</span>
          <h2>Connect with storytellers, creators and innovators across Africa</h2>
          <p>Be part of a growing community of writers, readers, and changemakers shaping the African narrative. Share ideas, collaborate on projects, and amplify voices that matter.</p>
          <button className="community-cta-btn" onClick={(e) => e.preventDefault()}>
            JOIN COMMUNITY →
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunityCard;
