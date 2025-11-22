// models/article.model.js
import mongoose from "mongoose";

const AuthorBioSchema = new mongoose.Schema(
  {
    name: { type: String },
    bio: { type: String },
    avatarUrl: { type: String },
  },
  { _id: false }
);

const ArticleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ['article', 'news'],
      default: 'article',
    },

    summary: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'Article must have at least one paragraph of content.',
      },
    },

    bannerImage: {
      type: String,
    },

    authorName: {
      type: String, // nome que será exibido no artigo
      required: true,
    },

    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    authorBio: AuthorBioSchema,

    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

const Article = mongoose.model('Article', ArticleSchema);

export default Article;