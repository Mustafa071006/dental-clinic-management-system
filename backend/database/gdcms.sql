-- ================================================
-- Golden Dental Center Management System (GDCMS)
-- Full Database Schema + Demo Seed Data
--
-- Import this single file into MySQL (e.g. via phpMyAdmin,
-- or `mysql -u root -p < gdcms.sql`) to set up the database
-- with a ready-to-use demo dataset.
-- ================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE DATABASE IF NOT EXISTS `gdcms` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `gdcms`;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `roles` (`id`, `name`, `created_at`) VALUES
(1, 'ADMIN', CURRENT_TIMESTAMP),
(2, 'DOCTOR', CURRENT_TIMESTAMP);

-- --------------------------------------------------------

--
-- Table structure for table `users`
-- (covers both administrators and doctors, distinguished by `role_id`)
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_id` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `status` enum('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `specialization` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Demo users
-- Admin password:  admin123
-- Doctor password: dokter123
-- (both bcrypt-hashed, 10 rounds)
--

INSERT INTO `users` (`id`, `role_id`, `email`, `password`, `name`, `status`, `created_at`, `updated_at`, `specialization`) VALUES
(1, 1, 'admin@gdc.com', '$2b$10$WSWXWvHEz2KZIyVp.cUCS.hp9kDglrcjRE4q/DNK4ctPeQne2mdh.', 'Administrator', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, NULL),
(2, 2, 'sarah@gdc.com', '$2b$10$bec.mAKry3wTTLtNLwiKcOXGpW53bxsis2A9rCbb2Tvc285.C1Umu', 'Dr. Sarah Jenkins', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Orthodontist'),
(3, 2, 'michael@gdc.com', '$2b$10$bec.mAKry3wTTLtNLwiKcOXGpW53bxsis2A9rCbb2Tvc285.C1Umu', 'Dr. Michael Chen', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'Periodontist');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE IF NOT EXISTS `patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doctor_id` int NOT NULL,
  `medical_record_number` varchar(50) DEFAULT NULL,
  `full_name` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text,
  `date_of_birth` date DEFAULT NULL,
  `gender` enum('MALE','FEMALE') DEFAULT NULL,
  `assigned_date` date DEFAULT NULL,
  `status` enum('ACTIVE','COMPLETE','INACTIVE') DEFAULT 'ACTIVE',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medical_record_number` (`medical_record_number`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `patients` (`id`, `doctor_id`, `medical_record_number`, `full_name`, `phone`, `address`, `date_of_birth`, `gender`, `assigned_date`, `status`, `created_at`, `updated_at`) VALUES
(1, 2, 'RM20260601001', 'Ahmad Fauzi', '081234567801', 'Jl. Merdeka No. 12, Jakarta', '1990-05-14', 'MALE', '2026-06-01', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 'RM20260601002', 'Siti Nurhaliza', '081234567802', 'Jl. Sudirman No. 45, Bandung', '1995-11-02', 'FEMALE', '2026-06-01', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 'RM20260601003', 'Budi Santoso', '081234567803', 'Jl. Diponegoro No. 8, Surabaya', '1988-02-20', 'MALE', '2026-06-02', 'COMPLETE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 3, 'RM20260601004', 'Dewi Lestari', '081234567804', 'Jl. Gatot Subroto No. 21, Yogyakarta', '2001-07-09', 'FEMALE', '2026-06-02', 'INACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------

--
-- Table structure for table `examinations`
--

CREATE TABLE IF NOT EXISTS `examinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `examination_date` date NOT NULL,
  `complaint` text,
  `diagnosis` text,
  `treatment` text,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `examinations_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `examinations_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `examinations` (`id`, `patient_id`, `doctor_id`, `examination_date`, `complaint`, `diagnosis`, `treatment`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2026-06-05', 'Tooth pain when chewing on the lower left side', 'Dental caries (cavity)', 'Composite filling', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 2, '2026-06-10', 'Bleeding gums during brushing', 'Gingivitis', 'Scaling and root planing', 'Advised to improve daily flossing routine.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 3, '2026-06-12', 'Routine dental check-up', 'No significant findings', 'Professional cleaning', NULL, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------

--
-- Table structure for table `control_schedules`
--

CREATE TABLE IF NOT EXISTS `control_schedules` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `control_date` date NOT NULL,
  `control_time` time DEFAULT NULL,
  `notes` text,
  `status` enum('PENDING','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `doctor_id` (`doctor_id`),
  CONSTRAINT `control_schedules_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `control_schedules_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `control_schedules` (`id`, `patient_id`, `doctor_id`, `control_date`, `control_time`, `notes`, `status`, `created_at`, `updated_at`) VALUES
(1, 1, 2, '2026-06-20', '10:00:00', 'Follow-up on composite filling', 'COMPLETED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 2, '2026-06-25', '13:30:00', 'Gum health follow-up', 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 3, 3, '2026-07-01', '09:00:00', 'Annual check-up reminder', 'CANCELLED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- --------------------------------------------------------

--
-- Table structure for table `doctor_transfer_history`
--

CREATE TABLE IF NOT EXISTS `doctor_transfer_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `from_doctor_id` int NOT NULL,
  `to_doctor_id` int NOT NULL,
  `transferred_by` int NOT NULL,
  `reason` text,
  `transferred_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `from_doctor_id` (`from_doctor_id`),
  KEY `to_doctor_id` (`to_doctor_id`),
  KEY `transferred_by` (`transferred_by`),
  CONSTRAINT `doctor_transfer_history_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `doctor_transfer_history_ibfk_2` FOREIGN KEY (`from_doctor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `doctor_transfer_history_ibfk_3` FOREIGN KEY (`to_doctor_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `doctor_transfer_history_ibfk_4` FOREIGN KEY (`transferred_by`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `doctor_transfer_history` (`id`, `patient_id`, `from_doctor_id`, `to_doctor_id`, `transferred_by`, `reason`, `transferred_at`) VALUES
(1, 3, 2, 3, 1, 'Patient requested a doctor specializing in periodontics.', CURRENT_TIMESTAMP),
(2, 4, 2, 3, 1, 'Reassigned due to a scheduling conflict with the previous doctor.', CURRENT_TIMESTAMP);

-- --------------------------------------------------------

--
-- AUTO_INCREMENT starting points (continues on from the seed data above)
--

ALTER TABLE `roles` AUTO_INCREMENT = 3;
ALTER TABLE `users` AUTO_INCREMENT = 4;
ALTER TABLE `patients` AUTO_INCREMENT = 5;
ALTER TABLE `examinations` AUTO_INCREMENT = 4;
ALTER TABLE `control_schedules` AUTO_INCREMENT = 4;
ALTER TABLE `doctor_transfer_history` AUTO_INCREMENT = 3;

COMMIT;
