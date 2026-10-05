import pool from '../config/database.js';

const teamMembers = [
  {
    name: 'Amara Okonkwo',
    role: 'Founder & CEO',
    avatar: 'https://i.pravatar.cc/400?img=32',
    bio: 'Award-winning journalist with 15+ years of experience covering African culture and development.',
    status: 'active'
  },
  {
    name: 'Kwame Mensah',
    role: 'Head of Product',
    avatar: 'https://i.pravatar.cc/400?img=12',
    bio: 'Visual artist and designer specializing in contemporary African aesthetics and brand development.',
    status: 'active'
  },
  {
    name: 'Zainab Ali',
    role: 'Community Lead',
    avatar: 'https://i.pravatar.cc/400?img=47',
    bio: 'Community builder passionate about creating inclusive spaces for cultural exchange and dialogue.',
    status: 'active'
  },
  {
    name: 'David Mwangi',
    role: 'Head of Creators',
    avatar: 'https://i.pravatar.cc/400?img=68',
    bio: 'Entrepreneur focused on sustainable business models for creative and cultural enterprises.',
    status: 'active'
  }
];

async function insertTeamMembers() {
  try {
    console.log('Inserting team members...');

    for (const member of teamMembers) {
      const [result] = await pool.query(
        `INSERT INTO team (name, role, avatar, bio, status)
         VALUES (?, ?, ?, ?, ?)`,
        [member.name, member.role, member.avatar, member.bio, member.status]
      );
      console.log(`Inserted: ${member.name} with ID ${result.insertId}`);
    }

    console.log('All team members inserted successfully!');

    // Verify insertion
    const [rows] = await pool.query('SELECT * FROM team');
    console.log('Current team members in database:', rows);

    process.exit(0);
  } catch (error) {
    console.error('Error inserting team members:', error);
    process.exit(1);
  }
}

insertTeamMembers();
