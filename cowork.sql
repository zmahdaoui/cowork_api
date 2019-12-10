-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Mar 10 Décembre 2019 à 17:36
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `cowork`
--

-- --------------------------------------------------------

--
-- Structure de la table `abonnement`
--

CREATE TABLE IF NOT EXISTS `abonnement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `commitment` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=11 ;

--
-- Contenu de la table `abonnement`
--

INSERT INTO `abonnement` (`id`, `name`, `price`, `commitment`) VALUES
(7, 'abonnement simple', 240, 1),
(8, 'abonnement simple', 24, 0),
(9, 'abonnement résident', 300, 0),
(10, 'abonnement résident', 2016, 1);

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

CREATE TABLE IF NOT EXISTS `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_sender` int(11) NOT NULL,
  `id_receiver` int(11) NOT NULL,
  `id_ticket` int(11) NOT NULL,
  `content` varchar(255) NOT NULL,
  `date_sending` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Structure de la table `open_space`
--

CREATE TABLE IF NOT EXISTS `open_space` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `wifi` varchar(255) NOT NULL,
  `drink` varchar(255) NOT NULL,
  `plateau_repas` varchar(255) NOT NULL,
  `conf_room` int(11) NOT NULL,
  `call_room` int(11) NOT NULL,
  `cosy_room` int(11) NOT NULL,
  `printers` int(11) NOT NULL,
  `laptops` int(11) NOT NULL,
  `schedule_mt` varchar(255) NOT NULL,
  `schedule_f` varchar(255) NOT NULL,
  `schedule_we` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=12 ;

--
-- Contenu de la table `open_space`
--

INSERT INTO `open_space` (`id`, `location`, `wifi`, `drink`, `plateau_repas`, `conf_room`, `call_room`, `cosy_room`, `printers`, `laptops`, `schedule_mt`, `schedule_f`, `schedule_we`, `adresse`) VALUES
(4, 'Bastille', 'true', 'true', 'true', 2, 3, 1, 1, 1, '9,20', '9,20', '11,20', '21-19 Rue Saint-Antoine 75004 Paris'),
(5, 'Republique', 'true', 'true', 'false', 7, 5, 4, 3, 25, '8,21', '9,23', '9,20', '1 Place de la République 75003 Paris'),
(7, 'Odéon', 'true', 'true', 'true', 4, 2, 2, 2, 18, '9,20', '9,20', '11,20', 'Place Henri Mondor 75006 Paris'),
(9, 'Place d''Italie', 'true', 'true', 'true', 5, 4, 3, 1, 20, '9,20', '9,20', '11,20', '79 Avenue des Gobelins 75013 Paris'),
(10, 'Ternes', 'true', 'true', 'false', 7, 5, 4, 3, 20, '8,21', '9,23', '9,20', '42 Avenue de Wagram 75008 Paris'),
(11, 'Beaubourg', 'true', 'true', 'true', 2, 3, 1, 1, 20, '9,20', '9,20', '11,20', '112-142 Rue Saint-Martin 75004 Paris');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `date_order` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `count` int(11) NOT NULL,
  `time` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Contenu de la table `orders`
--

INSERT INTO `orders` (`id`, `location`, `date_order`, `user_id`, `count`, `time`) VALUES
(18, 'Bastille', 'Sat. Nov. 30 2019, 00:00:00', 7, 2, '13:30'),
(19, 'Bastille', 'Wed. Nov. 20 2019, 00:00:00', 7, 1, '13:30'),
(20, 'Odéon', 'Sat. Nov. 30 2019, 00:00:00', 9, 2, '13:30');

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE IF NOT EXISTS `reservation` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `location` varchar(255) NOT NULL,
  `start` int(11) NOT NULL,
  `end` int(11) NOT NULL,
  `date_res` varchar(255) NOT NULL,
  `number` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28 ;

--
-- Contenu de la table `reservation`
--

INSERT INTO `reservation` (`id`, `location`, `start`, `end`, `date_res`, `number`, `type`, `id_user`) VALUES
(2, 'Republique', 8, 21, 'Wed. Nov. 20 2019, 00:00:00', 2, 'laptop', 7),
(10, 'Odéon', 9, 11, 'Thu. Nov. 21 2019, 00:00:00', 1, 'call_room', 7),
(11, 'Place d''Italie', 13, 14, 'Sat. Nov. 23 2019, 00:00:00', 4, 'call_room', 7),
(12, 'Place d''Italie', 10, 13, 'Fri. Nov. 22 2019, 00:00:00', 3, 'conf_room', 7),
(14, 'Bastille', 11, 14, 'Sun. Dec. 01 2019, 00:00:00', 1, 'conf_room', 9),
(15, 'Odéon', 11, 12, 'Sat. Nov. 30 2019, 00:00:00', 2, 'call_room', 9),
(16, 'Bastille', 9, 10, 'Wed. Dec. 04 2019, 00:00:00', 1, 'laptop', 7),
(17, 'Bastille', 9, 13, 'Wed. Nov. 06 2019, 00:00:00', 1, 'laptop', 7),
(18, 'Bastille', 9, 10, 'Wed. Dec. 04 2019, 00:00:00', 1, 'conf_room', 7),
(19, 'Bastille', 9, 10, 'Wed. Dec. 04 2019, 00:00:00', 1, 'call_room', 7),
(20, 'Bastille', 10, 11, 'Wed. Dec. 04 2019, 00:00:00', 2, 'conf_room', 7),
(21, 'Odéon', 11, 13, 'Sun. Dec. 08 2019, 00:00:00', 3, 'laptop', 7),
(22, 'Odéon', 11, 13, 'Fri. Dec. 06 2019, 00:00:00', 5, 'laptop', 7),
(23, 'Odéon', 12, 13, 'Sun. Dec. 15 2019, 00:00:00', 5, 'laptop', 7),
(24, 'Odéon', 12, 17, 'Fri. Dec. 06 2019, 00:00:00', 3, 'laptop', 7),
(25, 'Odéon', 11, 12, 'Wed. Dec. 18 2019, 00:00:00', 1, 'call_room', 7),
(26, 'Odéon', 10, 12, 'Thu. Dec. 12 2019, 00:00:00', 3, 'conf_room', 7),
(27, 'Bastille', 9, 10, 'Thu. Dec. 05 2019, 00:00:00', 1, 'conf_room', 7);

-- --------------------------------------------------------

--
-- Structure de la table `subscriptions`
--

CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subscription_type` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subscription_date` varchar(255) NOT NULL,
  `subscription_end` varchar(255) NOT NULL,
  `email_sent` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=6 ;

--
-- Contenu de la table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `subscription_type`, `user_id`, `subscription_date`, `subscription_end`, `email_sent`) VALUES
(5, 8, 7, 'Wed. Dec. 04 2019, 03:28:14', 'Fri. Dec. 06 2019, 03:28:14', 'sent');

-- --------------------------------------------------------

--
-- Structure de la table `tech_mat`
--

CREATE TABLE IF NOT EXISTS `tech_mat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `number` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=162 ;

