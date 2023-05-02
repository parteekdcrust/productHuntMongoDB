const mongoose = require("mongoose");
const Tag = require("../model/tag");

const addTag = async (tag) => {
  try {
    const result = await tag.save();
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const deleteTag = async (id) => {
  try {
    const tag = Tag.findById(id);
    if (!tag) throw new Error("Tag doesn't exists");

    const result = Tag.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const getTagFromDB = () => {
  try {
    const tag = Tag.find();
    if (!tag) throw new Error("Tags not found in the db");

    return tag;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const getTagByIdFromDB = (id) => {
  try {
    const tag = Tag.findById(id);
    if (!tag) throw new Error("Tag not found in db");

    return tag;
  } catch (error) {
    console.log(error.message);
    return;
  }
};

module.exports = { addTag, deleteTag, getTagFromDB, getTagByIdFromDB };
