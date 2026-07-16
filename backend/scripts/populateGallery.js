import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';

const mediaFiles = [
  'media0001.jpeg',
  'media0002.jpeg',
  'media0003.jpeg',
  'media0004.jpeg',
  'media0005.jpeg',
  'media0006.jpeg',
  'media0007.jpeg',
  'media0008.jpeg',
  'media0009.jpeg',
  'media00005.jpeg',
  'media00008.jpeg',
  'media001.jpeg',
  'media002.jpeg',
  'media004.jpeg',
  'media005.jpeg',
  'media006.jpeg',
  'media007.jpeg',
  'media008.jpeg',
  'media01.jpeg',
  'media02.jpeg',
  'media03.jpeg',
  'media04.jpeg',
  'media06.jpeg',
  'media07.jpeg',
  'media1.jpeg',
  'media10.jpeg',
  'media2.jpeg',
  'media3.jpeg',
  'media5.jpeg',
  'media6.jpeg',
  'media7.jpeg',
  'media8.jpeg',
  'media9.jpeg',
];

const populateGallery = async () => {
  try {
    console.log('Starting to populate gallery table...');

    for (let i = 0; i < mediaFiles.length; i++) {
      const filename = mediaFiles[i];
      const title = `Gallery Image ${i + 1}`;
      const imageUrl = `/assets/gallery/${filename}`;
      const category = ['Events', 'Lifestyle', 'Business', 'Technology', 'Art'][i % 5];
      
      const query = `
        INSERT INTO gallery (title, image_url, caption, category, featured, likes_count)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      await pool.query(query, [
        title,
        imageUrl,
        `Beautiful ${category.toLowerCase()} image from our collection`,
        category,
        i < 5, // First 5 images are featured
        0
      ]);
      
      console.log(`Inserted: ${filename}`);
    }

    console.log('Gallery table populated successfully!');
  } catch (error) {
    console.error('Error populating gallery table:', error);
    throw error;
  }
};

populateGallery()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
