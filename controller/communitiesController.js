import Community from "../model/communitiesModel.js";
import { isValidObjectId } from "mongoose";

export const create = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingCommunity = await Community.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCommunity) {
      if (existingCommunity.name === name && existingCommunity.slug === slug) {
        return res.status(400).json({
          message: "There is already a community with this name and url link",
        });
      } else if (existingCommunity.name === name) {
        return res
          .status(400)
          .json({ message: "There is already a community with this name" });
      } else {
        return res
          .status(400)
          .json({ message: "There is already a community with this url link" });
      }
    }

    const communityData = new Community(req.body);
    const savedCommunity = await communityData.save();

    res.status(201).json(savedCommunity);
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ message: error.message });
  }
};

export const fetch = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "-createdAt", id, slug } = req.query;

    // If id or slug is provided, fetch a specific community
    if (id || slug) {
      let community;
      if (id) {
        if (!isValidObjectId(id)) {
          return res.status(400).json({ message: "Invalid community ID" });
        }
        community = await Community.findById(id);
      } else {
        community = await Community.findOne({ slug });
      }

      if (!community) {
        return res.status(404).json({ message: "Community not found" });
      }

      return res.status(200).json(community);
    }

    // If no id or slug is provided, fetch all communities with pagination
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (
      isNaN(pageNumber) ||
      isNaN(limitNumber) ||
      pageNumber < 1 ||
      limitNumber < 1
    ) {
      return res
        .status(400)
        .json({ message: "Invalid page or limit parameters" });
    }

    const skip = (pageNumber - 1) * limitNumber;

    const totalDocs = await Community.countDocuments();

    const communities = await Community.find()
      .sort(sort)
      .skip(skip)
      .limit(limitNumber);

    const totalPages = Math.ceil(totalDocs / limitNumber);

    const result = {
      communities,
      currentPage: pageNumber,
      totalPages,
      totalDocs,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }

    const updatedCommunity = await Community.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true }
    );

    if (!updatedCommunity) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json(updatedCommunity);
  } catch (error) {
    console.error("Error updating community:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }

    const deletedCommunity = await Community.findOneAndDelete({ _id: id });

    if (!deletedCommunity) {
      return res.status(404).json({ message: "Community not found" });
    }

    res.status(200).json(deletedCommunity);
  } catch (error) {
    console.error("Error deleting community:", error);
    res.status(500).json({ message: error.message });
  }
};

export const checkIfCommunityExists = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || !slug) {
      return res
        .status(400)
        .json({ message: "Missing required fields, name and slug" });
    }

    const existingCommunity = await Community.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCommunity) {
      if (existingCommunity.name === name && existingCommunity.slug === slug) {
        return res.status(400).json({
          message: "There is already a community with this name and url link",
        });
      } else if (existingCommunity.name === name) {
        return res
          .status(400)
          .json({ message: "There is already a community with this name" });
      } else {
        return res
          .status(400)
          .json({ message: "There is already a community with this url link" });
      }
    }

    res.status(200).json({ message: "Community name and slug are available" });
  } catch (error) {
    console.error("Error checking community existence:", error);
    res.status(500).json({ message: error.message });
  }
};
