-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 23, 2025 at 11:55 AM
-- Server version: 9.1.0
-- PHP Version: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `aspm`
--

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

DROP TABLE IF EXISTS `company`;
CREATE TABLE IF NOT EXISTS `company` (
  `c_id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `c_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`c_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`c_id`, `c_data`) VALUES
(1, '{\"name\":\"Acme Web Solutions\",\"industry\":\"Software Development\",\"location\":\"San Francisco, CA\",\"founded\":2012,\"team_size\":42}'),
(2, '{\"name\":\"Pixel Dynamics\",\"industry\":\"UI/UX Design\",\"location\":\"Austin, TX\",\"founded\":2016,\"team_size\":18}');

-- --------------------------------------------------------

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
CREATE TABLE IF NOT EXISTS `member` (
  `m_id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `s_id` int UNSIGNED NOT NULL,
  `m_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`m_id`)
) ENGINE=MyISAM AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `member`
--

INSERT INTO `member` (`m_id`, `s_id`, `m_data`) VALUES
(1, 1, '{\"email\":\"gideonkoch@acmeweb.dev\",\"role\":\"Frontend Developer\",\"skills\":[\"HTML\",\"CSS\",\"JavaScript\"],\"kanban\":{\"log\":[{\"tid\":\"1\",\"tos\":\"1\",\"uid\":\"100\",\"froms\":\"0\"}],\"ver\":\"2025a\",\"tasks\":{\"1\":{\"data\":{\"info\":\"Fix layout\",\"title\":\"Fix UI\"}},\"2\":{\"data\":{\"info\":\"Media queries\",\"title\":\"Responsive Fix\"}},\"3\":{\"data\":{\"info\":\"Nav styling\",\"title\":\"Nav Styling\"}},\"4\":{\"data\":{\"info\":\"Accessibility fixes\",\"title\":\"ARIA Fix\"}},\"5\":{\"data\":{\"info\":\"Firefox test\",\"title\":\"Browser Test\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"1\":\"0\",\"2\":\"1\",\"3\":\"2\",\"4\":\"2\",\"5\":\"3\"},\"memberid\":\"1\"}}'),
(2, 2, '{\"email\":\"sam.rivera@abc.dev\",\"role\":\"Backend Developer\",\"skills\":[\"PHP\",\"MySQL\",\"REST APIs\"],\"kanban\":{\"log\":[{\"tid\":\"6\",\"tos\":\"2\",\"uid\":\"101\",\"froms\":\"1\"}],\"ver\":\"2025a\",\"tasks\":{\"6\":{\"data\":{\"info\":\"API routes\",\"title\":\"API Setup\"}},\"7\":{\"data\":{\"info\":\"Auth tokens\",\"title\":\"Token Auth\"}},\"8\":{\"data\":{\"info\":\"DB schema\",\"title\":\"DB Schema\"}},\"9\":{\"data\":{\"info\":\"Seeder script\",\"title\":\"Seeder\"}},\"10\":{\"data\":{\"info\":\"Query optimization\",\"title\":\"Query Opt\"}},\"11\":{\"data\":{\"info\":\"DB backup\",\"title\":\"Backup\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"6\":\"2\",\"7\":\"3\",\"8\":\"1\",\"9\":\"0\",\"10\":\"2\",\"11\":\"4\"},\"memberid\":\"2\"}}'),
(3, 3, '{\"email\":\"amira.patel@acmeweb.dev\",\"role\":\"UI Designer\",\"skills\":[\"Figma\",\"CSS\",\"AdobeXD\"],\"kanban\":{\"log\":[{\"tid\":\"12\",\"tos\":\"1\",\"uid\":\"102\",\"froms\":\"0\"}],\"ver\":\"2025a\",\"tasks\":{\"12\":{\"data\":{\"info\":\"Sketch homepage\",\"title\":\"Home Design\"}},\"13\":{\"data\":{\"info\":\"Settings wireframe\",\"title\":\"Settings UI\"}},\"14\":{\"data\":{\"info\":\"Design icons\",\"title\":\"Icon Pack\"}},\"15\":{\"data\":{\"info\":\"Typography review\",\"title\":\"Typography\"}},\"16\":{\"data\":{\"info\":\"Palette pick\",\"title\":\"Colors\"}},\"17\":{\"data\":{\"info\":\"UI review\",\"title\":\"UI Review\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"12\":\"1\",\"13\":\"2\",\"14\":\"3\",\"15\":\"1\",\"16\":\"0\",\"17\":\"2\"},\"memberid\":\"3\"}}'),
(4, 4, '{\"email\":\"leo.martinez@pixeldyn.dev\",\"role\":\"Full Stack Developer\",\"skills\":[\"JavaScript\",\"PHP\",\"MySQL\"],\"kanban\":{\"log\":[{\"tid\":\"18\",\"tos\":\"2\",\"uid\":\"103\",\"froms\":\"1\"}],\"ver\":\"2025a\",\"tasks\":{\"18\":{\"data\":{\"info\":\"Auth module\",\"title\":\"User Auth\"}},\"19\":{\"data\":{\"info\":\"Integration\",\"title\":\"Integration\"}},\"20\":{\"data\":{\"info\":\"Session handling\",\"title\":\"Sessions\"}},\"21\":{\"data\":{\"info\":\"Password hashing\",\"title\":\"Security\"}},\"22\":{\"data\":{\"info\":\"Migration scripts\",\"title\":\"Migrations\"}},\"23\":{\"data\":{\"info\":\"Unit tests\",\"title\":\"Unit Tests\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"18\":\"3\",\"19\":\"2\",\"20\":\"2\",\"21\":\"3\",\"22\":\"1\",\"23\":\"4\"},\"memberid\":\"4\"}}'),
(5, 5, '{\"email\":\"tanya.brooks@acmeweb.dev\",\"role\":\"QA Engineer\",\"skills\":[\"Test Automation\",\"Selenium\",\"Bug Tracking\"],\"kanban\":{\"log\":[{\"tid\":\"24\",\"tos\":\"4\",\"uid\":\"104\",\"froms\":\"3\"}],\"ver\":\"2025a\",\"tasks\":{\"24\":{\"data\":{\"info\":\"Login test\",\"title\":\"Login QA\"}},\"25\":{\"data\":{\"info\":\"Form validation\",\"title\":\"Form QA\"}},\"26\":{\"data\":{\"info\":\"Cross-browser test\",\"title\":\"Cross-Browser\"}},\"27\":{\"data\":{\"info\":\"Mobile QA\",\"title\":\"Mobile QA\"}},\"28\":{\"data\":{\"info\":\"Bug triage\",\"title\":\"Bug List\"}},\"29\":{\"data\":{\"info\":\"Defect report\",\"title\":\"Defect Report\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"24\":\"4\",\"25\":\"4\",\"26\":\"3\",\"27\":\"2\",\"28\":\"1\",\"29\":\"0\"},\"memberid\":\"5\"}}'),
(6, 6, '{\"email\":\"kenji.tanaka@pixeldyn.dev\",\"role\":\"DevOps Engineer\",\"skills\":[\"CI/CD\",\"Docker\",\"GitHubActions\"],\"kanban\":{\"log\":[{\"tid\":\"30\",\"tos\":\"3\",\"uid\":\"105\",\"froms\":\"2\"}],\"ver\":\"2025a\",\"tasks\":{\"30\":{\"data\":{\"info\":\"CI setup\",\"title\":\"CI Config\"}},\"31\":{\"data\":{\"info\":\"Dockerfile\",\"title\":\"Dockerfile\"}},\"32\":{\"data\":{\"info\":\"Deploy\",\"title\":\"Deployment\"}},\"33\":{\"data\":{\"info\":\"Monitor pipeline\",\"title\":\"CI Monitor\"}},\"34\":{\"data\":{\"info\":\"Manage secrets\",\"title\":\"Secrets\"}},\"35\":{\"data\":{\"info\":\"YAML cleanup\",\"title\":\"CI Tidy\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"30\":\"1\",\"31\":\"2\",\"32\":\"3\",\"33\":\"4\",\"34\":\"2\",\"35\":\"3\"},\"memberid\":\"6\"}}'),
(7, 7, '{\"email\":\"nina.osei@abc.dev\",\"role\":\"Frontend Developer\",\"skills\":[\"React\",\"JavaScript\",\"CSS\"],\"kanban\":{\"log\":[{\"tid\":\"36\",\"tos\":\"2\",\"uid\":\"106\",\"froms\":\"1\"}],\"ver\":\"2025a\",\"tasks\":{\"36\":{\"data\":{\"info\":\"React components\",\"title\":\"Components\"}},\"37\":{\"data\":{\"info\":\"State mgmt\",\"title\":\"State\"}},\"38\":{\"data\":{\"info\":\"Custom hooks\",\"title\":\"Hooks\"}},\"39\":{\"data\":{\"info\":\"JSX fix\",\"title\":\"JSX Fix\"}},\"40\":{\"data\":{\"info\":\"Routing\",\"title\":\"Routing\"}},\"41\":{\"data\":{\"info\":\"Form validation\",\"title\":\"React Forms\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"36\":\"2\",\"37\":\"3\",\"38\":\"1\",\"39\":\"1\",\"40\":\"2\",\"41\":\"3\"},\"memberid\":\"7\"}}'),
(8, 8, '{\"email\":\"carlos.mendes@acmeweb.dev\",\"role\":\"Backend Developer\",\"skills\":[\"NodeJS\",\"MongoDB\",\"Express\"],\"kanban\":{\"log\":[{\"tid\":\"42\",\"tos\":\"1\",\"uid\":\"107\",\"froms\":\"0\"}],\"ver\":\"2025a\",\"tasks\":{\"42\":{\"data\":{\"info\":\"Server setup\",\"title\":\"Express\"}},\"43\":{\"data\":{\"info\":\"REST endpoints\",\"title\":\"API\"}},\"44\":{\"data\":{\"info\":\"JWT auth\",\"title\":\"JWT\"}},\"45\":{\"data\":{\"info\":\"Model creation\",\"title\":\"Schema\"}},\"46\":{\"data\":{\"info\":\"Validators\",\"title\":\"Validators\"}},\"47\":{\"data\":{\"info\":\"Add logging\",\"title\":\"Logging\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"42\":\"0\",\"43\":\"1\",\"44\":\"2\",\"45\":\"3\",\"46\":\"2\",\"47\":\"1\"},\"memberid\":\"8\"}}'),
(9, 9, '{\"email\":\"sophie.dubois@pixeldyn.dev\",\"role\":\"Project Manager\",\"skills\":[\"Agile\",\"Scrum\",\"Leadership\"],\"kanban\":{\"log\":[{\"tid\":\"48\",\"tos\":\"0\",\"uid\":\"108\",\"froms\":\"0\"}],\"ver\":\"2025a\",\"tasks\":{\"48\":{\"data\":{\"info\":\"Backlog creation\",\"title\":\"Backlog\"}},\"49\":{\"data\":{\"info\":\"Sprint plan\",\"title\":\"Sprint Plan\"}},\"50\":{\"data\":{\"info\":\"Standup prep\",\"title\":\"Standup\"}},\"51\":{\"data\":{\"info\":\"Ticket assign\",\"title\":\"Assign Tickets\"}},\"52\":{\"data\":{\"info\":\"Track burndown\",\"title\":\"Burndown\"}},\"53\":{\"data\":{\"info\":\"Sprint review\",\"title\":\"Review\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"48\":\"0\",\"49\":\"1\",\"50\":\"1\",\"51\":\"2\",\"52\":\"3\",\"53\":\"2\"},\"memberid\":\"9\"}}'),
(10, 10, '{\"email\":\"mohammed.rahman@abc.dev\",\"role\":\"Data Analyst\",\"skills\":[\"SQL\",\"Excel\",\"PowerBI\"],\"kanban\":{\"log\":[{\"tid\":\"54\",\"tos\":\"4\",\"uid\":\"109\",\"froms\":\"3\"}],\"ver\":\"2025a\",\"tasks\":{\"54\":{\"data\":{\"info\":\"Report generation\",\"title\":\"KPI Report\"}},\"55\":{\"data\":{\"info\":\"Dashboards\",\"title\":\"Dashboard\"}},\"56\":{\"data\":{\"info\":\"Log queries\",\"title\":\"Logs\"}},\"57\":{\"data\":{\"info\":\"Data clean\",\"title\":\"Cleaning\"}},\"58\":{\"data\":{\"info\":\"SQL tuning\",\"title\":\"Optimization\"}},\"59\":{\"data\":{\"info\":\"Compare metrics\",\"title\":\"Comparison\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"54\":\"2\",\"55\":\"3\",\"56\":\"3\",\"57\":\"1\",\"58\":\"2\",\"59\":\"4\"},\"memberid\":\"10\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
CREATE TABLE IF NOT EXISTS `product` (
  `p_id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `c_id` int UNSIGNED NOT NULL,
  `p_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`p_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`p_id`, `c_id`, `p_data`) VALUES
