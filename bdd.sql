-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 09, 2023 at 01:03 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `fyc`
--

-- --------------------------------------------------------

--
-- Table structure for table `actions`
--

CREATE TABLE `actions` (
                           `id` int NOT NULL,
                           `nom` varchar(255) NOT NULL,
                           `valeur_actuelle` varchar(255) NOT NULL,
                           `volume_actuel` varchar(255) NOT NULL,
                           `updated_at` datetime DEFAULT NULL,
                           `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `actions`
--

INSERT INTO `actions` (`id`, `nom`, `valeur_actuelle`, `volume_actuel`, `updated_at`, `created_at`) VALUES
                                                                                                        (1, 'Action 1', '100.00', '500', NULL, '2023-10-09 00:00:00'),
                                                                                                        (2, 'Action 2', '50.00', '300', '2023-10-09 00:00:00', '2023-10-09 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
                         `id` int NOT NULL,
                         `libelle` varchar(255) NOT NULL,
                         `updated_at` datetime DEFAULT NULL,
                         `created_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `libelle`, `updated_at`, `created_at`) VALUES
                                                                      (1, 'User', NULL, '2023-10-09 00:00:00'),
                                                                      (2, 'Admin', '2023-10-09 00:00:00', '2023-10-09 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `transactions`
--

CREATE TABLE `transactions` (
                                `id` int NOT NULL,
                                `idUser` int NOT NULL,
                                `idAction` int NOT NULL,
                                `volume_achat` double NOT NULL,
                                `type_transaction` varchar(255) NOT NULL,
                                `transacted_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transactions`
--

INSERT INTO `transactions` (`id`, `idUser`, `idAction`, `volume_achat`, `type_transaction`, `transacted_at`) VALUES
                                                                                                                 (1, 1, 1, 10, 'Buy', '2010-11-17 00:00:00'),
                                                                                                                 (2, 2, 2, 5, 'Sell', '2012-05-13 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
                         `id` int NOT NULL,
                         `firstName` varchar(255) NOT NULL,
                         `lastName` varchar(255) NOT NULL,
                         `email` varchar(255) NOT NULL,
                         `password` varchar(255) NOT NULL,
                         `montantPortefeuille` double NOT NULL,
                         `isCdu` tinyint(1) NOT NULL,
                         `cdu_accepted_at` datetime DEFAULT NULL,
                         `register_at` datetime NOT NULL,
                         `updated_at` datetime DEFAULT NULL,
                         `idRole` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`, `password`, `montantPortefeuille`, `isCdu`, `cdu_accepted_at`, `register_at`, `updated_at`, `idRole`) VALUES
                                                                                                                                                                       (1, 'John', 'Doe', 'john@example.com', 'password1', 1000, 1, '2023-10-09 00:00:00', '2023-01-27 00:00:00', '2023-10-09 00:00:00', 1),
                                                                                                                                                                       (2, 'Jane', 'Smith', 'jane@example.com', 'password2', 2000, 0, NULL, '2015-04-08 00:00:00', '2023-10-09 00:00:00', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `actions`
--
ALTER TABLE `actions`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
    ADD PRIMARY KEY (`id`);

--
-- Indexes for table `transactions`
--
ALTER TABLE `transactions`
    ADD PRIMARY KEY (`id`),
  ADD KEY `idUser` (`idUser`),
  ADD KEY `idAction` (`idAction`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
    ADD PRIMARY KEY (`id`),
  ADD KEY `idRole` (`idRole`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `actions`
--
ALTER TABLE `actions`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `transactions`
--
ALTER TABLE `transactions`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
    MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `transactions`
--
ALTER TABLE `transactions`
    ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`idUser`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`idAction`) REFERENCES `actions` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
    ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`idRole`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
