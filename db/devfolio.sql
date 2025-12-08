-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-12-2025 a las 16:00:18
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `devfolio`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `communities`
--

CREATE TABLE `communities` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `creator_id` int(11) NOT NULL,
  `type` enum('general','job_board','portfolio_showcase') DEFAULT 'general',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `community_members`
--

CREATE TABLE `community_members` (
  `id` int(11) NOT NULL,
  `community_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `role` enum('member','moderator','admin') DEFAULT 'member',
  `joined_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `participant1_id` int(11) NOT NULL,
  `participant2_id` int(11) NOT NULL,
  `last_message_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Disparadores `conversations`
--
DELIMITER $$
CREATE TRIGGER `check_duplicate_conversation` BEFORE INSERT ON `conversations` FOR EACH ROW BEGIN
    DECLARE existing_id INT;
    
    -- Check if conversation already exists (in either direction)
    SELECT id INTO existing_id
    FROM conversations
    WHERE (participant1_id = NEW.participant1_id AND participant2_id = NEW.participant2_id)
       OR (participant1_id = NEW.participant2_id AND participant2_id = NEW.participant1_id)
    LIMIT 1;
    
    IF existing_id IS NOT NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Conversation already exists';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `education`
--

CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `institution` varchar(150) NOT NULL,
  `degree` varchar(150) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `experience`
--

CREATE TABLE `experience` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company` varchar(150) NOT NULL,
  `position` varchar(150) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_postings`
--

CREATE TABLE `job_postings` (
  `id` int(11) NOT NULL,
  `community_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `company` varchar(150) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `job_type` enum('full-time','part-time','contract','freelance') DEFAULT 'full-time',
  `posted_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `sender_name` varchar(100) NOT NULL,
  `sender_email` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `portfolios`
--

CREATE TABLE `portfolios` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL DEFAULT 'Mi Portfolio',
  `content_json` text DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `pdf_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `portfolio_views`
--

CREATE TABLE `portfolio_views` (
  `id` int(11) NOT NULL,
  `portfolio_id` int(11) NOT NULL,
  `viewer_id` int(11) DEFAULT NULL,
  `viewed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `titulo` varchar(150) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  `enlace_proyecto` varchar(255) DEFAULT NULL,
  `tecnologias` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `skill_type` enum('technical','soft','hard') DEFAULT 'technical',
  `level` int(11) NOT NULL CHECK (`level` between 1 and 100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `social_links`
--

CREATE TABLE `social_links` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `support_responses`
--

CREATE TABLE `support_responses` (
  `id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL,
  `responder_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_staff_response` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `support_tickets`
--

CREATE TABLE `support_tickets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category` enum('technical','billing','account','feature_request','other') DEFAULT 'technical',
  `subject` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `status` enum('open','in_progress','resolved','closed') DEFAULT 'open',
  `priority` enum('low','medium','high','urgent') DEFAULT 'medium',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `testimonials`
--

CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `author_name` varchar(100) NOT NULL,
  `author_position` varchar(100) DEFAULT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_handle` varchar(20) DEFAULT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `job_title` varchar(100) DEFAULT NULL,
  `company` varchar(100) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `github` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `twitter` varchar(255) DEFAULT NULL,
  `role` enum('admin','tecnico','user') DEFAULT 'user',
  `tutorialPendiente` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `user_handle`, `display_name`, `nombre`, `email`, `password`, `profile_photo`, `bio`, `location`, `phone`, `job_title`, `company`, `website`, `github`, `linkedin`, `twitter`, `role`, `tutorialPendiente`, `created_at`) VALUES
(1, 'user00014f15', 'Ismael Vargas', 'Ismael Vargas', 'ismaelvargasduque14@gmail.com', '$2y$10$DVQ678ZUOJ7hIV0IvfA4fu6L/xFLpejrnny1J9cPYUwYSHquB2RhK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 0, '2025-12-01 15:21:05'),
(2, 'user000259af', 'Test User', 'Test User', 'test@test.com', '$2y$10$K8oeRcVqUkuHbMGPlA8nAetqn./BNM8XKmXx7lbOc/0fCJaPFRita', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-02 15:53:41'),
(3, 'user000031a7', 'Ismael Vargas2', 'Ismael Vargas2', 'ismaelvargasduque143@gmail.com', '$2y$10$U31TaoN7isJqxwQJ.vZ/G.iKJXFEuW2dlFnpE3ltOErPbKB10jFSy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:07:39'),
(4, 'user0000fea2', 'Test User', 'Test User', 'ismaelvargasduq22ue14@gmail.com', '$2y$10$l3GrjA.tzxbkyazjx7Bgvuwr7MfB7Jw9VrXz6nxemtqKVnKDgdCyC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:19:40'),
(5, 'user0000077d', 'Ismael Vargas23', 'Ismael Vargas23', 'ismaelvargasduq223ue14@gmail.com', '$2y$10$3Yc/YqSmq7WqDkPLQ.XLfObu6FlBHJu/ZVRPDpUuPEjcp31qEMiVu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:20:21'),
(6, 'user00007cda', 'Test User', 'Test User', 'test2@test.com', '$2y$10$3rPp5dJ4I8//ug/OpZA8w.VxUJce4ckJ//HfUVnHiQg5m2p90qMZ.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:23:46'),
(7, 'user00004e5f', 'Test User3', 'Test User3', 'te3st@te3st.com', '$2y$10$SdqRtb1rBWl9kXwqV8/Cj..J74ChgBpdJtSqY.1rASbq5IeDGMH5G', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:24:02'),
(8, 'user00006a4f', 'Test Usuario', 'Test Usuario', 'test123@test.com', '$2y$10$Xt4a5CrwyNX750zqsrLvU.aYtYEQSY4.owIQosIT/haCY.lDEBHA6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:25:19'),
(9, 'user00003127', 'Nuevo Usuario', 'Nuevo Usuario', 'nuevo@test.com', '$2y$10$pF15q4so5J8o1FmHh2v84Os8L4kPDjkwHh6vyQEI34QRFujLeBO7q', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:26:43'),
(10, 'user00000067', 'Test User', 'Test User', 'ismaelvarga123sd2uq22ue14@gmail.com', '$2y$10$y4vxNmQhM0wCrYocntXhBOIG4.bR2RCUCTe/62mqLrYz2xda85NBu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:28:28'),
(11, 'user00006684', 'JUANNN', 'JUANNN', '123333@gmail.com', '$2y$10$J/kBcKEAvLhXissYHtRctumdYwC8.GDc8rzIiKyKcR59ghcafYRXy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:28:47'),
(12, 'user00009804', 'Debug Test User', 'Debug Test User', 'debug999@test.com', '$2y$10$A7LjuTDjEIgcbzf7tjB2AOIiqMyt7V9zbYEhbNq0T0EvvHpiOUqN.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:30:06'),
(13, 'user0000ae77', 'dee', 'dee', 'ismaelvar1gasduq223ue14@gmail.com', '$2y$10$uFkb2Ak8ZFNv4kBdESYxB.L8Ia1gwsYBMTZuptFwtuek0mKuPkDXy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 21:32:27'),
(14, 'user00003b26', 'Test User', 'Test User', 'tes3t2@test.com', '$2y$10$MaBpTBQakgYN51Zreue0NeIoiW/OxZjC50V840YErXXGUd6hlKh5e', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:06:30'),
(15, 'user0000a5ac', 'Ismael Vargas', 'Ismael Vargas', 'ismaelvargasduq3223ue14@gmail.com', '$2y$10$6/tSNKAeoWPrLYqqzxaUbOp7s08KwsJv2tNZc1jz/rF2AFLgzPEo2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:07:02'),
(16, 'user0000d42d', 'Final Test User', 'Final Test User', 'finaltest12345@test.com', '$2y$10$F8abwjGMPWWSomOtBfl/len/JPbzaR.IZOKQrZxMSDQi8RktKq9g2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:09:15'),
(17, 'user0000e8bd', 'URL Test', 'URL Test', 'urltest999@test.com', '$2y$10$kdKp6IfX82eFtMQddtEwl.xmTH/hHhBk2znSZXd5VSBFqh1oEP8oW', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:10:18'),
(18, 'user000002ff', 'Test Usuario2', 'Test Usuario2', 'test333@test.com', '$2y$10$tIIGyfr2zvnd.G7sbC0e0OG07r5xHogCmoOZBOgHywInlDF3S9JF.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:19:00'),
(19, 'user00003b0e', '123', '123', 'tes123123t@test.com', '$2y$10$U2xjZc9GX9vjowAclJc6Me9lUxKKSjDNtF/dhIFKqSUtTzeWBeByS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:19:49'),
(20, 'user00007866', 'Test User', 'Test User', 'ismaelvar3gasd2uq22ue14@gmail.com', '$2y$10$M6PGkFf1t/zQSHnvH6hQ3OCrcVR8neuTtVAFafNwtHq6DNgT9GuXC', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:24:13'),
(21, 'user0000e680', 'Test User34', 'Test User34', 'ismaelv3argasduq22ue14@gmail.com', '$2y$10$FXqsPj8CU9Qx6obkskKyk.i3gUCwPfcFnCiwZuj9rD70IOcEx5Eeq', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:26:48'),
(22, 'user00009719', 'asdasd', 'asdasd', 'i44smaelvargasduq22ue14@gmail.com', '$2y$10$rhbXhrILweRD8D1ly72/muqMOGqM5M/XaTF8Ip7eAPiR91z8oJbv2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:28:48'),
(23, 'user00006593', 'Test User33', 'Test User33', '1234333@gmail.com', '$2y$10$JEAHpnAci3oy0LL6C2x22.hQvgAXuP5FwH4j55IPAiFK1zyLrzQwi', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:31:05'),
(24, 'user0000f54c', 'Test User33', 'Test User33', '12343433@gmail.com', '$2y$10$hPl06x34jKCyyPOGPBoypO6WlhJNxIq/Fe7Sy6qzOggWI1TZDbboS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:31:13'),
(25, 'user000057c3', 'Test User33', 'Test User33', '123434433@gmail.com', '$2y$10$kIn9QZRz17Wf7Rimh9Ybp.7w6CJOhfjqj5tFaoi7Ua7foXLr0/8Ta', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:32:48'),
(26, 'user0000c254', 'Test User3', 'Test User3', '4test@test.com', '$2y$10$cdNPPNqEUrxUAb9Nj0wZo.6PIgpBtRFZl6tMjrHB.Kttg6yrcub72', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:44:32'),
(27, 'user00007e22', 'Ismael Vargas3', 'Ismael Vargas3', 't4est@test.com', '$2y$10$cjNeA5s.RQ5j.kA2pDuwi.p1P43D9vXMoZ609ly6N.owtRx5kjCU6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:47:20'),
(28, 'user0000f611', 'Ismael Vargas33', 'Ismael Vargas33', 'te44st@test.com', '$2y$10$Stey8h2l3C35ejPxO2pyRuwfVYyo0.j70o/NvdhVg4ev52pMBoPfu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:51:34'),
(29, 'user00009d73', 'Ismael Vargas', 'Ismael Vargas', 'test.tutorial.1714521408@example.com', '$2y$10$jGWEGA9V39vF52qY2lMKeuYU.Y.z33Rw61pG3WUnL5rjYYI9VfBIy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:57:21'),
(30, 'user00002003', 'Test User34', 'Test User34', 'te4444st@test.com', '$2y$10$nQmisBptgDgV.VrjanD2gOCaVNPS99c26/1xmzbxKehTOqy0gsWoW', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-07 23:59:39'),
(31, 'user0000785a', 'Ismael Vargas4', 'Ismael Vargas4', 'ismael@gmail.com', '$2y$10$LhqIlR2SahXXuvhXUJVbEO8zZe2Oy7.H61XFt6Nerxr.B9ll1NZnK', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-08 00:00:19'),
(32, 'user00000469', 'Test User', 'Test User', 'ismaelvargasduque144@gmail.com', '$2y$10$sXytzdJD9NsE0Z4OzAPtEOw9NPNcybljRb14tKdX49kL6t2GrGXWu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-08 00:08:28'),
(33, 'user0000ca56', 'Isma', 'Isma', 'ismaelvargasduque141@gmail.com', '$2y$10$S3JhUQ0JQSNVsysyFBDPL.nxlbOMDb60x/APRPhP0KrTfOh9iO/iq', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-08 00:44:34'),
(34, 'user0000199b', 'Test User', 'Test User', 'testuser@example.com', '$2y$10$T6MPpMC.umUn63pHMY4F8OGE.iOuUFTKIplPv6IypzJD5hELcPb0.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-08 00:55:23'),
(35, 'user0000a03e', 'Ismael', 'Ismael', 'prueba@gmail.com', '$2y$10$KDWpgNX3dyMEVj2M0Or.AewqcjSayVFk9DlzvOAuCceDbvqhoHhx6', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-08 01:14:59'),
(36, 'user00007b71', 'Test Userrrr', 'Test Userrrr', 'ismaelvargasduque12@gmail.com', '$2y$10$1AuvrcGjVmWKVfl4pU7Lcu4X/zgn8Vgkj.VZwNINStStgBXHsSteG', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'admin', 1, '2025-12-08 01:16:31'),
(37, 'user00003940', 'adminadmin', 'adminadmin', 'admin@gmail.com', '$2y$10$BnvmSviJnk29x9ByE8XW4ecQMKpXejH6VvzaZ3k0cUGz0/2E/I9Cm', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-08 01:19:26'),
(38, 'user000000b8', '123123', '123123', '123123213@gmail.com', '$2y$10$Grw.L9E7qB6ybClembnp0OriMi7Ti9SPPbmfxtrrfMGNr6SDYxkiu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'user', 1, '2025-12-08 12:53:46');

--
-- Disparadores `users`
--
DELIMITER $$
CREATE TRIGGER `generate_user_handle` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
    IF NEW.user_handle IS NULL THEN
        SET NEW.user_handle = CONCAT('user', LPAD(NEW.id, 4, '0'), SUBSTRING(MD5(RAND()), 1, 4));
    END IF;
    IF NEW.display_name IS NULL THEN
        SET NEW.display_name = NEW.nombre;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user_messages`
--

CREATE TABLE `user_messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) DEFAULT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `read_status` tinyint(1) DEFAULT 0,
  `deleted_by_sender` tinyint(1) DEFAULT 0,
  `deleted_by_receiver` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `communities`
--
ALTER TABLE `communities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator_id` (`creator_id`);

--
-- Indices de la tabla `community_members`
--
ALTER TABLE `community_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_membership` (`community_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_participant1` (`participant1_id`),
  ADD KEY `idx_participant2` (`participant2_id`),
  ADD KEY `idx_last_message` (`last_message_at`),
  ADD KEY `idx_participants` (`participant1_id`,`participant2_id`);

--
-- Indices de la tabla `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `experience`
--
ALTER TABLE `experience`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `job_postings`
--
ALTER TABLE `job_postings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `community_id` (`community_id`),
  ADD KEY `posted_by` (`posted_by`);

--
-- Indices de la tabla `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `portfolios`
--
ALTER TABLE `portfolios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `portfolio_views`
--
ALTER TABLE `portfolio_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `portfolio_id` (`portfolio_id`),
  ADD KEY `viewer_id` (`viewer_id`);

--
-- Indices de la tabla `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `social_links`
--
ALTER TABLE `social_links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `support_responses`
--
ALTER TABLE `support_responses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `responder_id` (`responder_id`),
  ADD KEY `idx_ticket` (`ticket_id`);

--
-- Indices de la tabla `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_user` (`user_id`);

--
-- Indices de la tabla `testimonials`
--
ALTER TABLE `testimonials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `user_handle` (`user_handle`);

--
-- Indices de la tabla `user_messages`
--
ALTER TABLE `user_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conversation` (`sender_id`,`receiver_id`),
  ADD KEY `idx_unread` (`receiver_id`,`read_status`),
  ADD KEY `fk_conversation` (`conversation_id`),
  ADD KEY `idx_sender_receiver` (`sender_id`,`receiver_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `communities`
--
ALTER TABLE `communities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `community_members`
--
ALTER TABLE `community_members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `education`
--
ALTER TABLE `education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `experience`
--
ALTER TABLE `experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `job_postings`
--
ALTER TABLE `job_postings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `portfolios`
--
ALTER TABLE `portfolios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `portfolio_views`
--
ALTER TABLE `portfolio_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `social_links`
--
ALTER TABLE `social_links`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `support_responses`
--
ALTER TABLE `support_responses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `support_tickets`
--
ALTER TABLE `support_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `testimonials`
--
ALTER TABLE `testimonials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `user_messages`
--
ALTER TABLE `user_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `communities`
--
ALTER TABLE `communities`
  ADD CONSTRAINT `communities_ibfk_1` FOREIGN KEY (`creator_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `community_members`
--
ALTER TABLE `community_members`
  ADD CONSTRAINT `community_members_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_members_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`participant1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`participant2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `education`
--
ALTER TABLE `education`
  ADD CONSTRAINT `education_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `experience`
--
ALTER TABLE `experience`
  ADD CONSTRAINT `experience_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `job_postings`
--
ALTER TABLE `job_postings`
  ADD CONSTRAINT `job_postings_ibfk_1` FOREIGN KEY (`community_id`) REFERENCES `communities` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `job_postings_ibfk_2` FOREIGN KEY (`posted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `portfolios`
--
ALTER TABLE `portfolios`
  ADD CONSTRAINT `portfolios_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `portfolio_views`
--
ALTER TABLE `portfolio_views`
  ADD CONSTRAINT `portfolio_views_ibfk_1` FOREIGN KEY (`portfolio_id`) REFERENCES `portfolios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `portfolio_views_ibfk_2` FOREIGN KEY (`viewer_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `skills`
--
ALTER TABLE `skills`
  ADD CONSTRAINT `skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `social_links`
--
ALTER TABLE `social_links`
  ADD CONSTRAINT `social_links_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `support_responses`
--
ALTER TABLE `support_responses`
  ADD CONSTRAINT `support_responses_ibfk_1` FOREIGN KEY (`ticket_id`) REFERENCES `support_tickets` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `support_responses_ibfk_2` FOREIGN KEY (`responder_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `support_tickets`
--
ALTER TABLE `support_tickets`
  ADD CONSTRAINT `support_tickets_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `testimonials`
--
ALTER TABLE `testimonials`
  ADD CONSTRAINT `testimonials_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `user_messages`
--
ALTER TABLE `user_messages`
  ADD CONSTRAINT `fk_conversation` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
