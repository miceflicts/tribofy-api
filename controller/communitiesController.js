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
