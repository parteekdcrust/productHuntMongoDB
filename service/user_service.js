const mongoose = require("mongoose");
const User = require("../model/user");

const addUser = async (user) => {
  try {
    const result = await user.save();
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const deleteUser = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error("user does not exists");

    const result = User.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const getUserFromDB = async () => {
  try {
    const user = await User.find();
    if (!user) throw new Error("Users not found in the db");

    return user;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const getUserByIdFromDB = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) throw new Error(`User not found in db`);

    return user;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const modifyUser = async (id, inputBody) => {
  try {
    const userInDB = await User.findById(id);
    if (!userInDB) throw new Error("User doesnot exists");

    if (inputBody.user != id)
      throw new Error("User not authorized to modify the user details");

    const result = await User.updateOne({ _id: id }, inputBody.userBody);
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};
module.exports = {
  addUser,
  deleteUser,
  getUserFromDB,
  getUserByIdFromDB,
  modifyUser,
};
