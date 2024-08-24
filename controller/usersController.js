import User from "../model/usersModel.js";

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
    const { firstName, lastName, email, username } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    let finalUsername;
    if (username !== undefined && username.length > 0) {
      // Check if the provided username already exists
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      finalUsername = username;
    } else {
      // Generate a username if not provided
      finalUsername = await generateUsername(firstName, lastName);
    }

    const userData = new User({
      ...req.body,
      username: finalUsername,
    });

    const savedUser = await userData.save();
    res.status(200).json(savedUser);
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