--
-- Contenu de la table `tech_mat`
--

INSERT INTO `tech_mat` (`id`, `type`, `location`, `number`) VALUES
(3, 'printer', 'Bastille', 1),
(4, 'printer', 'Republique', 1),
(5, 'printer', 'Republique', 2),
(6, 'printer', 'Republique', 3),
(7, 'laptop', 'Republique', 1),
(8, 'laptop', 'Republique', 2),
(9, 'laptop', 'Republique', 3),
(10, 'laptop', 'Republique', 4),
(11, 'laptop', 'Republique', 5),
(12, 'laptop', 'Republique', 6),
(13, 'laptop', 'Republique', 7),
(14, 'laptop', 'Republique', 8),
(15, 'laptop', 'Republique', 9),
(16, 'laptop', 'Republique', 10),
(17, 'laptop', 'Republique', 11),
(18, 'laptop', 'Republique', 12),
(19, 'laptop', 'Republique', 13),
(20, 'laptop', 'Republique', 14),
(21, 'laptop', 'Republique', 15),
(22, 'laptop', 'Republique', 16),
(23, 'laptop', 'Republique', 17),
(24, 'laptop', 'Republique', 18),
(25, 'laptop', 'Republique', 19),
(26, 'laptop', 'Republique', 20),
(27, 'laptop', 'Republique', 21),
(28, 'laptop', 'Republique', 22),
(29, 'laptop', 'Republique', 23),
(30, 'laptop', 'Republique', 24),
(31, 'laptop', 'Republique', 25),
(32, 'printer', 'Odéon', 1),
(33, 'printer', 'Odéon', 2),
(34, 'laptop', 'Odéon', 1),
(35, 'laptop', 'Odéon', 2),
(36, 'laptop', 'Odéon', 3),
(37, 'laptop', 'Odéon', 4),
(38, 'laptop', 'Odéon', 5),
(39, 'laptop', 'Odéon', 6),
(40, 'laptop', 'Odéon', 7),
(41, 'laptop', 'Odéon', 8),
(42, 'laptop', 'Odéon', 9),
(43, 'laptop', 'Odéon', 10),
(44, 'laptop', 'Odéon', 11),
(45, 'laptop', 'Odéon', 12),
(46, 'laptop', 'Odéon', 13),
(47, 'laptop', 'Odéon', 14),
(48, 'laptop', 'Odéon', 15),
(49, 'laptop', 'Odéon', 16),
(50, 'laptop', 'Odéon', 17),
(51, 'laptop', 'Odéon', 18),
(72, 'printer', 'Place d''Italie', 1),
(73, 'laptop', 'Place d''Italie', 1),
(74, 'laptop', 'Place d''Italie', 2),
(75, 'laptop', 'Place d''Italie', 3),
(76, 'laptop', 'Place d''Italie', 4),
(77, 'laptop', 'Place d''Italie', 5),
(78, 'laptop', 'Place d''Italie', 6),
(79, 'laptop', 'Place d''Italie', 7),
(80, 'laptop', 'Place d''Italie', 8),
(81, 'laptop', 'Place d''Italie', 9),
(82, 'laptop', 'Place d''Italie', 10),
(83, 'laptop', 'Place d''Italie', 11),
(84, 'laptop', 'Place d''Italie', 12),
(85, 'laptop', 'Place d''Italie', 13),
(86, 'laptop', 'Place d''Italie', 14),
(87, 'laptop', 'Place d''Italie', 15),
(88, 'laptop', 'Place d''Italie', 16),
(89, 'laptop', 'Place d''Italie', 17),
(90, 'laptop', 'Place d''Italie', 18),
(91, 'laptop', 'Place d''Italie', 19),
(92, 'laptop', 'Place d''Italie', 20),
(114, 'printer', 'Ternes', 1),
(115, 'printer', 'Ternes', 2),
(116, 'printer', 'Ternes', 3),
(117, 'laptop', 'Ternes', 1),
(118, 'laptop', 'Ternes', 2),
(119, 'laptop', 'Ternes', 3),
(120, 'laptop', 'Ternes', 4),
(121, 'laptop', 'Ternes', 5),
(122, 'laptop', 'Ternes', 6),
(123, 'laptop', 'Ternes', 7),
(124, 'laptop', 'Ternes', 8),
(125, 'laptop', 'Ternes', 9),
(126, 'laptop', 'Ternes', 10),
(127, 'laptop', 'Ternes', 11),
(128, 'laptop', 'Ternes', 12),
(129, 'laptop', 'Ternes', 13),
(130, 'laptop', 'Ternes', 14),
(131, 'laptop', 'Ternes', 15),
(132, 'laptop', 'Ternes', 16),
(133, 'laptop', 'Ternes', 17),
(134, 'laptop', 'Ternes', 18),
(135, 'laptop', 'Ternes', 19),
(136, 'laptop', 'Ternes', 20),
(137, 'printer', 'Beaubourg', 1),
(138, 'laptop', 'Beaubourg', 1),
(139, 'laptop', 'Beaubourg', 2),
(140, 'laptop', 'Beaubourg', 3),
(141, 'laptop', 'Beaubourg', 4),
(142, 'laptop', 'Beaubourg', 5),
(143, 'laptop', 'Beaubourg', 6),
(144, 'laptop', 'Beaubourg', 7),
(145, 'laptop', 'Beaubourg', 8),
(146, 'laptop', 'Beaubourg', 9),
(147, 'laptop', 'Beaubourg', 10),
(148, 'laptop', 'Beaubourg', 11),
(149, 'laptop', 'Beaubourg', 12),
(150, 'laptop', 'Beaubourg', 13),
(151, 'laptop', 'Beaubourg', 14),
(152, 'laptop', 'Beaubourg', 15),
(153, 'laptop', 'Beaubourg', 16),
(154, 'laptop', 'Beaubourg', 17),
(155, 'laptop', 'Beaubourg', 18),
(156, 'laptop', 'Beaubourg', 19),
(157, 'laptop', 'Beaubourg', 20),
(161, 'laptop', 'Bastille', 1);

