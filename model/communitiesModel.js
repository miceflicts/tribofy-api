import mongoose from "mongoose";

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Community name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Community name must be at least 3 characters long"],
      maxlength: [50, "Community name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      required: [true, "Community description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    rules: [
      {
        title: String,
        description: String,
      },
    ],
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isPrivate: {
      type: Boolean,
      default: false,
    },
    coverImage: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    customization: {
      primaryColor: {
        type: String,
        default: "#3490dc",
      },
      secondaryColor: {
        type: String,
        default: "#38c172",
      },
      backgroundColor: {
        type: String,
        default: "#f8fafc",
      },
    },
    stats: {
      totalMembers: {
        type: Number,
        default: 0,
      },
      totalPosts: {
        type: Number,
        default: 0,
      },
      dailyActiveUsers: {
        type: Number,
        default: 0,
      },
    },
    settings: {
      allowMemberPosts: {
        type: Boolean,
        default: true,
      },
      requirePostApproval: {
        type: Boolean,
        default: false,
      },
      allowComments: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexar campos frequentemente pesquisados
communitySchema.index({ name: "text", description: "text" });
communitySchema.index({ slug: 1 });
communitySchema.index({ categories: 1 });
communitySchema.index({ tags: 1 });

// Virtual para o URL da comunidade
communitySchema.virtual("url").get(function () {
  return `/community/${this.slug}`;
});

const Community = mongoose.model("communities", communitySchema);

export default Community;
