import pool from '../config/database.js';

const createCommunitiesTable = async () => {
  try {
    // Drop existing tables if they exist
    await pool.query('DROP TABLE IF EXISTS community_members');
    console.log('Dropped existing community_members table');

    await pool.query('DROP TABLE IF EXISTS communities');
    console.log('Dropped existing communities table');

    // Create communities table
    await pool.query(`
      CREATE TABLE communities (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        name VARCHAR(150) NOT NULL,
        slug VARCHAR(180) NOT NULL UNIQUE,

        description TEXT,
        short_description VARCHAR(500),

        category VARCHAR(100) NOT NULL,

        icon_url VARCHAR(500),
        cover_image_url VARCHAR(500),

        community_type ENUM('open', 'approval', 'invite_only')
          NOT NULL DEFAULT 'open',

        status ENUM('active', 'inactive', 'archived')
          NOT NULL DEFAULT 'active',

        rules TEXT,

        created_by INT UNSIGNED NULL,

        member_count INT UNSIGNED NOT NULL DEFAULT 0,
        post_count INT UNSIGNED NOT NULL DEFAULT 0,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          ON UPDATE CURRENT_TIMESTAMP,

        INDEX idx_category (category),
        INDEX idx_status (status),
        INDEX idx_community_type (community_type)
      )
    `);
    console.log('Communities table created successfully');

    // Create community_members table
    await pool.query(`
      CREATE TABLE community_members (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

        user_id BIGINT UNSIGNED NOT NULL,
        community_id BIGINT UNSIGNED NOT NULL,

        role ENUM(
          'owner',
          'admin',
          'moderator',
          'contributor',
          'member'
        ) NOT NULL DEFAULT 'member',

        status ENUM(
          'active',
          'pending',
          'left',
          'banned'
        ) NOT NULL DEFAULT 'active',

        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        left_at TIMESTAMP NULL,

        UNIQUE KEY unique_user_community (user_id, community_id),

        INDEX idx_user (user_id),
        INDEX idx_community (community_id),
        INDEX idx_status (status)
      )
    `);
    console.log('Community_members table created successfully');

    // Insert sample communities
    await pool.query(`
      INSERT INTO communities (name, slug, description, short_description, category, icon_url, cover_image_url, community_type, status, member_count, post_count) VALUES
      ('Music', 'music', 'Connect with music lovers, artists, producers, DJs and industry professionals across Africa.', 'Music lovers, artists, producers, DJs', 'Culture', '🎵', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80', 'open', 'active', 8420, 0),
      ('Fashion', 'fashion', 'African fashion, streetwear, designers, style movements and the business behind them.', 'Fashion, streetwear, designers', 'Culture', '👗', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80', 'open', 'active', 6280, 0),
      ('Art', 'art', 'Visual artists, exhibitions, illustration, digital art and new creative expression.', 'Visual artists, exhibitions, digital art', 'Culture', '🎨', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80', 'open', 'active', 4210, 0),
      ('Technology', 'technology', 'Technology, software, AI, digital products and the builders creating what comes next.', 'Tech, software, AI, digital products', 'Innovation', '💻', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 'open', 'active', 9120, 0),
      ('Agriculture', 'agriculture', 'Agribusiness, farming innovation, food systems and opportunities across Africa.', 'Agribusiness, farming, food systems', 'Impact', '🌱', 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&q=80', 'open', 'active', 3480, 0),
      ('Business', 'business', 'Entrepreneurs, companies, markets, strategy and practical ideas for building businesses.', 'Entrepreneurs, startups, markets', 'Business', '💼', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80', 'open', 'active', 7840, 0),
      ('Sports', 'sports', 'Athletes, teams, competitions, sports culture and the business of sport.', 'Athletes, teams, competitions', 'Lifestyle', '⚽', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80', 'open', 'active', 5620, 0),
      ('Food & Nutrition', 'food-nutrition', 'Food culture, nutrition, culinary creativity and ideas around healthier communities.', 'Food culture, nutrition, culinary', 'Lifestyle', '🥗', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', 'open', 'active', 3910, 0),
      ('Finance', 'finance', 'Money, personal finance, fintech, investment education and financial opportunities.', 'Finance, fintech, investment', 'Business', '💰', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80', 'open', 'active', 6470, 0),
      ('Education', 'education', 'Students, educators, learning, skills and the ideas transforming access to education.', 'Students, educators, learning', 'Impact', '🎓', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', 'open', 'active', 4180, 0),
      ('Travel', 'travel', 'Destinations, travel stories, tourism, experiences and places worth discovering.', 'Travel, tourism, destinations', 'Lifestyle', '✈️', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80', 'open', 'active', 3120, 0),
      ('Gaming', 'gaming', 'Gamers, developers, esports, game culture and Africa\\'s growing gaming ecosystem.', 'Gamers, developers, esports', 'Culture', '🎮', 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', 'open', 'active', 2940, 0),
      ('Film', 'film', 'Filmmakers, actors, productions, cinema and the stories being brought to screen.', 'Filmmakers, actors, cinema', 'Culture', '🎬', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80', 'open', 'active', 3560, 0),
      ('Events', 'events', 'Conferences, festivals, meetups, launches and experiences happening across communities.', 'Conferences, festivals, meetups', 'Lifestyle', '📅', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', 'open', 'active', 2680, 0),
      ('Creative Arts', 'creative-arts', 'A home for multidisciplinary creators working across design, performance and expression.', 'Design, performance, expression', 'Culture', '🖌️', 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80', 'open', 'active', 3010, 0),
      ('Real Estate', 'real-estate', 'Property, housing, development, investment and the changing built environment.', 'Property, housing, development', 'Business', '🏠', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', 'open', 'active', 2340, 0),
      ('Logistics', 'logistics', 'Transport, delivery, supply chains, mobility and the infrastructure moving Africa.', 'Transport, delivery, supply chains', 'Business', '🚚', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80', 'open', 'active', 1920, 0),
      ('Recycling', 'recycling', 'Circular economy, recycling, waste solutions and businesses creating environmental impact.', 'Circular economy, recycling, waste', 'Impact', '♻️', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&q=80', 'open', 'active', 1680, 0),
      ('Youth & Student Life', 'youth-student-life', 'Student life, youth culture, careers, campus conversations and opportunities.', 'Student life, youth culture', 'Impact', '🎒', 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80', 'open', 'active', 5240, 0),
      ('Women in Business', 'women-in-business', 'Women founders, executives, professionals and stories about building and leading.', 'Women founders, executives', 'Business', '👩‍💼', 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&q=80', 'open', 'active', 4410, 0),
      ('Riders', 'riders', 'Riders, mobility culture, motorcycle communities, safety, business and journeys.', 'Riders, motorcycle communities', 'Lifestyle', '🏍️', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80', 'open', 'active', 2140, 0),
      ('Lifestyle', 'lifestyle', 'Everyday living, wellness, relationships, personal style and the trends shaping life.', 'Wellness, relationships, lifestyle', 'Lifestyle', '✨', 'https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80', 'open', 'active', 6720, 0),
      ('Community Impact', 'community-impact', 'People and organisations creating measurable change in communities across Africa.', 'Social impact, organisations', 'Impact', '🤝', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80', 'open', 'active', 2890, 0),
      ('Comics', 'comics', 'Comics, graphic storytelling, illustrators, characters and African visual narratives.', 'Comics, graphic storytelling', 'Culture', '📚', 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=800&q=80', 'open', 'active', 1820, 0),
      ('Home', 'home', 'Home design, living spaces, practical ideas, interiors and the culture of where we live.', 'Home design, interiors, living spaces', 'Lifestyle', '🏡', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80', 'open', 'active', 2410, 0)
    `);
    console.log('Sample communities inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating community tables:', error);
    process.exit(1);
  }
};

createCommunitiesTable();
