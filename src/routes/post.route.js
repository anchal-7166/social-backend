const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  addComment,
  deleteComment
} = require('../controllers/post.controller.js');

const upload = require('../middleware/upload.js');
const { protect } = require('../middleware/auth.middleware.js');

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', protect, upload.single('image'), createPost);
router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);

module.exports = router;