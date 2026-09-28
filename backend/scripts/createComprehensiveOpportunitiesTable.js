import pool from '../config/database.js';

const createComprehensiveOpportunitiesTable = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS opportunities (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        title varchar(255) NOT NULL,
        slug varchar(255) NOT NULL,
        short_description varchar(500) DEFAULT NULL,
        description text NOT NULL,
        category varchar(100) NOT NULL,
        organization_name varchar(255) DEFAULT NULL,
        organization_logo varchar(1000) DEFAULT NULL,
        organization_website varchar(1000) DEFAULT NULL,
        opportunity_type enum('free','partner','sponsored') NOT NULL DEFAULT 'free',
        status enum('draft','pending','published','expired','rejected','archived') NOT NULL DEFAULT 'draft',
        featured tinyint(1) NOT NULL DEFAULT 0,
        image_url varchar(1000) DEFAULT NULL,
        country varchar(100) DEFAULT NULL,
        city varchar(100) DEFAULT NULL,
        location varchar(255) DEFAULT NULL,
        remote tinyint(1) NOT NULL DEFAULT 0,
        eligibility text DEFAULT NULL,
        requirements text DEFAULT NULL,
        benefits text DEFAULT NULL,
        application_instructions text DEFAULT NULL,
        application_url varchar(1000) DEFAULT NULL,
        application_email varchar(255) DEFAULT NULL,
        application_open_date datetime DEFAULT NULL,
        deadline datetime DEFAULT NULL,
        published_at datetime DEFAULT NULL,
        expires_at datetime DEFAULT NULL,
        partner_name varchar(255) DEFAULT NULL,
        partner_url varchar(1000) DEFAULT NULL,
        affiliate_url varchar(1000) DEFAULT NULL,
        affiliate_network varchar(100) DEFAULT NULL,
        is_paid tinyint(1) NOT NULL DEFAULT 0,
        price decimal(10,2) DEFAULT NULL,
        currency varchar(10) DEFAULT 'KES',
        commission_type enum('none','percentage','fixed') NOT NULL DEFAULT 'none',
        commission_value decimal(10,2) NOT NULL DEFAULT 0.00,
        views int(10) unsigned NOT NULL DEFAULT 0,
        clicks int(10) unsigned NOT NULL DEFAULT 0,
        applications int(10) unsigned NOT NULL DEFAULT 0,
        conversions int(10) unsigned NOT NULL DEFAULT 0,
        submitted_by bigint(20) unsigned DEFAULT NULL,
        submission_source enum('admin','editor','organization','user','partner') NOT NULL DEFAULT 'admin',
        reviewed_by bigint(20) unsigned DEFAULT NULL,
        review_status enum('not_reviewed','approved','rejected') NOT NULL DEFAULT 'not_reviewed',
        review_notes text DEFAULT NULL,
        tags varchar(1000) DEFAULT NULL,
        contact_name varchar(255) DEFAULT NULL,
        contact_email varchar(255) DEFAULT NULL,
        contact_phone varchar(50) DEFAULT NULL,
        created_at timestamp NOT NULL DEFAULT current_timestamp(),
        updated_at timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (id),
        UNIQUE KEY slug (slug),
        KEY category (category),
        KEY opportunity_type (opportunity_type),
        KEY status (status),
        KEY featured (featured),
        KEY country (country),
        KEY remote (remote),
        KEY deadline (deadline),
        KEY published_at (published_at),
        KEY submission_source (submission_source),
        KEY review_status (review_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await pool.query(createTableQuery);
    console.log('Comprehensive opportunities table created successfully');

    // Insert a sample opportunity for testing
    const insertSample = `
      INSERT INTO opportunities (
        title, slug, short_description, description, category, organization_name, 
        opportunity_type, status, featured, country, location, remote, 
        application_url, deadline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(insertSample, [
      'Startup Growth Fund 2026',
      'startup-growth-fund-2026',
      'For early-stage African founders looking to scale their businesses',
      'A growth fund for early-stage African founders building scalable solutions in fintech, agritech, healthtech and clean energy.',
      'Funding',
      'Trendorabay',
      'free',
      'published',
      1,
      'Kenya',
      'Nairobi',
      0,
      'https://example.com/apply',
      '2026-12-31'
    ]);

    console.log('Sample opportunity inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error creating comprehensive opportunities table:', error);
    process.exit(1);
  }
};

createComprehensiveOpportunitiesTable();