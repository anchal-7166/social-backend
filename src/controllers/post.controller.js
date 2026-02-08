const Post = require("../models/post.model.js");
const ErrorHandler = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler.js");


// @route   POST /api/posts
const createPost = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : '';

  // Validate that at least text or image is provided
  if (!text && !image) {
    return next(new ErrorHandler('Post must contain either text or image', 400));
  }

  const post = await Post.create({
    user: req.user._id,
    username: req.user.username,
    text: text || '',
    image: image
  });

  // Populate user details
  await post.populate('user', 'username email');

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: post
  });
});

// @desc    Get all posts (feed)
// @route   GET /api/posts
const getAllPosts = asyncHandler(async (req, res, next) => {
  const posts = await Post.find()
    .populate('user', 'username email')
    .populate('comments.user', 'username')
    .sort({ createdAt: -1 }); // Most recent first

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
const getPostById = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate('user', 'username email')
    .populate('comments.user', 'username');

  if (!post) {
    return next(new ErrorHandler('Post not found', 404));
  }

  res.status(200).json({
    success: true,
    data: post
  });
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler('Post not found', 404));
  }

  // Check if user is the post owner
  if (post.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler('Not authorized to delete this post', 403));
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Post deleted successfully'
  });
});

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
const likePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler('Post not found', 404));
  }

  // Check if post is already liked by user
  const likeIndex = post.likes.findIndex(
    like => like.user.toString() === req.user._id.toString()
  );

  if (likeIndex > -1) {
    // Unlike: Remove like
    post.likes.splice(likeIndex, 1);
    await post.save();

    return res.status(200).json({
      success: true,
      message: 'Post unliked',
      data: post
    });
  } else {
    // Like: Add like
    post.likes.push({
      user: req.user._id,
      username: req.user.username
    });
    await post.save();

    return res.status(200).json({
      success: true,
      message: 'Post liked',
      data: post
    });
  }
});

// @desc    Add comment to a post
// @route   POST /api/posts/:id/comment
const addComment = asyncHandler(async (req, res, next) => {
  const { text } = req.body;

  if (!text) {
    return next(new ErrorHandler('Comment text is required', 400));
  }
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ErrorHandler('Post not found', 404));
  }

  const comment = {
    user: req.user._id,
    username: req.user.username,
    text: text
  };

  post.comments.push(comment);
  await post.save();

  // Populate the post to return full data
  await post.populate('user', 'username email');
  await post.populate('comments.user', 'username');

  res.status(201).json({
    success: true,
    message: 'Comment added successfully',
    data: post
  });
});

// @desc    Delete a comment
// @route   DELETE /api/posts/:id/comment/:commentId
const deleteComment = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ErrorHandler('Post not found', 404));
  }

  const comment = post.comments.id(req.params.commentId);

  if (!comment) {
    return next(new ErrorHandler('Comment not found', 404));
  }

  // Check if user is the comment owner
  if (comment.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler('Not authorized to delete this comment', 403));
  }

  comment.deleteOne();
  await post.save();

  res.status(200).json({
    success: true,
    message: 'Comment deleted successfully',
    data: post
  });
});

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
  addComment,
  deleteComment
};