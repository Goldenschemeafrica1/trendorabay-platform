import React from 'react';

export const Skeleton = ({ className = '', variant = 'default' }) => {
  const baseClasses = 'animate-pulse bg-gray-200 rounded';
  
  const variantClasses = {
    default: 'h-4 w-full',
    text: 'h-4 w-3/4',
    title: 'h-8 w-1/2',
    image: 'h-48 w-full',
    card: 'h-64 w-full',
    avatar: 'h-12 w-12 rounded-full',
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant] || variantClasses.default} ${className}`} />
  );
};

export const StoryCardSkeleton = () => (
  <article className="nl-story-card">
    <div className="nl-card-img">
      <Skeleton variant="image" />
    </div>
    <div className="nl-card-body">
      <Skeleton variant="text" className="w-1/4 mb-2" />
      <Skeleton variant="title" className="mb-2" />
      <Skeleton variant="text" className="w-2/3 mb-2" />
      <Skeleton variant="text" className="w-1/3" />
    </div>
  </article>
);

export const MagazineCardSkeleton = () => (
  <div className="nl-magazine-hero">
    <Skeleton variant="card" className="w-48 h-64" />
    <div className="flex-1">
      <Skeleton variant="text" className="w-1/4 mb-2" />
      <Skeleton variant="title" className="mb-4" />
      <Skeleton variant="text" className="w-3/4 mb-4" />
      <Skeleton variant="text" className="w-1/3 mb-4" />
      <div className="flex gap-2">
        <Skeleton variant="text" className="w-24 h-10" />
        <Skeleton variant="text" className="w-24 h-10" />
      </div>
    </div>
  </div>
);

export default Skeleton;