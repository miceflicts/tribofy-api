import Post from "../../model/postsModel.js";
import User from "../../model/usersModel.js";
import { isValidObjectId } from "mongoose";

export const addReply = async (req, res) => {
  try {
    const { postId, commentId } = req.query;
    const { author, content } = req.body;

    if (
      !isValidObjectId(postId) ||
      !isValidObjectId(commentId) ||
      !isValidObjectId(author)
    ) {
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

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const reply = {
      author: user._id,
      authorUsername: user.username,
      authorFirstName: user.firstName,
      authorLastName: user.lastName,
      content,
      createdAt: new Date(),
      likes: [], // Inicializando o array de likes vazio
    };

    comment.replies.push(reply);
    await post.save();

    // Obtendo a resposta recém-adicionada com seu ID gerado
    const addedReply = comment.replies[comment.replies.length - 1];

    // Criando um objeto de resposta com o ID da resposta
    const responseReply = {
      _id: addedReply._id, // Este é o ID gerado pelo MongoDB
      author: addedReply.author,
      authorUsername: addedReply.authorUsername,
      authorFirstName: addedReply.authorFirstName,
      authorLastName: addedReply.authorLastName,
      content: addedReply.content,
      createdAt: addedReply.createdAt,
      likes: addedReply.likes, // Array vazio de likes
    };

    res.status(201).json({ message: "Reply added", reply: responseReply });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: error.message });
  }
};

export const editReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.query;
    const { content } = req.body;

    if (
      !isValidObjectId(postId) ||
      !isValidObjectId(commentId) ||
      !isValidObjectId(replyId)
    ) {
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

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    reply.content = content;
    reply.isEdited = true;
    await post.save();

    res.status(200).json({ message: "Reply updated", reply });
  } catch (error) {
    console.error("Error editing reply:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const { postId, commentId, replyId } = req.query;

    if (
      !isValidObjectId(postId) ||
      !isValidObjectId(commentId) ||
      !isValidObjectId(replyId)
    ) {
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

    const reply = comment.replies.id(replyId);
    if (!reply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    // Usando pull para remover a reply do array de replies do comentário
    comment.replies.pull(replyId);
    await post.save();

    res.status(200).json({ message: "Reply deleted" });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res.status(500).json({ message: error.message });
  }
};
