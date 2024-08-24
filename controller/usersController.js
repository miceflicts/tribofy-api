import User from "../model/usersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateUsername = async (firstName, lastName) => {
  const baseUsername =
    `${firstName.toLowerCase()}${lastName.toLowerCase()}`.replace(/\s/g, "");
  let username = baseUsername;
  let counter = 1;

  while (await User.findOne({ username })) {
    username = `${baseUsername}-${Math.floor(Math.random() * 1000)}`;
    counter++;
    if (counter > 10) {
      // If we've tried 10 times, use a longer random number to reduce collision probability
      username = `${baseUsername}-${Math.floor(Math.random() * 1000000)}`;
    }
  }

  return username;
};

export const create = async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    // Verifica se o email já existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    let finalUsername;
    if (username !== undefined && username.length > 0) {
      // Verifica se o username fornecido já existe
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      finalUsername = username;
    } else {
      // Gera um username se não for fornecido
      finalUsername = await generateUsername(firstName, lastName);
    }

    // Encripta a senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userData = new User({
      ...req.body,
      username: finalUsername,
      password: hashedPassword, // Substitui a senha plana pela senha encriptada
    });

    const savedUser = await userData.save();

    // Remove a senha do objeto de resposta por segurança
    const userResponse = savedUser.toObject();
    delete userResponse.password;

    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Gera um token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Prepara o objeto de resposta
    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    res.status(200).json({
      user: userResponse,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetch = async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findOne({ _id: id });

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }
    const updateUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    const userExist = await User.findOne({ _id: id });

    if (!userExist) {
      return res.status(404).json({ message: "User not found" });
    }

    const deleteUser = await User.findByIdAndDelete(id);
    res.status(200).json(deleteUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