-- --------------------------------------------------------

--
-- Structure de la table `ticket`
--

CREATE TABLE IF NOT EXISTS `ticket` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `date_creation` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `id_user` int(11) NOT NULL,
  `user_name` varchar(255) NOT NULL,
  `id_owner` int(11) NOT NULL,
  `owner_name` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `material_id` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `open` varchar(255) NOT NULL,
  `resolved` varchar(255) NOT NULL,
  `late` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Contenu de la table `ticket`
--

INSERT INTO `ticket` (`id`, `name`, `date_creation`, `status`, `id_user`, `user_name`, `id_owner`, `owner_name`, `type`, `material_id`, `description`, `location`, `open`, `resolved`, `late`) VALUES
(18, 'live test', 'Tue. Dec. 10 2019', 'new', 7, 'Mahdaoui Zakarya', 0, 'null', 'Logiciel', 'laptop 1', 'test', 'Bastille', 'true', 'false', 'true'),
(19, 'live test', 'Tue. Dec. 10 2019', 'new', 7, 'Mahdaoui Zakarya', 0, 'null', 'Logiciel', 'laptop 1', 'test', 'Bastille', 'true', 'false', 'false'),
(20, 'azeeee', 'Tue. Dec. 10 2019', 'new', 7, 'Mahdaoui Zakarya', 0, 'null', 'Matériel', 'laptop 4', 'azeaez', 'Place d''Italie', 'true', 'false', 'false');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `last_name` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `birthday` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `client` varchar(255) NOT NULL,
  `date_inscription` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Contenu de la table `users`
--

INSERT INTO `users` (`id`, `last_name`, `first_name`, `email`, `birthday`, `password`, `client`, `date_inscription`) VALUES
(7, 'Zakarya', 'Mahdaoui', 'mh.zakk@gmail.com', '1994/08/16 00:00:00', 'azaza', 'true', 'Fri. Nov. 01 2019'),
(8, 'mahdaoui', 'bassma', 'mh.bassma@gmail.com', '1992/07/09 00:00:00', 'bassma', 'false', 'Thu. Nov. 07 2019'),
(9, 'teste', 'teste', 'teste@gmail.com', '1993/11/01 00:00:00', 'teste', 'true', 'Sat. Nov. 30 2019'),
(14, 'azert', 'azert', 'b.belazouz@gmail.com', '2019/12/04 00:00:00', 'azert', 'false', 'Wed. Dec. 04 2019'),
(15, 'zinedine', 'zidane', 'z.zidane@gmail.com', '1979/12/29 00:00:00', 'zidane', 'false', 'Wed. Dec. 04 2019');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
