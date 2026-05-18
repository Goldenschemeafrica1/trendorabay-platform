import React from 'react';
import './TrustedBy.css';

const TrustedBy = () => {
  const logos = [
    { 
      name: "Nike", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M19.48 12.76c-.18.36-.46.76-.9.76-.53 0-.8-.38-.8-.76 0-.53.38-.8.76-.8.38 0 .76.27.94.8zm-3.43 0c-.18.36-.46.76-.9.76-.53 0-.8-.38-.8-.76 0-.53.38-.8.76-.8.38 0 .76.27.94.8zm-3.43 0c-.18.36-.46.76-.9.76-.53 0-.8-.38-.8-.76 0-.53.38-.8.76-.8.38 0 .76.27.94.8z'/%3E%3C/svg%3E"
    },
    { 
      name: "Forbes", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Ctext x='0' y='20' font-family='Arial' font-size='18' font-weight='bold'%3EFORBES%3C/text%3E%3C/svg%3E"
    },
    { 
      name: "Samsung", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231428A7'%3E%3Ctext x='0' y='20' font-family='Arial' font-size='16' font-weight='bold'%3ESAMSUNG%3C/text%3E%3C/svg%3E"
    },
    { 
      name: "Safaricom", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2300AA00'%3E%3Ctext x='0' y='20' font-family='Arial' font-size='14' font-weight='bold'%3ESAFARICOM%3C/text%3E%3C/svg%3E"
    },
    { 
      name: "Google", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
    },
    { 
      name: "Microsoft", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Crect fill='%23F25022' x='0' y='0' width='11' height='11'/%3E%3Crect fill='%237FBA00' x='13' y='0' width='11' height='11'/%3E%3Crect fill='%2300A4EF' x='0' y='13' width='11' height='11'/%3E%3Crect fill='%23FFB900' x='13' y='13' width='11' height='11'/%3E%3C/svg%3E"
    },
    { 
      name: "Apple", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000000'%3E%3Cpath d='M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z'/%3E%3C/svg%3E"
    },
    { 
      name: "Amazon", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23FF9900'%3E%3Cpath d='M12.18 10.82c-.02-.67-.35-1.03-1.03-1.03-.68 0-1.03.36-1.03 1.03v2.36c0 .67.35 1.03 1.03 1.03s1.03-.36 1.03-1.03v-2.36zm-5.36 0c-.02-.67-.35-1.03-1.03-1.03s-1.03.36-1.03 1.03v2.36c0 .67.35 1.03 1.03 1.03s1.03-.36 1.03-1.03v-2.36zm10.72 0c-.02-.67-.35-1.03-1.03-1.03s-1.03.36-1.03 1.03v2.36c0 .67.35 1.03 1.03 1.03s1.03-.36 1.03-1.03v-2.36z'/%3E%3Cpath d='M7.5 18.5c-2.5 1.5-5.5 2-7.5 2 2-1.5 3.5-3 4.5-5 1-2 1.5-4 1.5-6s-.5-4-1.5-6c-1-2-2.5-3.5-4.5-5 2 0 5 .5 7.5 2 2.5 1.5 4.5 3.5 5.5 5.5s1.5 4 1.5 6-.5 4-1.5 6-3 4-5.5 5.5z'/%3E%3C/svg%3E"
    },
    { 
      name: "Meta", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230066FF'%3E%3Cpath d='M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-2 15H8v-6h2v6zm-1-6.8c-.61 0-1.1-.49-1.1-1.1 0-.61.49-1.1 1.1-1.1.61 0 1.1.49 1.1 1.1 0 .61-.49 1.1-1.1 1.1zm8 6.8h-2v-3c0-1.1-.9-2-2-2s-2 .9-2 2v3h-2v-6h2v1.1c.5-.6 1.4-1.1 2.3-1.1 1.7 0 3.7 1 3.7 3.7v2.3z'/%3E%3C/svg%3E"
    },
    { 
      name: "Netflix", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E50914'%3E%3Cpath d='M5.398 0h-.398C2.262 0 0 2.262 0 5.398v13.204C0 21.738 2.262 24 5.398 24h13.204c3.136 0 5.398-2.262 5.398-5.398V5.398C24 2.262 21.738 0 18.602 0H5.398zm5.602 16.5l-5-5 5-5v10zm2-10l5 5-5 5V6.5z'/%3E%3C/svg%3E"
    },
    { 
      name: "Spotify", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231ED760'%3E%3Cpath d='M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z'/%3E%3C/svg%3E"
    },
    { 
      name: "Twitter", 
      logo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%231DA1F2'%3E%3Cpath d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'/%3E%3C/svg%3E"
    }
  ];

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="trusted-by-section">
      <div className="container">
        <div className="trusted-header">
          <h2>Trusted By</h2>
          <p>Leading brands worldwide partner with Trendorabay</p>
        </div>
        
        <div className="logos-marquee">
          <div className="logos-track">
            {duplicatedLogos.map((brand, index) => (
              <div key={index} className="logo-item">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  onError={(e) => {
                    // Fallback to text if SVG fails
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div 
                  style={{ 
                    display: 'none', 
                    fontSize: '18px', 
                    fontWeight: 'bold', 
                    color: '#1e2a1e',
                    textAlign: 'center'
                  }}
                >
                  {brand.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
