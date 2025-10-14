-- Merged Database Schema for GSM Backend3
-- Combines schemas from backend, backend1, backend2
CREATE DATABASE IF NOT EXISTS gsm_db_merged;
USE gsm_db_merged;

-- Users table for authentication (from backend)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Evacuations table (from backend, renamed from evacuations to evacuation_centers for consistency)
CREATE TABLE IF NOT EXISTS evacuation_centers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  name VARCHAR(255) NOT NULL,
  capacity INT,
  status VARCHAR(50) DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Residents table (from backend and backend1, identical)
CREATE TABLE IF NOT EXISTS residents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  family_size INT,
  address VARCHAR(255),
  contact_number VARCHAR(50),
  last_distribution DATE,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  zone VARCHAR(100),
  center VARCHAR(255),
  barangay VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hazard maps table (from backend)
CREATE TABLE IF NOT EXISTS hazard_maps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  file_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Manual hazards table (from backend)
CREATE TABLE IF NOT EXISTS manual_hazards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lat DECIMAL(10,8) NOT NULL,
  lng DECIMAL(11,8) NOT NULL,
  category VARCHAR(100),
  severity VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RGD Tracker table (from backend1)
CREATE TABLE IF NOT EXISTS rgd_tracker (
  id INT AUTO_INCREMENT PRIMARY KEY,
  region VARCHAR(255) NOT NULL,
  beneficiaries INT NOT NULL,
  distributed_packages INT NOT NULL,
  last_distribution DATE,
  status VARCHAR(50) DEFAULT 'Pending',
  coordinator VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RGD Inventory table (from backend1)
CREATE TABLE IF NOT EXISTS rgd_inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  quantity INT NOT NULL,
  status VARCHAR(50) DEFAULT 'Available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TDS Events table (from backend2, renamed from tds_events to training_events for consistency)
CREATE TABLE IF NOT EXISTS training_events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  duration VARCHAR(50) NOT NULL,
  location VARCHAR(255) NOT NULL,
  type ENUM('Training', 'Drill', 'Meeting') NOT NULL,
  participants VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('Scheduled', 'In Progress', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tool Resources table (from backend2)
CREATE TABLE IF NOT EXISTS resources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type ENUM('Vehicle', 'Equipment', 'Personnel') NOT NULL,
  category VARCHAR(100) NOT NULL,
  status ENUM('Available', 'In Use', 'Maintenance', 'Out of Service') DEFAULT 'Available',
  location VARCHAR(255) NOT NULL,
  `condition` ENUM('Excellent', 'Good', 'Fair', 'Poor', 'Active') NOT NULL,
  assignedTo VARCHAR(255) NOT NULL,
  lastMaintenance DATE NOT NULL,
  nextMaintenance DATE NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table (from backend server.js, added for WSDR)
CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'Active',
  date_issued TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hotlines table (from backend server.js, added for WSDR)
CREATE TABLE IF NOT EXISTS hotlines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  number VARCHAR(50) NOT NULL,
  category VARCHAR(100),
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- History Logs table (from backend server.js, added for History)
CREATE TABLE IF NOT EXISTS history_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action VARCHAR(255) NOT NULL,
  details TEXT,
  user_id INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- IRR Uploads table (from backend server.js, added for IRR)
CREATE TABLE IF NOT EXISTS irr_uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  uploaded_by VARCHAR(255),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Relief Beneficiaries table (from backend server.js, added for RGD)
CREATE TABLE IF NOT EXISTS relief_beneficiaries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  age INT,
  gender VARCHAR(10),
  address VARCHAR(255),
  needs TEXT,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
