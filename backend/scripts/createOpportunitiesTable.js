import pool from '../config/database.js';

const createOpportunitiesTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS opportunities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        type ENUM('GRANT', 'JOB', 'SCHOLARSHIP', 'COMPETITION', 'EVENT', 'INTERNSHIP', 'FELLOWSHIP', 'OTHER') DEFAULT 'OTHER',
        category VARCHAR(100),
        organization VARCHAR(255),
        location VARCHAR(255),
        deadline DATE,
        link_url VARCHAR(500),
        image_url VARCHAR(500),
        eligibility TEXT,
        benefits TEXT,
        application_process TEXT,
        featured TINYINT(1) DEFAULT 0,
        status ENUM('open', 'closed', 'upcoming', 'ongoing') DEFAULT 'open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_type (type),
        INDEX idx_status (status),
        INDEX idx_deadline (deadline),
        INDEX idx_featured (featured)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await pool.query(createTableQuery);
    console.log('Opportunities table created successfully');

    // Insert some sample data
    const insertSampleData = `
      INSERT INTO opportunities (title, description, type, category, organization, location, deadline, link_url, featured, status) VALUES
      ('Startup Growth Fund', 'For early-stage African founders looking to scale their businesses', 'GRANT', 'Funding', 'Trendorabay', 'Africa', '2026-12-31', 'https://example.com/apply', 1, 'open'),
      ('Product Designer', 'Join our team to create amazing digital experiences', 'JOB', 'Technology', 'Trendorabay', 'Nairobi', '2026-10-15', 'https://example.com/apply', 1, 'open'),
      ('Africa Innovation Summit', 'Founders & creators gathering to share ideas', 'EVENT', 'Conference', 'Trendorabay', 'Virtual', '2026-11-20', 'https://example.com/register', 1, 'open')
    `;

    await pool.query(insertSampleData);
    console.log('Sample opportunities data inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating opportunities table:', error);
    process.exit(1);
  }
};

createOpportunitiesTable();