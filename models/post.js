const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  content: { type: String, required: [true, 'Content is required'] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