(1, 1, '{\"uid\":\"11\",\"name\":\"KanbanMaster\",\"description\":\"Project management tool\",\"version\":\"1.2.3\",\"release_date\":\"2025-10-01\",\"status\":\"In Development\",\"kanban\":{\"log\":[{\"tid\":\"1\",\"tos\":\"2\",\"uid\":\"11\",\"froms\":\"1\"},{\"tid\":\"2\",\"tos\":\"3\",\"uid\":\"11\",\"froms\":\"2\"}],\"ver\":\"2025a\",\"tasks\":{\"1\":{\"data\":{\"info\":\"Define MVP\",\"title\":\"MVP Definition\"}},\"2\":{\"data\":{\"info\":\"User research\",\"title\":\"User Research\"}},\"3\":{\"data\":{\"info\":\"Feature list\",\"title\":\"Feature List\"}},\"4\":{\"data\":{\"info\":\"Roadmap\",\"title\":\"Product Roadmap\"}},\"5\":{\"data\":{\"info\":\"Release plan\",\"title\":\"Release Plan\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"1\":\"0\",\"2\":\"1\",\"3\":\"2\",\"4\":\"3\",\"5\":\"4\"}}}'),
(2, 2, '{\"uid\":\"12\",\"name\":\"FlowTrack\",\"description\":\"Remote task flow tracker\",\"version\":\"2.0.0\",\"release_date\":\"2024-08-15\",\"status\":\"Released\",\"kanban\":{\"log\":[{\"tid\":\"6\",\"tos\":\"1\",\"uid\":\"12\",\"froms\":\"0\"},{\"tid\":\"7\",\"tos\":\"2\",\"uid\":\"12\",\"froms\":\"1\"}],\"ver\":\"2025a\",\"tasks\":{\"6\":{\"data\":{\"info\":\"Define flows\",\"title\":\"Flow Definition\"}},\"7\":{\"data\":{\"info\":\"UX review\",\"title\":\"UX Review\"}},\"8\":{\"data\":{\"info\":\"Integrations\",\"title\":\"Integrations\"}},\"9\":{\"data\":{\"info\":\"Launch prep\",\"title\":\"Launch Prep\"}},\"10\":{\"data\":{\"info\":\"Post-launch\",\"title\":\"Post Launch\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"6\":\"1\",\"7\":\"2\",\"8\":\"3\",\"9\":\"4\",\"10\":\"0\"}}}');

