const fs = require('fs-extra');
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const usersFile = path.join(__dirname, '../data/users.json');

const getUsers = async () => {
  try {
    return await fs.readJson(usersFile);
  } catch (error) {
    return [];
  }
};

const saveUsers = async (users) => {
  await fs.writeJson(usersFile, users, { spaces: 2 });
};

const createUser = async (userData) => {
  const users = await getUsers();
  
  // Check if user already exists
  const existingUser = users.find(u => 
    u.username === userData.username || u.email === userData.email
  );
  
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  const newUser = {
    id: uuidv4(),
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username)}&background=random`,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await saveUsers(users);

  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

const findUserByUsername = async (username) => {
  const users = await getUsers();
  return users.find(u => u.username === username);
};

const findUserById = async (id) => {
  const users = await getUsers();
  const user = users.find(u => u.id === id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  return null;
};

const validatePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  getUsers,
  createUser,
  findUserByUsername,
  findUserById,
  validatePassword,
};