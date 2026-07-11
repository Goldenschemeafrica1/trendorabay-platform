import pool from '../config/database.js';

const addPodcastGuests = async () => {
  try {
    // Update podcasts with guest names
    const updates = [
      { id: 1, guest: 'John Kamau' },
      { id: 2, guest: 'Sarah Wanjiku' },
      { id: 3, guest: 'David Ochieng' },
      { id: 4, guest: 'Mary Njeri' }
    ];
    
    for (const update of updates) {
      await pool.query(
        'UPDATE podcasts SET guest = ? WHERE id = ?',
        [update.guest, update.id]
      );
      console.log(`Updated podcast ${update.id} with guest: ${update.guest}`);
    }
    
    console.log('\nAll podcasts updated with guest names');
    process.exit(0);
  } catch (error) {
    console.error('Error updating podcast guests:', error);
    process.exit(1);
  }
};

addPodcastGuests();
