import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './Breadcrumbs.css';

const Breadcrumbs = ({ separator = '/', customItems = [] }) => {
  const location = useLocation();
  
  const generateBreadcrumbs = () => {
    if (customItems.length > 0) {
      return customItems;
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [{ name: 'Home', path: '/' }];
    
    let currentPath = '';
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      // Handle special cases
      if (segment === 'category') {
        return; // Skip 'category' in breadcrumbs
      }
      
      breadcrumbs.push({ name, path: currentPath });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={item.path} className="breadcrumb-item">
              {index === 0 ? (
                <FaHome className="breadcrumb-home-icon" />
              ) : null}
              
              {isLast ? (
                <span className="breadcrumb-current">{item.name}</span>
              ) : (
                <Link to={item.path} className="breadcrumb-link">
                  {item.name}
                </Link>
              )}
              
              {!isLast && (
                <span className="breadcrumb-separator">{separator}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
