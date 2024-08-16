import Community from "../model/communitiesModel.js";

export const create = async (req, res) => {
  try {
    const communityData = new Community(req.body);
    const { name } = communityData;

    const community = await Community.findOne({ name });

    if (community) {
      return res
        .status(400)
        .json({ message: "There is already a community with this name" });
    }
    const savedCommunity = await communityData.save();
    res.status(200).json(savedCommunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const fetch = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const communityExist = await Community.findOne({ _id: id });

    if (!communityExist) {
      return res.status(404).json({ message: "Community not found" });
    }
    const updateCommunity = await Community.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updateCommunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCommunity = async (req, res) => {
  try {
    const id = req.params.id;
    const communityExist = await Community.findOne({ _id: id });

    if (!communityExist) {
      return res.status(404).json({ message: "Community not found" });
    }

    const deleteCommunity = await Community.findByIdAndDelete(id);
    res.status(200).json(deleteCommunity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