-- --------------------------------------------------------

--
-- Table structure for table `p_m`
--

DROP TABLE IF EXISTS `p_m`;
CREATE TABLE IF NOT EXISTS `p_m` (
  `p_id` int UNSIGNED NOT NULL,
  `m_id` int UNSIGNED NOT NULL,
  KEY `e_id` (`p_id`,`m_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `p_m`
--

INSERT INTO `p_m` (`p_id`, `m_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 9),
(1, 10),
(2, 1),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(2, 6),
(2, 7),
(2, 8),
(2, 9),
(2, 10);

-- --------------------------------------------------------

--
-- Table structure for table `scrum_team`
--

DROP TABLE IF EXISTS `scrum_team`;
CREATE TABLE IF NOT EXISTS `scrum_team` (
  `s_id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `c_id` int UNSIGNED NOT NULL,
  `c_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`s_id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `scrum_team`
--

INSERT INTO `scrum_team` (`s_id`, `c_id`, `c_data`) VALUES
(1, 1, '{\"uid\":13,\"name\":\"Jordan Lee\",\"email\":\"jordan.lee@acmeweb.dev\",\"phone\":\"+1-555-0199\",\"experience_years\":5,\"kanban\":{\"log\":[{\"tid\":\"11\",\"tos\":\"3\",\"uid\":\"13\",\"froms\":\"2\"},{\"tid\":\"12\",\"tos\":\"4\",\"uid\":\"13\",\"froms\":\"3\"}],\"ver\":\"2025a\",\"tasks\":{\"11\":{\"data\":{\"info\":\"Facilitate session\",\"title\":\"Facilitation\"}},\"12\":{\"data\":{\"info\":\"Remove blockers\",\"title\":\"Blocker Removal\"}},\"13\":{\"data\":{\"info\":\"Coach team\",\"title\":\"Team Coaching\"}},\"14\":{\"data\":{\"info\":\"Conduct retros\", \"title\":\"Retrospective\"}},\"15\":{\"data\":{\"info\":\"Plan sprint\",\"title\":\"Sprint Planning\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"11\":\"2\",\"12\":\"3\",\"13\":\"1\",\"14\":\"0\",\"15\":\"4\"}}}'),
(2, 2, '{\"uid\":14,\"name\":\"Riley Chen\",\"email\":\"riley.chen@pixeldyn.dev\",\"phone\":\"+1-555-0248\",\"experience_years\":3,\"kanban\":{\"log\":[{\"tid\":\"16\",\"tos\":\"2\",\"uid\":\"14\",\"froms\":\"1\"},{\"tid\":\"17\",\"tos\":\"3\",\"uid\":\"14\",\"froms\":\"2\"}],\"ver\":\"2025a\",\"tasks\":{\"16\":{\"data\":{\"info\":\"Sprint backlog\",\"title\":\"Backlog\"}},\"17\":{\"data\":{\"info\":\"Daily standup\",\"title\":\"Standups\"}},\"18\":{\"data\":{\"info\":\"Team health\",\"title\":\"Health Check\"}},\"19\":{\"data\":{\"info\":\"Iteration review\",\"title\":\"Iteration Review\"}},\"20\":{\"data\":{\"info\":\"Continuous improvement\",\"title\":\"Kaizen\"}}},\"status\":[\"New\",\"To Do\",\"Doing\",\"Test\",\"Done\"],\"process\":{\"16\":\"1\",\"17\":\"2\",\"18\":\"3\",\"19\":\"4\",\"20\":\"0\"}}}');

-- --------------------------------------------------------

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `t_id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `t_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  PRIMARY KEY (`t_id`)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `task`
--

INSERT INTO `task` (`t_id`, `t_data`) VALUES
(1, '{\"t_id\":\"1\",\"data\":{\"info\":\"Fix layout\",\"title\":\"Fix UI\"}}'),
(2, '{\"t_id\":\"2\",\"data\":{\"info\":\"Media queries\",\"title\":\"Responsive Fix\"}}'),
(3, '{\"t_id\":\"3\",\"data\":{\"info\":\"Nav styling\",\"title\":\"Nav Styling\"}}'),
(4, '{\"t_id\":\"4\",\"data\":{\"info\":\"Accessibility fixes\",\"title\":\"ARIA Fix\"}}'),
(5, '{\"t_id\":\"5\",\"data\":{\"info\":\"Firefox test\",\"title\":\"Browser Test\"}}'),
(6, '{\"t_id\":\"6\",\"data\":{\"info\":\"API routes\",\"title\":\"API Setup\"}}'),
(7, '{\"t_id\":\"7\",\"data\":{\"info\":\"Auth tokens\",\"title\":\"Token Auth\"}}'),
(8, '{\"t_id\":\"8\",\"data\":{\"info\":\"DB schema\",\"title\":\"DB Schema\"}}'),
(9, '{\"t_id\":\"9\",\"data\":{\"info\":\"Seeder script\",\"title\":\"Seeder\"}}'),
(10, '{\"t_id\":\"10\",\"data\":{\"info\":\"Query optimization\",\"title\":\"Query Opt\"}}'),
(11, '{\"t_id\":\"11\",\"data\":{\"info\":\"DB backup\",\"title\":\"Backup\"}}'),
(12, '{\"t_id\":\"12\",\"data\":{\"info\":\"Sketch homepage\",\"title\":\"Home Design\"}}'),
(13, '{\"t_id\":\"13\",\"data\":{\"info\":\"Settings wireframe\",\"title\":\"Settings UI\"}}'),
(14, '{\"t_id\":\"14\",\"data\":{\"info\":\"Design icons\",\"title\":\"Icon Pack\"}}'),
(15, '{\"t_id\":\"15\",\"data\":{\"info\":\"Typography review\",\"title\":\"Typography\"}}'),
(16, '{\"t_id\":\"16\",\"data\":{\"info\":\"Palette pick\",\"title\":\"Colors\"}}'),
(17, '{\"t_id\":\"17\",\"data\":{\"info\":\"UI review\",\"title\":\"UI Review\"}}'),
(18, '{\"t_id\":\"18\",\"data\":{\"info\":\"Auth module\",\"title\":\"User Auth\"}}'),
(19, '{\"t_id\":\"19\",\"data\":{\"info\":\"Integration\",\"title\":\"Integration\"}}'),
(20, '{\"t_id\":\"20\",\"data\":{\"info\":\"Session handling\",\"title\":\"Sessions\"}}'),
(21, '{\"t_id\":\"21\",\"data\":{\"info\":\"Password hashing\",\"title\":\"Security\"}}'),
(22, '{\"t_id\":\"22\",\"data\":{\"info\":\"Migration scripts\",\"title\":\"Migrations\"}}'),
(23, '{\"t_id\":\"23\",\"data\":{\"info\":\"Unit tests\",\"title\":\"Unit Tests\"}}'),
(24, '{\"t_id\":\"24\",\"data\":{\"info\":\"Login test\",\"title\":\"Login QA\"}}'),
(25, '{\"t_id\":\"25\",\"data\":{\"info\":\"Form validation\",\"title\":\"Form QA\"}}'),
(26, '{\"t_id\":\"26\",\"data\":{\"info\":\"Cross-browser test\",\"title\":\"Cross-Browser\"}}'),
(27, '{\"t_id\":\"27\",\"data\":{\"info\":\"Mobile QA\",\"title\":\"Mobile QA\"}}'),
(28, '{\"t_id\":\"28\",\"data\":{\"info\":\"Bug triage\",\"title\":\"Bug List\"}}'),
(29, '{\"t_id\":\"29\",\"data\":{\"info\":\"Defect report\",\"title\":\"Defect Report\"}}'),
(30, '{\"t_id\":\"30\",\"data\":{\"info\":\"CI setup\",\"title\":\"CI Config\"}}'),
(31, '{\"t_id\":\"31\",\"data\":{\"info\":\"Dockerfile\",\"title\":\"Dockerfile\"}}'),
(32, '{\"t_id\":\"32\",\"data\":{\"info\":\"Deploy\",\"title\":\"Deployment\"}}'),
(33, '{\"t_id\":\"33\",\"data\":{\"info\":\"Monitor pipeline\",\"title\":\"CI Monitor\"}}'),
(34, '{\"t_id\":\"34\",\"data\":{\"info\":\"Manage secrets\",\"title\":\"Secrets\"}}'),
(35, '{\"t_id\":\"35\",\"data\":{\"info\":\"YAML cleanup\",\"title\":\"CI Tidy\"}}'),
(36, '{\"t_id\":\"36\",\"data\":{\"info\":\"React components\",\"title\":\"Components\"}}'),
(37, '{\"t_id\":\"37\",\"data\":{\"info\":\"State mgmt\",\"title\":\"State\"}}'),
(38, '{\"t_id\":\"38\",\"data\":{\"info\":\"Custom hooks\",\"title\":\"Hooks\"}}'),
(39, '{\"t_id\":\"39\",\"data\":{\"info\":\"JSX fix\",\"title\":\"JSX Fix\"}}'),
(40, '{\"t_id\":\"40\",\"data\":{\"info\":\"Routing\",\"title\":\"Routing\"}}'),
(41, '{\"t_id\":\"41\",\"data\":{\"info\":\"Form validation\",\"title\":\"React Forms\"}}'),
(42, '{\"t_id\":\"42\",\"data\":{\"info\":\"Server setup\",\"title\":\"Express\"}}'),
(43, '{\"t_id\":\"43\",\"data\":{\"info\":\"REST endpoints\",\"title\":\"API\"}}'),
(44, '{\"t_id\":\"44\",\"data\":{\"info\":\"JWT auth\",\"title\":\"JWT\"}}'),
(45, '{\"t_id\":\"45\",\"data\":{\"info\":\"Model creation\",\"title\":\"Schema\"}}'),
(46, '{\"t_id\":\"46\",\"data\":{\"info\":\"Validators\",\"title\":\"Validators\"}}'),
(47, '{\"t_id\":\"47\",\"data\":{\"info\":\"Add logging\",\"title\":\"Logging\"}}'),
(48, '{\"t_id\":\"48\",\"data\":{\"info\":\"Backlog creation\",\"title\":\"Backlog\"}}'),
(49, '{\"t_id\":\"49\",\"data\":{\"info\":\"Sprint plan\",\"title\":\"Sprint Plan\"}}'),
(50, '{\"t_id\":\"50\",\"data\":{\"info\":\"Standup prep\",\"title\":\"Standup\"}}');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `uid` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `login` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` int UNSIGNED NOT NULL,
  `lastused` datetime NOT NULL,
  PRIMARY KEY (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`uid`, `login`, `password`, `name`, `role`, `lastused`) VALUES
(1, 'gideonkoch', '123', 'Gideon Koch', 4, '2025-06-23 07:05:29'),
(2, 'sam.rivera', '123', 'Sam Rivera', 4, '2025-06-23 07:05:29'),
(3, 'amira.patel', '123', 'Amira Patel', 4, '2025-06-23 07:05:29'),
(4, 'leo.martinez', '123', 'Leo Martinez', 4, '2025-06-23 07:05:29'),
(5, 'tanya.brooks', '123', 'Tanya Brooks', 4, '2025-06-23 07:05:29'),
(6, 'kenji.tanaka', '123', 'Kenji Tanaka', 4, '2025-06-23 07:05:29'),
(7, 'nina.osei', '123', 'Nina Osei', 4, '2025-06-23 07:05:29'),
(8, 'carlos.mendes', '123', 'Carlos Mendes', 4, '2025-06-23 07:05:29'),
(9, 'sophie.dubois', '123', 'Sophie Dubois', 4, '2025-06-23 07:05:29'),
(10, 'mohammed.rahman', '123', 'Mohammed Rahman', 4, '2025-06-23 07:05:29'),
(11, 'alice.johnson', '123', 'Alice Johnson', 3, '2025-06-23 07:05:29'),
(12, 'bob.lee', '123', 'Bob Lee', 3, '2025-06-23 07:05:29'),
(13, 'jordan.lee', '123', 'Jordan Lee', 2, '2025-06-23 07:05:29'),
(14, 'riley.chen', '123', 'Riley Chen', 2, '2025-06-23 07:05:29'),
(15, 'aby.rahn', '123', 'Aby Rahan', 1, '2025-06-23 11:14:39');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
