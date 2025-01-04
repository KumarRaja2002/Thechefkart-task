import { Hono } from 'hono';
import { UserPostController } from '../controllers/userPost';

export const postRoutes = new Hono();
const userPostController = new UserPostController();

// Post-related routes
postRoutes.get('/:user_id/posts', userPostController.getAllUserPosts); // Get all posts for a specific user
postRoutes.post('/:user_id/posts', userPostController.createPost); // Create a new post for a specific user
postRoutes.patch('/:post_id', userPostController.editPost); // Edit a specific post by post_id
postRoutes.delete('/:post_id', userPostController.deletePost); // Delete a specific post by post_id
postRoutes.get('/', userPostController.getAllPosts); // Get all posts
postRoutes.get('/users', userPostController.getAllUsers); // Get all users

export default postRoutes;
  