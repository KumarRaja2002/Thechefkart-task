import { Hono } from 'hono';
import { UserController } from '../controllers/user'; // Import the user controller

export const userRoutes = new Hono();
const userController = new UserController();

// User-related routes
userRoutes.post('/', userController.createUser); // Create a new user

export default userRoutes;
