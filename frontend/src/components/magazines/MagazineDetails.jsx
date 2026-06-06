import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../../store/slices/cartSlice';
import { toast } from 'react-toastify';
import './MagazineDetails.css';

// Sample magazine data - same as LatestMagazine component
const sampleMagazines = [
  {
    id: 1,
    category: 'Tech & Innovation',
    subcategory: 'Technology',
    issue: 'Vol. 12 / Q1 2026',
    coverImage: '/assets/Tech.jpeg',
    coverImageLarge: '/assets/Tech.jpeg',
    pages: 128,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Amara Okafor',
    contributors: [
      { name: 'Kwame Mensah', role: 'Senior Writer', avatar: 'https://randomuser.me/api/portraits/men/1.jpg' },
      { name: 'Wanjiku Kimani', role: 'Tech Editor', avatar: 'https://randomuser.me/api/portraits/women/2.jpg' },
      { name: 'Efia Asante', role: 'Photographer', avatar: 'https://randomuser.me/api/portraits/women/3.jpg' },
      { name: 'Chidi Okonkwo', role: 'Contributor', avatar: 'https://randomuser.me/api/portraits/men/4.jpg' },
    ],
    tableOfContents: [
      { title: 'Editor\'s Note', page: 4 },
      { title: 'The AI Revolution in African Agriculture', page: 8 },
      { title: 'Fintech: The Next Frontier', page: 24 },
      { title: '30 Under 30: Tech Innovators', page: 42 },
      { title: 'Blockchain and Land Rights', page: 68 },
      { title: 'Investment Trends in African Tech', page: 84 },
      { title: 'Startup Spotlight: 10 to Watch', page: 102 },
      { title: 'Tech Events Calendar 2026', page: 118 },
    ],
    previewPages: [
      '/assets/Tech.jpeg',
      '/assets/Tech.jpeg',
      '/assets/Tech.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Michael Osei',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        rating: 5,
        date: '2026-01-20',
        comment: 'Best tech magazine on the continent. The AI coverage was exceptional!',
      },
      {
        id: 2,
        user: 'Fatima Diallo',
        avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
        rating: 4,
        date: '2026-01-18',
        comment: 'Great insights into African tech. Would love more West African coverage.',
      },
      {
        id: 3,
        user: 'John Mbeki',
        avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
        rating: 5,
        date: '2026-01-15',
        comment: 'The 30 Under 30 list is inspiring. Keep up the great work!',
      },
    ],
    relatedMagazines: [2, 3, 4, 7],
  },
  {
    id: 2,
    title: 'Vogue Africa',
    category: 'Fashion & Style',
    subcategory: 'Fashion',
    issue: 'Vol. 8 / Spring 2026',
    coverImage: '/assets/fashion.jpeg',
    coverImageLarge: '/assets/fashion.jpeg',
    description: 'African Fashion Week · Designer Spotlight · Cultural Heritage',
    fullDescription: `Vogue Africa celebrates the vibrant and diverse world of African fashion. This issue showcases the best of African design, from traditional textiles to contemporary couture.

  Features include:
  • African Fashion Week Highlights
  • Emerging Designers to Watch
  • Traditional Textiles in Modern Fashion
  • Celebrity Style Icons
  • Sustainable Fashion Movement`,
    price: 12.99,
    subscriptionPrice: 36.00,
    digitalPrice: 12.99,
    printPrice: 16.99,
    readers: 2100,
    rating: 4.9,
    reviewCount: 124,
    isNew: true,
    isFeatured: true,
    editorPick: false,
    publishDate: '2026-02-01',
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Amina Diallo',
    contributors: [
      { name: 'Zara Adeleke', role: 'Fashion Editor', avatar: 'https://randomuser.me/api/portraits/women/8.jpg' },
      { name: 'Kofi Annan Jr', role: 'Photographer', avatar: 'https://randomuser.me/api/portraits/men/9.jpg' },
    ],
    tableOfContents: [
      { title: 'Editor\'s Letter', page: 4 },
      { title: 'Fashion Week Roundup', page: 12 },
      { title: 'Designer Spotlight', page: 28 },
      { title: 'Textile Traditions', page: 44 },
      { title: 'Style Icons', page: 60 },
      { title: 'Sustainable Fashion', page: 76 },
    ],
    previewPages: [
      '/assets/fashion.jpeg',
      '/assets/fashion.jpeg',
      '/assets/fashion.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Nia Roberts',
        avatar: 'https://randomuser.me/api/portraits/women/10.jpg',
        rating: 5,
        date: '2026-02-05',
        comment: 'Absolutely stunning fashion photography! Love the focus on African designers.',
      },
    ],
    relatedMagazines: [1, 6, 7],
  },
  {
    id: 3,
    title: 'African Traveler',
    category: 'Travel & Adventure',
    subcategory: 'Travel',
    issue: 'Vol. 15 / March 2026',
    coverImage: '/assets/travel.jpeg',
    coverImageLarge: '/assets/travel.jpeg',
    description: 'Safari Adventures · Hidden Gems · Cultural Journeys',
    fullDescription: `African Traveler takes you on an unforgettable journey across the continent. From pristine beaches to majestic mountains, discover Africa's hidden treasures.

  This issue features:
  • Ultimate Safari Guide
  • Hidden Beach Paradises
  • Mountain Climbing Adventures
  • Cultural Festival Calendar
  • Budget Travel Tips`,
    price: 9.99,
    subscriptionPrice: 30.00,
    digitalPrice: 9.99,
    printPrice: 13.99,
    readers: 1850,
    rating: 4.7,
    reviewCount: 98,
    isNew: false,
    isFeatured: false,
    editorPick: true,
    publishDate: '2026-03-01',
    pages: 112,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'James Mwangi',
    contributors: [
      { name: 'Sarah Kamau', role: 'Travel Writer', avatar: 'https://randomuser.me/api/portraits/women/11.jpg' },
    ],
    tableOfContents: [
      { title: 'Travel Editor\'s Note', page: 4 },
      { title: 'Safari Adventures', page: 8 },
      { title: 'Coastal Paradise', page: 32 },
      { title: 'Mountain Expeditions', page: 56 },
      { title: 'Cultural Journeys', page: 80 },
    ],
    previewPages: [
      '/assets/travel.jpeg',
      '/assets/travel.jpeg',
      '/assets/travel.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Tom Wilson',
        avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
        rating: 4,
        date: '2026-03-10',
        comment: 'Great travel inspiration! Already planning my next trip.',
      },
    ],
    relatedMagazines: [1, 8],
  },
  {
    id: 4,
    title: 'Sports Africa',
    category: 'Sports Trends',
    subcategory: 'Sports',
    issue: 'Vol. 6 / April 2026',
    coverImage: '/assets/sports.jpeg',
    coverImageLarge: '/assets/sports.jpeg',
    description: 'Football Legends · Athletics · Rising Stars',
    fullDescription: `Sports Africa brings you the latest in African sports. From football legends to rising athletics stars, we cover it all.

  Stories:
  • African Football Legends
  • Track & Field Stars
  • Basketball Revolution
  • Women in Sports
  • Sports Infrastructure Development`,
    price: 7.99,
    subscriptionPrice: 24.00,
    digitalPrice: 7.99,
    printPrice: 11.99,
    readers: 3200,
    rating: 4.6,
    reviewCount: 156,
    isNew: false,
    isFeatured: false,
    editorPick: false,
    publishDate: '2026-04-01',
    pages: 88,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Michael Okoro',
    contributors: [
      { name: 'David Kofi', role: 'Sports Journalist', avatar: 'https://randomuser.me/api/portraits/men/13.jpg' },
    ],
    tableOfContents: [
      { title: 'Sports Editorial', page: 4 },
      { title: 'Football Heroes', page: 8 },
      { title: 'Athletics Excellence', page: 24 },
      { title: 'Basketball Boom', page: 40 },
      { title: 'Women\'s Sports', page: 56 },
    ],
    previewPages: [
      '/assets/sports.jpeg',
      '/assets/sports.jpeg',
      '/assets/sports.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Ahmed Hassan',
        avatar: 'https://randomuser.me/api/portraits/men/14.jpg',
        rating: 5,
        date: '2026-04-08',
        comment: 'Comprehensive sports coverage. Love the focus on African athletes!',
      },
    ],
    relatedMagazines: [1, 5],
  },
  {
    id: 5,
    title: 'Riders Magazine',
    category: 'Riders',
    subcategory: 'Motorcycle',
    issue: 'Vol. 4 / May 2026',
    coverImage: '/assets/riders.jpeg',
    coverImageLarge: '/assets/riders.jpeg',
    description: 'Motorcycle Culture · Custom Builds · Adventure Riding',
    fullDescription: `Riders Magazine celebrates motorcycle culture across Africa. From custom builds to adventure riding, we bring you the best of two-wheeled life.

  This issue:
  • Custom Motorcycle Showcase
  • Adventure Riding Routes
  • Motorcycle Safety Guide
  • Racing Scene Updates
  • Community Events`,
    price: 8.99,
    subscriptionPrice: 27.00,
    digitalPrice: 8.99,
    printPrice: 12.99,
    readers: 1450,
    rating: 4.5,
    reviewCount: 87,
    isNew: false,
    isFeatured: false,
    editorPick: false,
    publishDate: '2026-05-01',
    pages: 104,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Carlos Moyo',
    contributors: [
      { name: 'Sam Rider', role: 'Motorcycle Enthusiast', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
    ],
    tableOfContents: [
      { title: 'Rider\'s Welcome', page: 4 },
      { title: 'Custom Builds', page: 8 },
      { title: 'Adventure Routes', page: 32 },
      { title: 'Safety First', page: 56 },
      { title: 'Racing News', page: 80 },
    ],
    previewPages: [
      '/assets/riders.jpeg',
      '/assets/riders.jpeg',
      '/assets/riders.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Jake Moto',
        avatar: 'https://randomuser.me/api/portraits/men/16.jpg',
        rating: 4,
        date: '2026-05-12',
        comment: 'Great motorcycle content! Love the adventure riding section.',
      },
    ],
    relatedMagazines: [4, 3],
  },
  {
    id: 6,
    title: 'Wellness Africa',
    category: 'Lifestyle & Wellness',
    subcategory: 'Health',
    issue: 'Vol. 3 / June 2026',
    coverImage: '/assets/well_dress.jpeg',
    coverImageLarge: '/assets/well_dress.jpeg',
    description: 'Holistic Health · Mindfulness · Traditional Medicine',
    fullDescription: `Wellness Africa explores holistic health and wellbeing across the continent. From traditional healing to modern mindfulness, discover your path to wellness.

  Features:
  • Traditional African Medicine
  • Modern Mindfulness Practices
  • Nutrition and Diet
  • Mental Health Awareness
  • Fitness Trends`,
    price: 10.99,
    subscriptionPrice: 33.00,
    digitalPrice: 10.99,
    printPrice: 14.99,
    readers: 2800,
    rating: 4.8,
    reviewCount: 112,
    isNew: false,
    isFeatured: true,
    editorPick: true,
    publishDate: '2026-06-01',
    pages: 120,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Dr. Amina Health',
    contributors: [
      { name: 'Dr. James Wellness', role: 'Health Expert', avatar: 'https://randomuser.me/api/portraits/men/17.jpg' },
    ],
    tableOfContents: [
      { title: 'Wellness Editorial', page: 4 },
      { title: 'Traditional Healing', page: 8 },
      { title: 'Mindfulness Guide', page: 32 },
      { title: 'Nutrition Tips', page: 56 },
      { title: 'Mental Health', page: 80 },
    ],
    previewPages: [
      '/assets/well_dress.jpeg',
      '/assets/well_dress.jpeg',
      '/assets/well_dress.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Grace Peace',
        avatar: 'https://randomuser.me/api/portraits/women/18.jpg',
        rating: 5,
        date: '2026-06-15',
        comment: 'Excellent wellness content. Very informative and practical!',
      },
    ],
    relatedMagazines: [2, 7],
  },
  {
    id: 7,
    title: 'Art & Vision',
    category: 'Art & Photography',
    subcategory: 'Art',
    issue: 'Vol. 9 / July 2026',
    coverImage: '/assets/art.jpeg',
    coverImageLarge: '/assets/art.jpeg',
    description: 'Contemporary African Art · Photography · Creative Expressions',
    fullDescription: `Art & Vision showcases the best of contemporary African art and photography. Discover emerging artists and established masters.

  This issue:
  • Contemporary African Artists
  • Photography Excellence
  • Sculpture and Installation
  • Art Market Trends
  • Creative Workshops`,
    price: 11.99,
    subscriptionPrice: 36.00,
    digitalPrice: 11.99,
    printPrice: 15.99,
    readers: 1650,
    rating: 4.7,
    reviewCount: 93,
    isNew: false,
    isFeatured: false,
    editorPick: false,
    publishDate: '2026-07-01',
    pages: 132,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Art Director Maya',
    contributors: [
      { name: 'Picasso Africa', role: 'Art Critic', avatar: 'https://randomuser.me/api/portraits/men/18.jpg' },
    ],
    tableOfContents: [
      { title: 'Art Editorial', page: 4 },
      { title: 'Contemporary Artists', page: 8 },
      { title: 'Photography Showcase', page: 40 },
      { title: 'Sculpture Feature', page: 72 },
      { title: 'Art Market', page: 104 },
    ],
    previewPages: [
      '/assets/art.jpeg',
      '/assets/art.jpeg',
      '/assets/art.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Art Lover',
        avatar: 'https://randomuser.me/api/portraits/women/19.jpg',
        rating: 4,
        date: '2026-07-18',
        comment: 'Beautiful art showcase! Love discovering new African artists.',
      },
    ],
    relatedMagazines: [6, 8],
  },
  {
    id: 8,
    title: 'Culture Today',
    category: 'Culture',
    subcategory: 'Cultural',
    issue: 'Vol. 11 / August 2026',
    coverImage: '/assets/african.jpeg',
    coverImageLarge: '/assets/african.jpeg',
    description: 'Tradition Meets Modern · Heritage · Cultural Evolution',
    fullDescription: `Culture Today explores how African traditions evolve in the modern world. From ancient heritage to contemporary expressions, we celebrate cultural diversity.

  Features:
  • Cultural Heritage Preservation
  • Modern Traditional Fusion
  • Festival Highlights
  • Language and Literature
  • Cultural Exchange Programs`,
    price: 9.99,
    subscriptionPrice: 30.00,
    digitalPrice: 9.99,
    printPrice: 13.99,
    readers: 2400,
    rating: 4.9,
    reviewCount: 134,
    isNew: false,
    isFeatured: true,
    editorPick: true,
    publishDate: '2026-08-01',
    pages: 108,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Culture Editor Kwame',
    contributors: [
      { name: 'Heritage Expert', role: 'Cultural Anthropologist', avatar: 'https://randomuser.me/api/portraits/men/20.jpg' },
    ],
    tableOfContents: [
      { title: 'Cultural Editorial', page: 4 },
      { title: 'Heritage Preservation', page: 8 },
      { title: 'Modern Traditions', page: 32 },
      { title: 'Festival Guide', page: 56 },
      { title: 'Language & Literature', page: 80 },
    ],
    previewPages: [
      '/assets/african.jpeg',
      '/assets/african.jpeg',
      '/assets/african.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Culture Fan',
        avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
        rating: 5,
        date: '2026-08-22',
        comment: 'Rich cultural content! Very educational and inspiring.',
      },
    ],
    relatedMagazines: [3, 7],
  },
  {
    id: 9,
    title: 'Music Africa',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 1 / September 2026',
    coverImage: '/music.jpeg',
    coverImageLarge: '/music.jpeg',
    description: 'African Music Scene · Artist Spotlight · Genre Evolution',
    fullDescription: `Music Africa celebrates the vibrant and diverse music scene across the continent. From traditional rhythms to modern beats, we explore how African music is shaping global culture.

  Features:
  • African Music Industry Overview
  • Rising Stars to Watch
  • Traditional vs Modern Fusion
  • Music Festival Guide
  • Producer Spotlight`,
    price: 8.99,
    subscriptionPrice: 27.00,
    digitalPrice: 8.99,
    printPrice: 12.99,
    readers: 3500,
    rating: 4.8,
    reviewCount: 145,
    isNew: true,
    isFeatured: true,
    editorPick: true,
    publishDate: '2026-09-01',
    pages: 116,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'DJ Africa',
    contributors: [
      { name: 'Melody Maker', role: 'Music Editor', avatar: 'https://randomuser.me/api/portraits/men/21.jpg' },
    ],
    tableOfContents: [
      { title: 'Music Editorial', page: 4 },
      { title: 'Industry Overview', page: 8 },
      { title: 'Artist Spotlight', page: 32 },
      { title: 'Genre Evolution', page: 56 },
      { title: 'Festival Guide', page: 80 },
    ],
    previewPages: [
      '/music1.jpeg',
      '/music2.jpeg',
      '/music3.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Music Fan',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        rating: 5,
        date: '2026-09-10',
        comment: 'Amazing coverage of African music! Love the artist spotlights.',
      },
    ],
    relatedMagazines: [1, 8],
  },
  {
    id: 10,
    title: 'Women in Business',
    category: 'Business & Entrepreneurship',
    subcategory: 'Business',
    issue: 'Vol. 2 / October 2026',
    coverImage: '/womeninbusiness.jpeg',
    coverImageLarge: '/womeninbusiness.jpeg',
    description: 'Female Entrepreneurs · Leadership · Success Stories',
    fullDescription: `Women in Business highlights the achievements of female entrepreneurs across Africa. From startups to corporate leadership, we celebrate women breaking barriers.

  Stories:
  • Top Female Entrepreneurs
  • Leadership Lessons
  • Startup Success Stories
  • Work-Life Balance
  • Investment Tips`,
    price: 11.99,
    subscriptionPrice: 36.00,
    digitalPrice: 11.99,
    printPrice: 15.99,
    readers: 2800,
    rating: 4.9,
    reviewCount: 167,
    isNew: true,
    isFeatured: true,
    editorPick: true,
    publishDate: '2026-10-01',
    pages: 124,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Sarah Business',
    contributors: [
      { name: 'Emma Leader', role: 'Business Editor', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
    ],
    tableOfContents: [
      { title: 'Business Editorial', page: 4 },
      { title: 'Entrepreneur Spotlight', page: 8 },
      { title: 'Leadership Lessons', page: 32 },
      { title: 'Success Stories', page: 56 },
      { title: 'Investment Guide', page: 80 },
    ],
    previewPages: [
      '/womeninbusiness.jpeg',
      '/womeninbusiness.jpeg',
      '/womeninbusiness.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Female Founder',
        avatar: 'https://randomuser.me/api/portraits/women/23.jpg',
        rating: 5,
        date: '2026-10-15',
        comment: 'Inspiring stories of women in business. Very motivational!',
      },
    ],
    relatedMagazines: [1, 2],
  },
  {
    id: 11,
    title: 'Youth in Policy',
    category: 'Politics & Policy',
    subcategory: 'Politics',
    issue: 'Vol. 1 / November 2026',
    coverImage: '/youthinpolicy.jpeg',
    coverImageLarge: '/youthinpolicy.jpeg',
    description: 'Youth Leadership · Policy Making · Civic Engagement',
    fullDescription: `Youth in Policy explores how young Africans are shaping the future of governance and policy across the continent.

  Features:
  • Young Leaders Making Change
  • Policy Reform Initiatives
  • Civic Engagement Guide
  • Youth in Parliament
  • Future of African Politics`,
    price: 9.99,
    subscriptionPrice: 30.00,
    digitalPrice: 9.99,
    printPrice: 13.99,
    readers: 1900,
    rating: 4.7,
    reviewCount: 89,
    isNew: true,
    isFeatured: false,
    editorPick: true,
    publishDate: '2026-11-01',
    pages: 108,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Policy Expert',
    contributors: [
      { name: 'Young Leader', role: 'Political Analyst', avatar: 'https://randomuser.me/api/portraits/men/23.jpg' },
    ],
    tableOfContents: [
      { title: 'Policy Editorial', page: 4 },
      { title: 'Youth Leadership', page: 8 },
      { title: 'Policy Reform', page: 32 },
      { title: 'Civic Engagement', page: 56 },
      { title: 'Future Politics', page: 80 },
    ],
    previewPages: [
      '/youthinpolicy1.jpeg',
      '/youthinpolicy3.jpeg',
      '/youthinpolicy.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Civic Activist',
        avatar: 'https://randomuser.me/api/portraits/men/24.jpg',
        rating: 4,
        date: '2026-11-10',
        comment: 'Important coverage of youth in politics. Keep it up!',
      },
    ],
    relatedMagazines: [1, 10],
  },
  {
    id: 12,
    title: 'Automotives Africa',
    category: 'Automotive',
    subcategory: 'Cars',
    issue: 'Vol. 1 / December 2026',
    coverImage: '/automotives.jpeg',
    coverImageLarge: '/automotives.jpeg',
    description: 'Car Reviews · Industry News · Electric Vehicles',
    fullDescription: `Automotives Africa brings you the latest in the African automotive industry. From car reviews to industry trends, we cover it all.

  Stories:
  • African Car Market
  • Electric Vehicle Revolution
  • Local Manufacturing
  • Car Reviews
  • Industry Future`,
    price: 10.99,
    subscriptionPrice: 33.00,
    digitalPrice: 10.99,
    printPrice: 14.99,
    readers: 2200,
    rating: 4.6,
    reviewCount: 78,
    isNew: true,
    isFeatured: false,
    editorPick: false,
    publishDate: '2026-12-01',
    pages: 112,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Auto Expert',
    contributors: [
      { name: 'Car Reviewer', role: 'Automotive Journalist', avatar: 'https://randomuser.me/api/portraits/men/25.jpg' },
    ],
    tableOfContents: [
      { title: 'Auto Editorial', page: 4 },
      { title: 'Market Overview', page: 8 },
      { title: 'EV Revolution', page: 32 },
      { title: 'Local Manufacturing', page: 56 },
      { title: 'Car Reviews', page: 80 },
    ],
    previewPages: [
      '/automotives1.jpeg',
      '/automotives.jpeg',
      '/automotives.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Car Enthusiast',
        avatar: 'https://randomuser.me/api/portraits/men/26.jpg',
        rating: 4,
        date: '2026-12-10',
        comment: 'Great automotive coverage for the African market!',
      },
    ],
    relatedMagazines: [4, 5],
  },
  {
    id: 13,
    title: 'Kids World Africa',
    category: 'Kids & Family',
    subcategory: 'Kids',
    issue: 'Vol. 1 / January 2027',
    coverImage: '/kids.jpeg',
    coverImageLarge: '/kids.jpeg',
    description: 'Children Education · Fun Activities · Parenting Tips',
    fullDescription: `Kids World Africa is dedicated to children across the continent. Educational content, fun activities, and parenting tips.

  Features:
  • Educational Activities
  • African Folktales
  • Parenting Guide
  • Kids Health
  • Creative Learning`,
    price: 7.99,
    subscriptionPrice: 24.00,
    digitalPrice: 7.99,
    printPrice: 11.99,
    readers: 4100,
    rating: 4.8,
    reviewCount: 198,
    isNew: true,
    isFeatured: true,
    editorPick: true,
    publishDate: '2027-01-01',
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Kids Editor',
    contributors: [
      { name: 'Child Expert', role: 'Education Specialist', avatar: 'https://randomuser.me/api/portraits/women/24.jpg' },
    ],
    tableOfContents: [
      { title: 'Kids Editorial', page: 4 },
      { title: 'Educational Activities', page: 8 },
      { title: 'African Folktales', page: 32 },
      { title: 'Parenting Guide', page: 56 },
      { title: 'Creative Learning', page: 80 },
    ],
    previewPages: [
      '/kids2.jpeg',
      '/kids3.jpeg',
      '/kids.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Parent',
        avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
        rating: 5,
        date: '2027-01-15',
        comment: 'My kids love this magazine! Great educational content.',
      },
    ],
    relatedMagazines: [6, 8],
  },
  {
    id: 14,
    title: 'Blockchain Africa',
    category: 'Technology',
    subcategory: 'Blockchain',
    issue: 'Vol. 1 / February 2027',
    coverImage: '/blockchain.jpeg',
    coverImageLarge: '/blockchain.jpeg',
    description: 'Cryptocurrency · DeFi · Web3 · Digital Assets',
    fullDescription: `Blockchain Africa explores the blockchain revolution across the continent. From cryptocurrency to Web3, we cover the future of finance.

  Stories:
  • African Crypto Adoption
  • DeFi Revolution
  • Web3 Development
  • NFT Market
  • Digital Assets`,
    price: 12.99,
    subscriptionPrice: 39.00,
    digitalPrice: 12.99,
    printPrice: 16.99,
    readers: 1650,
    rating: 4.7,
    reviewCount: 92,
    isNew: true,
    isFeatured: false,
    editorPick: true,
    publishDate: '2027-02-01',
    pages: 120,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Blockchain Expert',
    contributors: [
      { name: 'Crypto Analyst', role: 'Blockchain Writer', avatar: 'https://randomuser.me/api/portraits/men/27.jpg' },
    ],
    tableOfContents: [
      { title: 'Blockchain Editorial', page: 4 },
      { title: 'Crypto Adoption', page: 8 },
      { title: 'DeFi Revolution', page: 32 },
      { title: 'Web3 Development', page: 56 },
      { title: 'NFT Market', page: 80 },
    ],
    previewPages: [
      '/blockchain.jpeg',
      '/blockchain.jpeg',
      '/blockchain.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Crypto Investor',
        avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
        rating: 4,
        date: '2027-02-10',
        comment: 'Great blockchain coverage for the African market!',
      },
    ],
    relatedMagazines: [1, 14],
  },
  {
    id: 15,
    title: 'Fashion & Business',
    category: 'Fashion & Business',
    subcategory: 'Fashion',
    issue: 'Vol. 1 / March 2027',
    coverImage: '/fashionandbusiness.jpeg',
    coverImageLarge: '/fashionandbusiness.jpeg',
    description: 'Fashion Industry · Business of Style · Brand Building',
    fullDescription: `Fashion & Business explores the intersection of fashion and business. From brand building to industry trends, we cover it all.

  Features:
  • Fashion Business Guide
  • Brand Building
  • Industry Trends
  • Fashion Tech
  • Sustainable Fashion Business`,
    price: 11.99,
    subscriptionPrice: 36.00,
    digitalPrice: 11.99,
    printPrice: 15.99,
    readers: 1950,
    rating: 4.6,
    reviewCount: 87,
    isNew: true,
    isFeatured: false,
    editorPick: false,
    publishDate: '2027-03-01',
    pages: 108,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Fashion Business Editor',
    contributors: [
      { name: 'Style Expert', role: 'Fashion Writer', avatar: 'https://randomuser.me/api/portraits/women/26.jpg' },
    ],
    tableOfContents: [
      { title: 'Fashion Business Editorial', page: 4 },
      { title: 'Business Guide', page: 8 },
      { title: 'Brand Building', page: 32 },
      { title: 'Industry Trends', page: 56 },
      { title: 'Fashion Tech', page: 80 },
    ],
    previewPages: [
      '/fashionandbusiness.jpeg',
      '/fashionandbusiness.jpeg',
      '/fashionandbusiness.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Fashion Entrepreneur',
        avatar: 'https://randomuser.me/api/portraits/women/27.jpg',
        rating: 4,
        date: '2027-03-10',
        comment: 'Great insights into the fashion business!',
      },
    ],
    relatedMagazines: [2, 10],
  },
  {
    id: 16,
    title: 'Social Trends',
    category: 'Lifestyle',
    subcategory: 'Social',
    issue: 'Vol. 1 / April 2027',
    coverImage: '/socialtrends.jpeg',
    coverImageLarge: '/socialtrends.jpeg',
    description: 'Social Media · Digital Culture · Trend Analysis',
    fullDescription: `Social Trends analyzes the latest social media trends and digital culture across Africa.

  Stories:
  • Social Media Landscape
  • Digital Culture
  • Influencer Economy
  • Viral Trends
  • Future of Social`,
    price: 9.99,
    subscriptionPrice: 30.00,
    digitalPrice: 9.99,
    printPrice: 13.99,
    readers: 2900,
    rating: 4.5,
    reviewCount: 112,
    isNew: true,
    isFeatured: false,
    editorPick: false,
    publishDate: '2027-04-01',
    pages: 104,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Social Media Expert',
    contributors: [
      { name: 'Trend Analyst', role: 'Social Writer', avatar: 'https://randomuser.me/api/portraits/women/28.jpg' },
    ],
    tableOfContents: [
      { title: 'Social Trends Editorial', page: 4 },
      { title: 'Social Media Landscape', page: 8 },
      { title: 'Digital Culture', page: 32 },
      { title: 'Influencer Economy', page: 56 },
      { title: 'Future of Social', page: 80 },
    ],
    previewPages: [
      '/socialtrends.jpeg',
      '/socialtrends.jpeg',
      '/socialtrends.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Social Media User',
        avatar: 'https://randomuser.me/api/portraits/women/29.jpg',
        rating: 4,
        date: '2027-04-10',
        comment: 'Interesting analysis of social trends in Africa!',
      },
    ],
    relatedMagazines: [8, 9],
  },
  {
    id: 17,
    title: 'Pets Africa',
    category: 'Lifestyle',
    subcategory: 'Pets',
    issue: 'Vol. 1 / May 2027',
    coverImage: '/pets.jpeg',
    coverImageLarge: '/pets.jpeg',
    description: 'Pet Care · Animal Welfare · Pet Lifestyle',
    fullDescription: `Pets Africa celebrates our furry friends across the continent. Pet care tips, animal welfare, and pet lifestyle.

  Features:
  • Pet Care Guide
  • Animal Welfare
  • Pet Nutrition
  • Training Tips
  • Pet Stories`,
    price: 8.99,
    subscriptionPrice: 27.00,
    digitalPrice: 8.99,
    printPrice: 12.99,
    readers: 2400,
    rating: 4.7,
    reviewCount: 98,
    isNew: true,
    isFeatured: false,
    editorPick: false,
    publishDate: '2027-05-01',
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Pet Expert',
    contributors: [
      { name: 'Vet Africa', role: 'Veterinarian', avatar: 'https://randomuser.me/api/portraits/men/29.jpg' },
    ],
    tableOfContents: [
      { title: 'Pets Editorial', page: 4 },
      { title: 'Pet Care Guide', page: 8 },
      { title: 'Animal Welfare', page: 32 },
      { title: 'Pet Nutrition', page: 56 },
      { title: 'Training Tips', page: 80 },
    ],
    previewPages: [
      '/pets.jpeg',
      '/pets.jpeg',
      '/pets.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Pet Owner',
        avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
        rating: 5,
        date: '2027-05-10',
        comment: 'Great pet care content for African pet owners!',
      },
    ],
    relatedMagazines: [6, 13],
  },
  {
    id: 18,
    title: 'Community Africa',
    category: 'Community',
    subcategory: 'Community',
    issue: 'Vol. 1 / June 2027',
    coverImage: '/community.jpeg',
    coverImageLarge: '/community.jpeg',
    description: 'Community Building · Local Initiatives · Social Impact',
    fullDescription: `Community Africa highlights community building initiatives across the continent. Local projects making a difference.

  Stories:
  • Community Projects
  • Local Initiatives
  • Social Impact
  • Volunteer Stories
  • Community Leadership`,
    price: 9.99,
    subscriptionPrice: 30.00,
    digitalPrice: 9.99,
    printPrice: 13.99,
    readers: 2100,
    rating: 4.8,
    reviewCount: 134,
    isNew: true,
    isFeatured: true,
    editorPick: true,
    publishDate: '2027-06-01',
    pages: 112,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Community Leader',
    contributors: [
      { name: 'Social Worker', role: 'Community Writer', avatar: 'https://randomuser.me/api/portraits/women/31.jpg' },
    ],
    tableOfContents: [
      { title: 'Community Editorial', page: 4 },
      { title: 'Community Projects', page: 8 },
      { title: 'Local Initiatives', page: 32 },
      { title: 'Social Impact', page: 56 },
      { title: 'Community Leadership', page: 80 },
    ],
    previewPages: [
      '/community.jpeg',
      '/community.jpeg',
      '/community.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Community Activist',
        avatar: 'https://randomuser.me/api/portraits/men/30.jpg',
        rating: 5,
        date: '2027-06-10',
        comment: 'Inspiring community stories across Africa!',
      },
    ],
    relatedMagazines: [8, 10],
  },
  {
    id: 19,
    title: 'Relationships Africa',
    category: 'Lifestyle',
    subcategory: 'Relationships',
    issue: 'Vol. 1 / July 2027',
    coverImage: '/relationship.jpeg',
    coverImageLarge: '/relationship.jpeg',
    description: 'Love & Relationships · Dating · Family Dynamics',
    fullDescription: `Relationships Africa explores love, dating, and family dynamics across the continent. Relationship advice and stories.

  Features:
  • Dating Guide
  • Relationship Advice
  • Family Dynamics
  • Love Stories
  • Communication Tips`,
    price: 8.99,
    subscriptionPrice: 27.00,
    digitalPrice: 8.99,
    printPrice: 12.99,
    readers: 3800,
    rating: 4.6,
    reviewCount: 178,
    isNew: true,
    isFeatured: false,
    editorPick: false,
    publishDate: '2027-07-01',
    pages: 104,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Relationship Expert',
    contributors: [
      { name: 'Love Coach', role: 'Relationship Writer', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
    ],
    tableOfContents: [
      { title: 'Relationship Editorial', page: 4 },
      { title: 'Dating Guide', page: 8 },
      { title: 'Relationship Advice', page: 32 },
      { title: 'Family Dynamics', page: 56 },
      { title: 'Communication Tips', page: 80 },
    ],
    previewPages: [
      '/relationship.jpeg',
      '/relationship.jpeg',
      '/relationship.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Relationship Reader',
        avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
        rating: 4,
        date: '2027-07-10',
        comment: 'Helpful relationship advice for African readers!',
      },
    ],
    relatedMagazines: [6, 16],
  },
  {
    id: 20,
    title: 'Finance & Investments',
    category: 'Finance',
    subcategory: 'Investments',
    issue: 'Vol. 1 / August 2027',
    coverImage: '/financeandinvestment.jpeg',
    coverImageLarge: '/financeandinvestment.jpeg',
    description: 'Personal Finance · Investment Guide · Wealth Building',
    fullDescription: `Finance & Investments provides expert advice on personal finance and wealth building across Africa.

  Stories:
  • Investment Guide
  • Personal Finance Tips
  • Wealth Building
  • African Markets
  • Financial Planning`,
    price: 12.99,
    subscriptionPrice: 39.00,
    digitalPrice: 12.99,
    printPrice: 16.99,
    readers: 3200,
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
    isFeatured: true,
    editorPick: true,
    publishDate: '2027-08-01',
    pages: 128,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Finance Expert',
    contributors: [
      { name: 'Investment Advisor', role: 'Finance Writer', avatar: 'https://randomuser.me/api/portraits/men/31.jpg' },
    ],
    tableOfContents: [
      { title: 'Finance Editorial', page: 4 },
      { title: 'Investment Guide', page: 8 },
      { title: 'Personal Finance', page: 32 },
      { title: 'Wealth Building', page: 56 },
      { title: 'Financial Planning', page: 80 },
    ],
    previewPages: [
      '/financeandinvestment.jpeg',
      '/financeandinvestment.jpeg',
      '/financeandinvestment.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Investor',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 5,
        date: '2027-08-10',
        comment: 'Excellent investment advice for the African market!',
      },
    ],
    relatedMagazines: [1, 10],
  },
  {
    id: 21,
    title: 'Bar & Restaurant',
    category: 'Food & Beverage',
    subcategory: 'Hospitality',
    issue: 'Vol. 1 / September 2027',
    coverImage: '/barandrestaurant.jpeg',
    coverImageLarge: '/barandrestaurant.jpeg',
    description: 'Nightlife · Dining · Hospitality Industry',
    fullDescription: `Bar & Restaurant showcases the best of African nightlife and dining. From trendy bars to fine dining restaurants.

  Features:
  • Nightlife Guide
  • Restaurant Reviews
  • Hospitality Industry
  • Cocktail Culture
  • Food Trends`,
    price: 10.99,
    subscriptionPrice: 33.00,
    digitalPrice: 10.99,
    printPrice: 14.99,
    readers: 2600,
    rating: 4.5,
    reviewCount: 92,
    isNew: true,
    isFeatured: false,
    editorPick: false,
    publishDate: '2027-09-01',
    pages: 108,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Hospitality Expert',
    contributors: [
      { name: 'Food Critic', role: 'Restaurant Writer', avatar: 'https://randomuser.me/api/portraits/women/34.jpg' },
    ],
    tableOfContents: [
      { title: 'Hospitality Editorial', page: 4 },
      { title: 'Nightlife Guide', page: 8 },
      { title: 'Restaurant Reviews', page: 32 },
      { title: 'Cocktail Culture', page: 56 },
      { title: 'Food Trends', page: 80 },
    ],
    previewPages: [
      '/barandrestaurant.jpeg',
      '/barandrestaurant.jpeg',
      '/barandrestaurant.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Foodie',
        avatar: 'https://randomuser.me/api/portraits/women/35.jpg',
        rating: 4,
        date: '2027-09-10',
        comment: 'Great coverage of African dining and nightlife!',
      },
    ],
    relatedMagazines: [2, 6],
  },
  {
    id: 22,
    title: 'Gamers Africa',
    category: 'Gaming',
    subcategory: 'Gaming',
    issue: 'Vol. 1 / October 2027',
    coverImage: '/gamers.jpeg',
    coverImageLarge: '/gamers.jpeg',
    description: 'Video Games · Esports · Gaming Culture',
    fullDescription: `Gamers Africa covers the gaming scene across the continent. From video games to esports, we explore gaming culture.

  Stories:
  • African Gaming Scene
  • Esports Tournaments
  • Game Reviews
  • Gaming Industry
  • Gaming Culture`,
    price: 9.99,
    subscriptionPrice: 30.00,
    digitalPrice: 9.99,
    printPrice: 13.99,
    readers: 3100,
    rating: 4.7,
    reviewCount: 145,
    isNew: true,
    isFeatured: false,
    editorPick: true,
    publishDate: '2027-10-01',
    pages: 112,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Gaming Expert',
    contributors: [
      { name: 'Pro Gamer', role: 'Gaming Writer', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
    ],
    tableOfContents: [
      { title: 'Gaming Editorial', page: 4 },
      { title: 'Gaming Scene', page: 8 },
      { title: 'Esports Tournaments', page: 32 },
      { title: 'Game Reviews', page: 56 },
      { title: 'Gaming Culture', page: 80 },
    ],
    previewPages: [
      '/gamers.jpeg',
      '/gamers.jpeg',
      '/gamers.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Gamer',
        avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
        rating: 5,
        date: '2027-10-10',
        comment: 'Amazing coverage of African gaming!',
      },
    ],
    relatedMagazines: [1, 9],
  },
  {
    id: 23,
    title: 'Matatu Culture',
    category: 'Culture',
    subcategory: 'Transportation',
    issue: 'Vol. 1 / November 2027',
    coverImage: '/matatuculture.jpeg',
    coverImageLarge: '/matatuculture.jpeg',
    description: 'Matatu Art · Public Transport · Urban Culture',
    fullDescription: `Matatu Culture celebrates the unique art and culture of African public transport. From matatu art to urban mobility.

  Features:
  • Matatu Art Showcase
  • Public Transport Culture
  • Urban Mobility
  • Matatu Stories
  • Transport Innovation`,
    price: 8.99,
    subscriptionPrice: 27.00,
    digitalPrice: 8.99,
    printPrice: 12.99,
    readers: 2800,
    rating: 4.9,
    reviewCount: 167,
    isNew: true,
    isFeatured: true,
    editorPick: true,
    publishDate: '2027-11-01',
    pages: 104,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Culture Expert',
    contributors: [
      { name: 'Matatu Artist', role: 'Culture Writer', avatar: 'https://randomuser.me/api/portraits/men/35.jpg' },
    ],
    tableOfContents: [
      { title: 'Matatu Editorial', page: 4 },
      { title: 'Matatu Art', page: 8 },
      { title: 'Transport Culture', page: 32 },
      { title: 'Urban Mobility', page: 56 },
      { title: 'Transport Innovation', page: 80 },
    ],
    previewPages: [
      '/matatuculture.jpeg',
      '/matatuculture.jpeg',
      '/matatuculture.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Matatu Fan',
        avatar: 'https://randomuser.me/api/portraits/men/36.jpg',
        rating: 5,
        date: '2027-11-10',
        comment: 'Love the celebration of matatu culture!',
      },
    ],
    relatedMagazines: [5, 8],
  },
  {
    id: 24,
    title: 'Boxing Africa',
    category: 'Sports',
    subcategory: 'Boxing',
    issue: 'Vol. 1 / December 2027',
    coverImage: '/boxing.jpeg',
    coverImageLarge: '/boxing.jpeg',
    description: 'Boxing Champions · Fight Night · African Fighters',
    fullDescription: `Boxing Africa celebrates African boxing champions and fighters. From legendary champions to rising stars, we cover the boxing scene across the continent.

  Stories:
  • African Boxing Champions
  • Fight Night Coverage
  • Rising Stars
  • Training Techniques
  • Boxing Industry`,
    price: 9.99,
    subscriptionPrice: 30.00,
    digitalPrice: 9.99,
    printPrice: 13.99,
    readers: 2300,
    rating: 4.7,
    reviewCount: 112,
    isNew: true,
    isFeatured: false,
    editorPick: false,
    publishDate: '2027-12-01',
    pages: 104,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Boxing Expert',
    contributors: [
      { name: 'Fight Analyst', role: 'Sports Writer', avatar: 'https://randomuser.me/api/portraits/men/37.jpg' },
    ],
    tableOfContents: [
      { title: 'Boxing Editorial', page: 4 },
      { title: 'Champions', page: 8 },
      { title: 'Fight Night', page: 32 },
      { title: 'Rising Stars', page: 56 },
      { title: 'Training', page: 80 },
    ],
    previewPages: [
      '/boxing.jpeg',
      '/boxing.jpeg',
      '/boxing.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Boxing Fan',
        avatar: 'https://randomuser.me/api/portraits/men/38.jpg',
        rating: 4,
        date: '2027-12-10',
        comment: 'Great boxing coverage for African fighters!',
      },
    ],
    relatedMagazines: [4, 22],
  },
  {
    id: 25,
    title: 'Leading with Purpose',
    category: 'Leadership',
    subcategory: 'Business',
    issue: 'Vol. 1 / January 2028',
    coverImage: '/leadingwithpurpose.jpeg',
    coverImageLarge: '/leadingwithpurpose.jpeg',
    description: 'Leadership Skills · Purpose-Driven · Success Stories',
    fullDescription: `Leading with Purpose explores leadership across Africa. From purpose-driven leadership to success stories, we inspire the next generation of leaders.

  Features:
  • Leadership Skills
  • Purpose-Driven Leadership
  • Success Stories
  • Management Tips
  • Future Leaders`,
    price: 11.99,
    subscriptionPrice: 36.00,
    digitalPrice: 11.99,
    printPrice: 15.99,
    readers: 1900,
    rating: 4.8,
    reviewCount: 98,
    isNew: true,
    isFeatured: true,
    editorPick: true,
    publishDate: '2028-01-01',
    pages: 112,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Leadership Expert',
    contributors: [
      { name: 'CEO Africa', role: 'Leadership Writer', avatar: 'https://randomuser.me/api/portraits/women/36.jpg' },
    ],
    tableOfContents: [
      { title: 'Leadership Editorial', page: 4 },
      { title: 'Leadership Skills', page: 8 },
      { title: 'Purpose-Driven', page: 32 },
      { title: 'Success Stories', page: 56 },
      { title: 'Future Leaders', page: 80 },
    ],
    previewPages: [
      '/leadingwithpurpose.jpeg',
      '/leadingwithpurpose.jpeg',
      '/leadingwithpurpose.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Business Leader',
        avatar: 'https://randomuser.me/api/portraits/men/39.jpg',
        rating: 5,
        date: '2028-01-10',
        comment: 'Inspiring leadership content for African leaders!',
      },
    ],
    relatedMagazines: [10, 20],
  },
  {
    id: 26,
    title: 'Photography Africa',
    category: 'Art & Photography',
    subcategory: 'Photography',
    issue: 'Vol. 1 / February 2028',
    coverImage: '/photography.jpeg',
    coverImageLarge: '/photography.jpeg',
    description: 'African Photography · Visual Storytelling · Photo Essays',
    fullDescription: `Photography Africa showcases the best of African photography. From visual storytelling to photo essays, we celebrate African photographers.

  Stories:
  • African Photographers
  • Visual Storytelling
  • Photo Essays
  • Photography Techniques
  • Photo Industry`,
    price: 10.99,
    subscriptionPrice: 33.00,
    digitalPrice: 10.99,
    printPrice: 14.99,
    readers: 1700,
    rating: 4.6,
    reviewCount: 87,
    isNew: true,
    isFeatured: false,
    editorPick: false,
    publishDate: '2028-02-01',
    pages: 108,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Photo Editor',
    contributors: [
      { name: 'Photo Pro', role: 'Photography Writer', avatar: 'https://randomuser.me/api/portraits/women/37.jpg' },
    ],
    tableOfContents: [
      { title: 'Photo Editorial', page: 4 },
      { title: 'Photographers', page: 8 },
      { title: 'Visual Storytelling', page: 32 },
      { title: 'Photo Essays', page: 56 },
      { title: 'Photo Industry', page: 80 },
    ],
    previewPages: [
      '/photography.jpeg',
      '/photography.jpeg',
      '/photography.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Photographer',
        avatar: 'https://randomuser.me/api/portraits/men/40.jpg',
        rating: 4,
        date: '2028-02-10',
        comment: 'Great photography showcase from across Africa!',
      },
    ],
    relatedMagazines: [7, 8],
  },
  {
    id: 27,
    title: 'The Unity',
    category: 'Culture',
    subcategory: 'Unity',
    issue: 'Vol. 1 / March 2028',
    coverImage: '/theunity.jpeg',
    coverImageLarge: '/theunity.jpeg',
    description: 'African Unity · Cultural Connection · Together We Rise',
    fullDescription: `The Unity celebrates African unity and cultural connection. From pan-African movements to cultural connections, we explore what unites us.

  Features:
  • African Unity
  • Cultural Connection
  • Pan-African Movements
  • Unity Stories
  • Together We Rise`,
    price: 8.99,
    subscriptionPrice: 27.00,
    digitalPrice: 8.99,
    printPrice: 12.99,
    readers: 2500,
    rating: 4.9,
    reviewCount: 145,
    isNew: true,
    isFeatured: true,
    editorPick: true,
    publishDate: '2028-03-01',
    pages: 104,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Unity Editor',
    contributors: [
      { name: 'Unity Activist', role: 'Culture Writer', avatar: 'https://randomuser.me/api/portraits/men/41.jpg' },
    ],
    tableOfContents: [
      { title: 'Unity Editorial', page: 4 },
      { title: 'African Unity', page: 8 },
      { title: 'Cultural Connection', page: 32 },
      { title: 'Pan-African', page: 56 },
      { title: 'Together We Rise', page: 80 },
    ],
    previewPages: [
      '/theunity.jpeg',
      '/theunity.jpeg',
      '/theunity.jpeg',
    ],
    reviews: [
      {
        id: 1,
        user: 'Unity Supporter',
        avatar: 'https://randomuser.me/api/portraits/women/38.jpg',
        rating: 5,
        date: '2028-03-10',
        comment: 'Beautiful celebration of African unity!',
      },
    ],
    relatedMagazines: [8, 18],
  },
  {
    id: 28,
    title: 'Automotive World',
    category: 'Automotive',
    subcategory: 'Cars',
    issue: 'Vol. 2 / January 2028',
    coverImage: '/automotives1.jpeg',
    coverImageLarge: '/automotives1.jpeg',
    description: 'Car Reviews · Future Tech · Racing',
    fullDescription: `Automotive World brings you the latest in car technology, reviews, and racing news from around the globe.

  Features:
  • Latest Car Reviews
  • Electric Vehicle Revolution
  • Racing Championships
  • Future of Transportation`,
    pages: 128,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'James Motor',
    contributors: [
      { name: 'Sarah Driver', role: 'Senior Writer', avatar: 'https://randomuser.me/api/portraits/women/22.jpg' },
      { name: 'Mike Speed', role: 'Tech Editor', avatar: 'https://randomuser.me/api/portraits/men/22.jpg' },
    ],
    tableOfContents: [
      'The Future of Electric Cars',
      'Top 10 Sports Cars of 2028',
      'Racing Season Preview',
      'Auto Tech Innovations',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Car Enthusiast',
        avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
        rating: 5,
        date: '2028-01-15',
        comment: 'Great automotive content!',
      },
    ],
    relatedMagazines: [12, 5],
  },
  {
    id: 29,
    title: 'Fashion Forward',
    category: 'Fashion & Business',
    subcategory: 'Fashion',
    issue: 'Vol. 2 / April 2028',
    coverImage: '/fashinandbusiness..jpeg',
    coverImageLarge: '/fashinandbusiness..jpeg',
    description: 'Trend Forecast · Designer Spotlight · Business of Fashion',
    fullDescription: `Fashion Forward explores the intersection of style and business in the fashion industry.

  Features:
  • Spring/Summer Trends
  • Emerging Designers
  • Fashion Business Strategies
  • Sustainable Fashion`,
    pages: 128,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Emma Style',
    contributors: [
      { name: 'Lucy Trend', role: 'Fashion Editor', avatar: 'https://randomuser.me/api/portraits/women/23.jpg' },
      { name: 'David Business', role: 'Business Writer', avatar: 'https://randomuser.me/api/portraits/men/24.jpg' },
    ],
    tableOfContents: [
      'Spring Fashion Forecast',
      'Designer Spotlight',
      'Fashion Business Models',
      'Sustainable Style',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Fashion Lover',
        avatar: 'https://randomuser.me/api/portraits/women/24.jpg',
        rating: 5,
        date: '2028-04-10',
        comment: 'Amazing fashion insights!',
      },
    ],
    relatedMagazines: [2, 15],
  },
  {
    id: 30,
    title: 'Style & Business',
    category: 'Fashion & Business',
    subcategory: 'Fashion',
    issue: 'Vol. 3 / May 2028',
    coverImage: '/fashionandbusiness...jpeg',
    coverImageLarge: '/fashionandbusiness...jpeg',
    description: 'Fashion Industry · Brand Building · Marketing',
    fullDescription: `Style & Business covers the business side of fashion, from brand building to marketing strategies.

  Features:
  • Building Fashion Brands
  • Marketing Strategies
  • Retail Innovation
  • Fashion Technology`,
    pages: 128,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Anna Brand',
    contributors: [
      { name: 'Tom Market', role: 'Marketing Editor', avatar: 'https://randomuser.me/api/portraits/men/25.jpg' },
      { name: 'Kate Retail', role: 'Retail Writer', avatar: 'https://randomuser.me/api/portraits/women/25.jpg' },
    ],
    tableOfContents: [
      'Brand Building 101',
      'Fashion Marketing',
      'Retail Trends',
      'Fashion Tech',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Business Fashionista',
        avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
        rating: 5,
        date: '2028-05-12',
        comment: 'Perfect blend of style and business!',
      },
    ],
    relatedMagazines: [2, 29],
  },
  {
    id: 31,
    title: 'Kids World',
    category: 'Kids & Family',
    subcategory: 'Kids',
    issue: 'Vol. 2 / February 2028',
    coverImage: '/kids2.jpeg',
    coverImageLarge: '/kids2.jpeg',
    description: 'Fun Activities · Learning · Parenting Tips',
    fullDescription: `Kids World is packed with fun activities, learning content, and parenting tips for families.

  Features:
  • Fun Activities for Kids
  • Educational Content
  • Parenting Tips
  • Family Adventures`,
    pages: 64,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Mommy Joy',
    contributors: [
      { name: 'Daddy Fun', role: 'Parenting Writer', avatar: 'https://randomuser.me/api/portraits/men/26.jpg' },
      { name: 'Teacher Sarah', role: 'Education Editor', avatar: 'https://randomuser.me/api/portraits/women/27.jpg' },
    ],
    tableOfContents: [
      'Fun Indoor Activities',
      'Learning Games',
      'Parenting Hacks',
      'Family Travel',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Happy Parent',
        avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
        rating: 5,
        date: '2028-02-20',
        comment: 'My kids love this magazine!',
      },
    ],
    relatedMagazines: [13, 17],
  },
  {
    id: 32,
    title: 'Family Fun',
    category: 'Kids & Family',
    subcategory: 'Kids',
    issue: 'Vol. 3 / March 2028',
    coverImage: '/kids3.jpeg',
    coverImageLarge: '/kids3.jpeg',
    description: 'Family Activities · Kids Education · Parenting',
    fullDescription: `Family Fun brings families together with activities, education, and parenting advice.

  Features:
  • Family Bonding Activities
  • Kids Education
  • Parenting Support
  • Healthy Living`,
    pages: 64,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Family First',
    contributors: [
      { name: 'Child Expert', role: 'Child Development', avatar: 'https://randomuser.me/api/portraits/women/29.jpg' },
      { name: 'Health Coach', role: 'Wellness Writer', avatar: 'https://randomuser.me/api/portraits/men/27.jpg' },
    ],
    tableOfContents: [
      'Family Game Night',
      'Educational Apps',
      'Parenting Support',
      'Healthy Habits',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Family Mom',
        avatar: 'https://randomuser.me/api/portraits/women/30.jpg',
        rating: 5,
        date: '2028-03-15',
        comment: 'Great family resource!',
      },
    ],
    relatedMagazines: [13, 31],
  },
  {
    id: 33,
    title: 'Music Vibes 2',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 2 / October 2026',
    coverImage: '/music1.jpeg',
    coverImageLarge: '/music1.jpeg',
    description: 'Music Reviews · Artist Interviews · Concert Tours',
    fullDescription: `Music Vibes 2 continues our coverage of the music scene with reviews, interviews, and tour news.

  Features:
  • Album Reviews
  • Artist Interviews
  • Concert Tours
  • Music Technology`,
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'DJ Mike',
    contributors: [
      { name: 'Music Critic', role: 'Reviewer', avatar: 'https://randomuser.me/api/portraits/men/28.jpg' },
      { name: 'Tour Manager', role: 'Tour Writer', avatar: 'https://randomuser.me/api/portraits/women/31.jpg' },
    ],
    tableOfContents: [
      'Top Albums of October',
      'Artist Spotlight',
      'Tour Dates',
      'Music Tech',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Music Fan',
        avatar: 'https://randomuser.me/api/portraits/men/29.jpg',
        rating: 5,
        date: '2026-10-25',
        comment: 'Great music coverage!',
      },
    ],
    relatedMagazines: [9, 22],
  },
  {
    id: 34,
    title: 'Music Vibes 3',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 3 / November 2026',
    coverImage: '/music2.jpeg',
    coverImageLarge: '/music2.jpeg',
    description: 'Music Industry · Emerging Artists · Genre Spotlight',
    fullDescription: `Music Vibes 3 explores the music industry, emerging artists, and genre spotlights.

  Features:
  • Music Industry News
  • Emerging Artists
  • Genre Deep Dives
  • Production Tips`,
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Producer Paul',
    contributors: [
      { name: 'A&R Scout', role: 'Talent Scout', avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
      { name: 'Sound Engineer', role: 'Tech Writer', avatar: 'https://randomuser.me/api/portraits/men/30.jpg' },
    ],
    tableOfContents: [
      'Industry Trends',
      'New Artists to Watch',
      'Hip Hop Spotlight',
      'Production 101',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Indie Lover',
        avatar: 'https://randomuser.me/api/portraits/men/31.jpg',
        rating: 5,
        date: '2026-11-20',
        comment: 'Love discovering new artists!',
      },
    ],
    relatedMagazines: [9, 33],
  },
  {
    id: 35,
    title: 'Music Vibes 4',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 4 / December 2026',
    coverImage: '/music3.jpeg',
    coverImageLarge: '/music3.jpeg',
    description: 'Year in Music · Best of 2026 · Holiday Songs',
    fullDescription: `Music Vibes 4 is our year-end special featuring the best of 2026 and holiday music.

  Features:
  • Best Albums of 2026
  • Top Songs of the Year
  • Holiday Music Special
  • Year in Review`,
    pages: 128,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Year End Editor',
    contributors: [
      { name: 'Chart Expert', role: 'Chart Analyst', avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
      { name: 'Holiday Music', role: 'Seasonal Writer', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    ],
    tableOfContents: [
      'Best of 2026',
      'Top Charts',
      'Holiday Playlist',
      'Year in Review',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Year End Fan',
        avatar: 'https://randomuser.me/api/portraits/women/34.jpg',
        rating: 5,
        date: '2026-12-25',
        comment: 'Perfect year-end summary!',
      },
    ],
    relatedMagazines: [9, 34],
  },
  {
    id: 36,
    title: 'Music Vibes 5',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 5 / January 2027',
    coverImage: '/music4.jpeg',
    coverImageLarge: '/music4.jpeg',
    description: 'New Year Music · Artist Predictions · Trending Sounds',
    fullDescription: `Music Vibes 5 kicks off the new year with predictions and trending sounds.

  Features:
  • New Year Music Trends
  • Artist Predictions for 2027
  • Trending Genres
  • Festival Preview`,
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Trend Watcher',
    contributors: [
      { name: 'Trend Analyst', role: 'Trend Forecaster', avatar: 'https://randomuser.me/api/portraits/men/33.jpg' },
      { name: 'Festival Guide', role: 'Events Writer', avatar: 'https://randomuser.me/api/portraits/women/35.jpg' },
    ],
    tableOfContents: [
      '2027 Music Predictions',
      'Rising Stars',
      'Genre Trends',
      'Festival Guide',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Trend Follower',
        avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
        rating: 5,
        date: '2027-01-15',
        comment: 'Excited for the new year!',
      },
    ],
    relatedMagazines: [9, 35],
  },
  {
    id: 37,
    title: 'Music Vibes 6',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 6 / February 2027',
    coverImage: '/music5.jpeg',
    coverImageLarge: '/music5.jpeg',
    description: 'Love Songs · Valentine Special · Romance in Music',
    fullDescription: `Music Vibes 6 is our Valentine special featuring love songs and romance in music.

  Features:
  • Valentine Playlist
  • Love Song History
  • Romantic Duets
  • Couples in Music`,
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Love Editor',
    contributors: [
      { name: 'Romance Writer', role: 'Love Songs Expert', avatar: 'https://randomuser.me/api/portraits/women/36.jpg' },
      { name: 'Couples Writer', role: 'Relationships', avatar: 'https://randomuser.me/api/portraits/men/35.jpg' },
    ],
    tableOfContents: [
      'Valentine Special',
      'Greatest Love Songs',
      'Romantic Duets',
      'Power Couples',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Romantic Reader',
        avatar: 'https://randomuser.me/api/portraits/women/37.jpg',
        rating: 5,
        date: '2027-02-14',
        comment: 'Perfect Valentine issue!',
      },
    ],
    relatedMagazines: [9, 36],
  },
  {
    id: 38,
    title: 'Music Vibes 7',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 7 / March 2027',
    coverImage: '/music6.jpeg',
    coverImageLarge: '/music6.jpeg',
    description: 'Spring Music · Festival Season · New Releases',
    fullDescription: `Music Vibes 7 covers spring music, festival season, and new releases.

  Features:
  • Spring Music Guide
  • Festival Season Preview
  • New Album Releases
  • Spring Playlists`,
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Spring Editor',
    contributors: [
      { name: 'Festival Expert', role: 'Events Writer', avatar: 'https://randomuser.me/api/portraits/men/36.jpg' },
      { name: 'Release Tracker', role: 'New Music', avatar: 'https://randomuser.me/api/portraits/women/38.jpg' },
    ],
    tableOfContents: [
      'Spring Sounds',
      'Festival Guide',
      'New Releases',
      'Seasonal Playlists',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Festival Goer',
        avatar: 'https://randomuser.me/api/portraits/men/37.jpg',
        rating: 5,
        date: '2027-03-20',
        comment: 'Ready for festival season!',
      },
    ],
    relatedMagazines: [9, 37],
  },
  {
    id: 39,
    title: 'Music Vibes 8',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 8 / April 2027',
    coverImage: '/music7.jpeg',
    coverImageLarge: '/music7.jpeg',
    description: 'Music Production · Studio Life · Artist Development',
    fullDescription: `Music Vibes 8 goes behind the scenes with music production and artist development.

  Features:
  • Studio Sessions
  • Production Techniques
  • Artist Development
  • Music Business`,
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Studio Editor',
    contributors: [
      { name: 'Producer Pro', role: 'Production Expert', avatar: 'https://randomuser.me/api/portraits/men/38.jpg' },
      { name: 'Artist Coach', role: 'Development', avatar: 'https://randomuser.me/api/portraits/women/39.jpg' },
    ],
    tableOfContents: [
      'Studio Life',
      'Production Tips',
      'Artist Development',
      'Music Business 101',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Aspiring Producer',
        avatar: 'https://randomuser.me/api/portraits/men/39.jpg',
        rating: 5,
        date: '2027-04-15',
        comment: 'Great production insights!',
      },
    ],
    relatedMagazines: [9, 38],
  },
  {
    id: 40,
    title: 'Music Vibes 9',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 9 / May 2027',
    coverImage: '/music8.jpeg',
    coverImageLarge: '/music8.jpeg',
    description: 'Summer Music · Outdoor Concerts · Beach Vibes',
    fullDescription: `Music Vibes 9 brings summer music, outdoor concerts, and beach vibes.

  Features:
  • Summer Playlist
  • Outdoor Concerts
  • Beach Music
  • Festival Highlights`,
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Summer Editor',
    contributors: [
      { name: 'Beach DJ', role: 'Summer Music', avatar: 'https://randomuser.me/api/portraits/men/40.jpg' },
      { name: 'Concert Critic', role: 'Live Music', avatar: 'https://randomuser.me/api/portraits/women/40.jpg' },
    ],
    tableOfContents: [
      'Summer Sounds',
      'Concert Guide',
      'Beach Playlist',
      'Festival Recap',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Summer Lover',
        avatar: 'https://randomuser.me/api/portraits/women/41.jpg',
        rating: 5,
        date: '2027-05-20',
        comment: 'Perfect summer vibes!',
      },
    ],
    relatedMagazines: [9, 39],
  },
  {
    id: 41,
    title: 'Music Vibes 10',
    category: 'Music & Entertainment',
    subcategory: 'Music',
    issue: 'Vol. 10 / June 2027',
    coverImage: '/music9.jpeg',
    coverImageLarge: '/music9.jpeg',
    description: 'Mid-Year Review · Top Artists · Music Awards',
    fullDescription: `Music Vibes 10 is our mid-year review with top artists and music awards coverage.

  Features:
  • Mid-Year Top 10
  • Artist Rankings
  • Awards Season Preview
  • Hit Songs Analysis`,
    pages: 128,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Mid-Year Editor',
    contributors: [
      { name: 'Chart Master', role: 'Charts', avatar: 'https://randomuser.me/api/portraits/men/41.jpg' },
      { name: 'Awards Writer', role: 'Awards Coverage', avatar: 'https://randomuser.me/api/portraits/women/42.jpg' },
    ],
    tableOfContents: [
      'Mid-Year Charts',
      'Top Artists',
      'Awards Preview',
      'Hit Analysis',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Chart Watcher',
        avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
        rating: 5,
        date: '2027-06-25',
        comment: 'Great mid-year summary!',
      },
    ],
    relatedMagazines: [9, 40],
  },
  {
    id: 42,
    title: 'Youth in Policy 2',
    category: 'Politics & Policy',
    subcategory: 'Politics',
    issue: 'Vol. 2 / December 2026',
    coverImage: '/youthinpolicy1.jpeg',
    coverImageLarge: '/youthinpolicy1.jpeg',
    description: 'Youth Leadership · Policy Changes · Civic Engagement',
    fullDescription: `Youth in Policy 2 continues our coverage of youth leadership and policy changes.

  Features:
  • Youth Leaders Rising
  • Policy Impact
  • Civic Engagement
  • Future of Politics`,
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'Policy Editor',
    contributors: [
      { name: 'Youth Advocate', role: 'Youth Issues', avatar: 'https://randomuser.me/api/portraits/women/43.jpg' },
      { name: 'Policy Analyst', role: 'Policy Expert', avatar: 'https://randomuser.me/api/portraits/men/43.jpg' },
    ],
    tableOfContents: [
      'Youth Leadership',
      'Policy Changes',
      'Civic Engagement',
      'Political Future',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Youth Activist',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 5,
        date: '2026-12-20',
        comment: 'Inspiring youth leadership!',
      },
    ],
    relatedMagazines: [11, 18],
  },
  {
    id: 43,
    title: 'Youth in Policy 3',
    category: 'Politics & Policy',
    subcategory: 'Politics',
    issue: 'Vol. 3 / January 2027',
    coverImage: '/youthinpolicy3.jpeg',
    coverImageLarge: '/youthinpolicy3.jpeg',
    description: 'New Year Policy · Youth Resolutions · Political Goals',
    fullDescription: `Youth in Policy 3 explores new year policies, youth resolutions, and political goals.

  Features:
  • New Year Policy Agenda
  • Youth Resolutions
  • Political Goals for 2027
  • Grassroots Movements`,
    pages: 96,
    language: 'English',
    publisher: 'Trendorabay Media',
    editor: 'New Year Policy',
    contributors: [
      { name: 'Goal Setter', role: 'Policy Goals', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
      { name: 'Grassroots Writer', role: 'Movements', avatar: 'https://randomuser.me/api/portraits/women/45.jpg' },
    ],
    tableOfContents: [
      '2027 Policy Agenda',
      'Youth Resolutions',
      'Political Goals',
      'Grassroots Power',
    ],
    previewPages: [1, 2, 3],
    reviews: [
      {
        id: 1,
        user: 'Policy Watcher',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        rating: 5,
        date: '2027-01-25',
        comment: 'Great policy insights!',
      },
    ],
    relatedMagazines: [11, 42],
  },
];

