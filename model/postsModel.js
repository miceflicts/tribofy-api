import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  authorUsername: {
    type: String,
    required: true,
  },
  authorFirstName: {
    type: String,
    required: true,
  },
  authorLastName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  authorUsername: {
    type: String,
    required: true,
  },
  authorFirstName: {
    type: String,
    required: true,
  },
  authorLastName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
  replies: [replySchema],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      minlength: [3, "Post title must be at least 3 characters long"],
      maxlength: [200, "Post title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "communities",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    isEdited: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    comments: [commentSchema],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    views: {
      type: Number,
      default: 0,
    },
    attachments: [
      {
        type: String, // URL ou caminho para o arquivo
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Índices para otimizar consultas frequentes
postSchema.index({ title: "text", content: "text" });
postSchema.index({ community: 1, category: 1, createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

const Post = mongoose.model("posts", postSchema);
export default Post;
