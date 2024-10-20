import Post from "../../model/postsModel.js";
import User from "../../model/usersModel.js";
import { isValidObjectId } from "mongoose";

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
      likes: [], // Inicializando o array de likes vazio
    };

    post.comments.push(comment);
    await post.save();

    // Obtendo o comentário recém-adicionado com seu ID gerado
    const addedComment = post.comments[post.comments.length - 1];

    // Criando um objeto de resposta com o ID do comentário
    const responseComment = {
      _id: addedComment._id, // Este é o ID gerado pelo MongoDB
      author: addedComment.author,
      authorUsername: addedComment.authorUsername,
      authorFirstName: addedComment.authorFirstName,
      authorLastName: addedComment.authorLastName,
      content: addedComment.content,
      createdAt: addedComment.createdAt,
      likes: addedComment.likes, // Array vazio de likes
    };

    res
      .status(201)
      .json({ message: "Comment added", comment: responseComment });
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
    comment.isEdited = true;
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

    // Usando pull para remover o comentário
    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: error.message });
  }
};
