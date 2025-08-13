const mongoose = require('mongoose');
 
const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    content: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: {
      type: String,
      required: true,
      enum: ["Article", "Tutorial", "Interview Questions"],
    },
    author: { type: String, required: true },
    image: { type: String },
    imagePublicId: { type: String },
    status: {
      type: String,
      enum: ["Trending", "Featured", "Editor's Pick", "Recommended", "None"],
      default: "None",
    },
  },
  { timestamps: true }
);
 
// Use existing model if it exists to prevent overwrite errors in hot reload environments
const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);
 
module.exports = Blog;
 
 