// Sample related magazines
const relatedMagazinesData = {
  2: {
    id: 2,
    title: 'Vogue Africa',
    coverImage: 'https://images.unsplash.com/photo-1532635241-8e0c8456a2bd?w=400&auto=format',
    price: 12.99,
    category: 'Fashion & Style',
  },
  3: {
    id: 3,
    title: 'African Business Review',
    coverImage: 'https://images.unsplash.com/photo-1542744173-05336fcc7ad4?w=400&auto=format',
    price: 9.99,
    category: 'Business & Entrepreneurship',
  },
  4: {
    id: 4,
    title: 'Urban Culture',
    coverImage: 'https://images.unsplash.com/photo-1523805009345-744884ea3946?w=400&auto=format',
    price: 7.99,
    category: 'Street Culture & Trends',
  },
  7: {
    id: 7,
    title: 'Music Africa',
    coverImage: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&auto=format',
    price: 8.99,
    category: 'Music & Entertainment',
  },
};

const MagazineDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [magazine, setMagazine] = useState(null);
  const [relatedMagazines, setRelatedMagazines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const [selectedFormat, setSelectedFormat] = useState('digital');

  useEffect(() => {
    // Simulate API fetch
    const fetchMagazine = () => {
      setLoading(true);
      setTimeout(() => {
        const foundMagazine = sampleMagazines.find(m => m.id === parseInt(id));
        setMagazine(foundMagazine || null);
        
        if (foundMagazine) {
          // Fetch related magazines (simplified)
          const related = sampleMagazines.filter(m => 
            foundMagazine.relatedMagazines.includes(m.id)
          );
          setRelatedMagazines(related);
        }
        
        setLoading(false);
      }, 500);
    };

    fetchMagazine();
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    const formatPrice = selectedFormat === 'digital' ? magazine.digitalPrice : magazine.printPrice;
    const formatName = selectedFormat === 'digital' ? 'Digital' : 'Print';
    
    dispatch(addItem({
      id: `${magazine.id}-${selectedFormat}`,
      name: `${magazine.title} (${formatName})`,
      price: formatPrice,
      type: 'magazine',
      format: selectedFormat,
      image: magazine.coverImage,
      quantity: quantity,
    }));
    toast.success(`${magazine.title} (${formatName}) added to cart!`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleSubscribe = () => {
    dispatch(addItem({
      id: magazine.id,
      name: `${magazine.title} - Yearly Subscription`,
      price: magazine.subscriptionPrice,
      type: 'subscription',
      image: magazine.coverImage,
      quantity: 1,
    }));
    toast.success(`Subscription to ${magazine.title} added to cart!`);
    navigate('/cart');
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = `Check out ${magazine.title} on Trendorabay!`;
    
    let shareUrl = '';
    switch(platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPreview = () => {
    toast.info('Preview download started...');
  };

  if (loading) {
    return (
      <div className="magazine-details-loading">
        <div className="loader"></div>
        <p>Loading magazine details...</p>
      </div>
    );
  }

  if (!magazine) {
    return (
      <div className="magazine-not-found">
        <i className="fas fa-exclamation-circle"></i>
        <h2>Magazine Not Found</h2>
        <p>The magazine you're looking for doesn't exist or has been removed.</p>
        <Link to="/magazines" className="back-to-magazines">
          <i className="fas fa-arrow-left"></i> Back to Magazines
        </Link>
      </div>
    );
  }

  return (
    <div className="magazine-details-page">
      
      <div className="container">
        {/* Main Content */}
        <div className="magazine-details-main">
          {/* Left Column - Images */}
          <div className="magazine-gallery">
            <div className="main-image">
              <img 
                src={magazine.coverImageLarge || magazine.coverImage} 
                alt={magazine.title}
              />
              {magazine.isNew && <span className="main-badge new">New Issue</span>}
              {magazine.editorPick && <span className="main-badge editor">Editor's Pick</span>}
              
              {/* Preview Button */}
              <button 
                className="preview-btn"
                onClick={() => setShowPreview(true)}
              >
                <i className="fas fa-eye"></i> Preview Issue
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {magazine.previewPages && magazine.previewPages.length > 0 && (
              <div className="thumbnail-gallery">
                {magazine.previewPages.map((img, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`Preview ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="magazine-info">
            {/* Category and Title */}
            <div className="info-header">
              <span className="info-category">{magazine.category}</span>
              <h1 className="info-title">{magazine.title}</h1>
              <div className="info-meta">
                <span><i className="fas fa-calendar"></i> {new Date(magazine.publishDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <span><i className="fas fa-book-open"></i> {magazine.pages} pages</span>
                <span><i className="fas fa-globe"></i> {magazine.language}</span>
              </div>
            </div>

            {/* Rating and Reviews */}
            <div className="info-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i} 
                    className={`fas fa-star ${i < Math.floor(magazine.rating) ? 'filled' : i < magazine.rating ? 'half' : ''}`}
                  ></i>
                ))}
              </div>
              <span className="rating-value">{magazine.rating}</span>
              <span className="review-count">({magazine.reviewCount} reviews)</span>
            </div>

            {/* Issue and ISSN */}
            <div className="info-identifiers">
              <span className="identifier">
                <strong>Issue:</strong> {magazine.issue}
              </span>
              <span className="identifier">
                <strong>Publisher:</strong> {magazine.publisher}
              </span>
            </div>

            {/* Format Selection */}
            <div className="format-selection">
              <h3>Choose Format</h3>
              <div className="format-options">
                <div 
                  className={`format-option ${selectedFormat === 'digital' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('digital')}
                >
                  <div className="format-info">
                    <h4>Digital</h4>
                    <p>Instant download, access on all devices</p>
                    <div className="format-price">${magazine.digitalPrice}</div>
                  </div>
                </div>
                <div 
                  className={`format-option ${selectedFormat === 'print' ? 'active' : ''}`}
                  onClick={() => setSelectedFormat('print')}
                >
                  <div className="format-info">
                    <h4>Print</h4>
                    <p>Physical copy delivered to your door</p>
                    <div className="format-price">${magazine.printPrice}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="info-actions">
              <button className="add-to-cart-btn-large" onClick={handleAddToCart}>
                <i className="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                <i className="fas fa-bolt"></i>
                Buy Now
              </button>
              <button className="subscribe-btn" onClick={handleSubscribe}>
                <i className="fas fa-calendar-alt"></i>
                Subscribe
              </button>
            </div>

            {/* Share and Save */}
            <div className="info-extras">
              <div className="share-section">
                <span>Share:</span>
                <button onClick={() => handleShare('facebook')}><i className="fab fa-facebook"></i></button>
                <button onClick={() => handleShare('twitter')}><i className="fab fa-twitter"></i></button>
                <button onClick={() => handleShare('linkedin')}><i className="fab fa-linkedin"></i></button>
                <button onClick={() => handleShare('whatsapp')}><i className="fab fa-whatsapp"></i></button>
              </div>
              <button className="print-btn" onClick={handlePrint}>
                <i className="fas fa-print"></i> Print
              </button>
            </div>

            {/* Guarantee Badge */}
            <div className="guarantee-badge">
              <i className="fas fa-shield-alt"></i>
              <div>
                <strong>Secure Download</strong>
                <span>Instant access after purchase</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="magazine-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'contents' ? 'active' : ''}`}
              onClick={() => setActiveTab('contents')}
            >
              Table of Contents
            </button>
            <button 
              className={`tab-btn ${activeTab === 'contributors' ? 'active' : ''}`}
              onClick={() => setActiveTab('contributors')}
            >
              Contributors
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({magazine.reviewCount})
            </button>
          </div>

          <div className="tab-content">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="description-tab">
                <div className="full-description">
                  {magazine.fullDescription.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>

                {/* Key Features */}
                <div className="key-features">
                  <h3>Key Features</h3>
                  <ul>
                    <li><i className="fas fa-check"></i> 128 pages of premium content</li>
                    <li><i className="fas fa-check"></i> High-resolution digital PDF</li>
                    <li><i className="fas fa-check"></i> Access on all devices</li>
                    <li><i className="fas fa-check"></i> Downloadable and printable</li>
                    <li><i className="fas fa-check"></i> Includes bonus digital content</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Table of Contents Tab */}
            {activeTab === 'contents' && (
              <div className="contents-tab">
                <h3>Table of Contents</h3>
                <div className="toc-list">
                  {magazine.tableOfContents.map((item, idx) => (
                    <div key={idx} className="toc-item">
                      <span className="toc-title">{item.title}</span>
                      <span className="toc-page">p. {item.page}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contributors Tab */}
            {activeTab === 'contributors' && (
              <div className="contributors-tab">
                <h3>Contributors</h3>
                <div className="contributors-grid">
                  {magazine.contributors.map((contributor, idx) => (
                    <div key={idx} className="contributor-card">
                      <img src={contributor.avatar} alt={contributor.name} />
                      <div className="contributor-info">
                        <h4>{contributor.name}</h4>
                        <p>{contributor.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="reviews-tab">
                <div className="reviews-summary">
                  <div className="average-rating">
                    <span className="big-rating">{magazine.rating}</span>
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className="fas fa-star filled"></i>
                      ))}
                    </div>
                    <span>Based on {magazine.reviewCount} reviews</span>
                  </div>
                  <button className="write-review-btn">
                    <i className="fas fa-pen"></i> Write a Review
                  </button>
                </div>

                <div className="reviews-list">
                  {magazine.reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <img src={review.avatar} alt={review.user} />
                      <div className="review-content">
                        <div className="review-header">
                          <h4>{review.user}</h4>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}></i>
                            ))}
                          </div>
                          <span className="review-date">{new Date(review.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <p className="review-comment">{review.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Magazines */}
        {relatedMagazines.length > 0 && (
          <div className="related-magazines">
            <h2>You Might Also Like</h2>
            <div className="related-grid">
              {relatedMagazines.map(related => (
                <Link to={`/magazines/${related.id}`} key={related.id} className="related-card">
                  <img src={related.coverImage} alt={related.title} />
                  <div className="related-info">
                    <span className="related-category">{related.category}</span>
                    <h3>{related.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="preview-modal" onClick={() => setShowPreview(false)}>
          <div className="preview-content" onClick={e => e.stopPropagation()}>
            <div className="preview-header">
              <h3>Preview: {magazine.title}</h3>
              <button className="close-preview" onClick={() => setShowPreview(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="preview-body">
              <div className="preview-navigation">
                <button 
                  className="preview-nav-btn"
                  onClick={() => setPreviewPage(Math.max(0, previewPage - 1))}
                  disabled={previewPage === 0}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="preview-page">
                  <img 
                    src={magazine.previewPages[previewPage] || magazine.coverImage} 
                    alt={`Preview page ${previewPage + 1}`}
                  />
                  <span className="page-number">Page {previewPage + 1} of {magazine.previewPages.length}</span>
                </div>
                <button 
                  className="preview-nav-btn"
                  onClick={() => setPreviewPage(Math.min(magazine.previewPages.length - 1, previewPage + 1))}
                  disabled={previewPage === magazine.previewPages.length - 1}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            <div className="preview-footer">
              <button className="download-preview" onClick={handleDownloadPreview}>
                <i className="fas fa-download"></i> Download Full Preview
              </button>
              <button className="buy-preview" onClick={handleBuyNow}>
                <i className="fas fa-shopping-cart"></i> Buy Full Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MagazineDetails;