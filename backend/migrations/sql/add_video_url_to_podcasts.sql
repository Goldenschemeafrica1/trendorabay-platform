-- Add video_file_url column to podcasts table
ALTER TABLE podcasts ADD COLUMN video_file_url VARCHAR(500) AFTER audio_url;
