import Post from "../model/postsModel.js";
import User from "../model/usersModel.js";
import { isValidObjectId } from "mongoose";

export const create = async (req, res) => {
  try {
    const { title, content, author, community, category } = req.body;

    if (!title || !content || !author || !community || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (
      !isValidObjectId(author) ||
      !isValidObjectId(community) ||
      !isValidObjectId(category)
    ) {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    const postData = new Post(req.body);
    const savedPost = await postData.save();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: error.message });
  }
};

export const fetch = async (req, res) => {
  try {
    const { community, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    // Converte page e limit para números
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    // Valida os parâmetros
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

    const query = community ? { community } : {};

    if (community && !isValidObjectId(community)) {
      return res.status(400).json({ message: "Invalid community ID" });
    }

    // Calcula o número de documentos para pular
    const skip = (pageNumber - 1) * limitNumber;

    // Conta o total de documentos
    const totalDocs = await Post.countDocuments(query);

    // Busca os posts
    const posts = await Post.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNumber)
      .populate("author", "username firstName lastName") // Ajuste aqui para incluir os campos desejados
      .populate("category", "name");

    // Calcula o total de páginas
    const totalPages = Math.ceil(totalDocs / limitNumber);

    // Prepara a resposta
    const result = {
      posts,
      currentPage: pageNumber,
      totalPages,
      totalDocs,
      hasNextPage: pageNumber < totalPages,
      hasPrevPage: pageNumber > 1,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const postExist = await Post.findOne({ _id: id });

    if (!postExist) {
      return res.status(404).json({ message: "Post not found" });
    }
    const updatePost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatePost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const postExist = await Post.findOne({ _id: id });

    if (!postExist) {
      return res.status(404).json({ message: "Post not found" });
    }

    const deletePost = await Post.findByIdAndDelete(id);
    res.status(200).json(deletePost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const incrementViews = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid post ID" });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ views: post.views });
  } catch (error) {
    console.error("Error incrementing views:", error);
    res.status(500).json({ message: error.message });
  }
};

// Coments
export const addComment = async (req, res) => {
  try {
    const { postId } = req.query;
    const { author, content } = req.body;

    if (!isValidObjectId(postId) || !isValidObjectId(author)) {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    const [post, user] = await Promise.all([
      Post.findById(postId),
      User.findById(author),
    ]);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const comment = {
      author: user._id,
      authorUsername: user.username,
      authorFirstName: user.firstName,
      authorLastName: user.lastName,
      content,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  try {
    const { postId, commentId } = req.query;
    const { content } = req.body;

    if (!isValidObjectId(postId) || !isValidObjectId(commentId)) {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.content = content;
    await post.save();

    res.status(200).json({ message: "Comment updated", comment });
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.query;

    if (!isValidObjectId(postId) || !isValidObjectId(commentId)) {
      return res.status(400).json({ message: "Invalid ID provided" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.remove();
    await post.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: error.message });
  }
};
