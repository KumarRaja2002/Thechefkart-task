import { Context } from 'hono'; // Hono framework or your chosen framework
import { users } from '../schemas/user'; // Import the users table from the model
import { addSingleRecord } from '../dbClient/dbClient'; // A helper function for adding a single record
import { createUserSchema } from '../validations/user'; // Import the validation schema for users
import { ResponseHelper } from '../helpers/responseHelper'; // Helper to send responses
import { getRecordByColumn } from '../dbClient/dbClient'; // A helper function to get a record by column
import Validate from '../helpers/validationHelper'

export class UserController {
  // Create user endpoint
  public async createUser(c: Context) {
    try {
      const userData = await c.req.json(); // Extract user data from the request body

      // Validate the user data
      const validatedUserData = await Validate(createUserSchema, userData);

      const newUserData = validatedUserData; // Use the validated user data

      // Create the user
      const createdUser = await addSingleRecord(users, newUserData);

      // Send success response
      return ResponseHelper.sendSuccessResponse(c, 201, "User created successfully.", createdUser);
    } catch (error: any) {
      // Handle errors
      console.error("Error creating user:", error.message);
      throw new Error(error.message); // Throw the error to be caught by global error handler
    }
  }
}
