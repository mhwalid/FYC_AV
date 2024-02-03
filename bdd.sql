-- Table: roles
CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Table: share_prices
CREATE TABLE share_prices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  value DECIMAL(10, 2) NOT NULL,
  volume DECIMAL(10, 2) NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

-- Table: users
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  wallet DECIMAL(10, 2) NOT NULL,
  isCdu BOOLEAN NOT NULL,
  cduAcceptedAt DATETIME NOT NULL,
  registerAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  roleId INT,
  FOREIGN KEY (roleId) REFERENCES roles(id)
);

-- Table: transactions
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  volume DECIMAL(10, 2) NOT NULL,
  typeTransaction VARCHAR(255) NOT NULL,
  transactedAt DATETIME NOT NULL,
  userId INT,
  sharePriceId INT,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (sharePriceId) REFERENCES share_prices(id)
);
