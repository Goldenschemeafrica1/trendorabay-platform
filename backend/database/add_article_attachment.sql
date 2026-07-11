-- Add article_attachment column to pitch_submissions table
USE trendorabay;

ALTER TABLE pitch_submissions ADD COLUMN article_attachment VARCHAR(500) AFTER experience;
