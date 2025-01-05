import { Context } from "hono";
import { addSingleRecord, getRecordByColumn, updateSingleRecord, deleteSingleRecord, getAllRecords, getRecordsByColumn } from '../dbClient/dbClient';
import validate from "../helpers/validationHelper";
import { ResponseHelper } from "../helpers/responseHelper";
import { NotFoundException } from "../exceptions/notFoundException";
import { BadRequestException } from "../exceptions/badRequestException";
import { posts } from "../schemas/post";
import { users } from '../schemas/user';
import { createPostSchema } from "../validations/post";
import { db } from "../lib/db";
import { eq, sql } from "drizzle-orm";
export class UserPostController {
    constructor() {
        // Bind methods to the class instance
        this.getAllUserPosts = this.getAllUserPosts.bind(this);
        this.createPost = this.createPost.bind(this);
        this.editPost = this.editPost.bind(this);
        this.deletePost = this.deletePost.bind(this);
        this.getAllPosts = this.getAllPosts.bind(this);
        this.getAllUsers = this.getAllUsers.bind(this);
    }

    // Get all posts for a user
    public async getAllUserPosts(c: Context) {
      try {
          const userId = parseInt(c.req.param("user_id"));
  
          if (!userId) {
              throw new BadRequestException("User ID is required.");
          }
  
          console.log('Fetching posts for user_id:', userId);
          const userPosts = await getRecordsByColumn(posts, "user_id", userId);
  
          if (!userPosts) {
              return ResponseHelper.sendSuccessResponse(c, 200, "No posts found for the user.", []);
          }
  
          return ResponseHelper.sendSuccessResponse(c, 200, "Posts fetched successfully.", userPosts);
      } catch (error: any) {
          console.error('Error fetching posts:', error.message);
          throw error;
      }
  }

    public async createPost(c: Context) {
      try {
          // Parse user ID and post data
          const userId = parseInt(c.req.param("user_id"));
          const postData = await c.req.json();

          // Check if the user exists
          const user = await db.select().from(users).where(eq(users.id, userId));
          if (!user.length) {
              throw new NotFoundException("User not found.");
          }

          // Validate the post data
          const validatedPostData = await validate(createPostSchema, postData);

          // Prepare new post data
          const newPostData = {
              ...validatedPostData,
              user_id: userId,
          };

          // Use a transaction to ensure atomicity
          const createdPost = await db.transaction(async (tx) => {
              // Insert the post within the transaction
              const insertedPost = await tx
                  .insert(posts)
                  .values(newPostData)
                  .returning();

              // Increment the post count for the user within the same transaction
              await tx
                  .update(users)
                  .set({ post_count: sql`${users.post_count} + 1` })
                  .where(eq(users.id, userId));

              // Return the created post
              return insertedPost[0];
          });

          // Return success response
          return ResponseHelper.sendSuccessResponse(
              c,
              201,
              "Post created successfully.",
              createdPost
          );
      } catch (error: any) {
          // Handle errors gracefully
          throw error;
      }
  }

    public async editPost(c: Context) {
        try {
            const postId = parseInt(c.req.param("post_id"));
            const updatedData = await c.req.json();
            const post = await getRecordByColumn(posts, "id", postId);

            if (!post) {
                throw new NotFoundException("Post not found.");
            }

            const validatedPostData = await validate(createPostSchema, updatedData);

            const updatedPost = await updateSingleRecord(posts, validatedPostData, postId);

            return ResponseHelper.sendSuccessResponse(c, 200, "Post updated successfully.", updatedPost);
        } catch (error: any) {
            throw error;
        }
    }

    // Delete a post of a user
    public async deletePost(c: Context) {
      try {
          // Parse post ID from the request parameters
          const postId = parseInt(c.req.param("post_id"));
  
          // Fetch the post details to ensure it exists
          const post = await db.select().from(posts).where(eq(posts.id, postId));
          if (!post.length) {
              throw new NotFoundException("Post not found.");
          }
  
          const userId = post[0].user_id;
  
          // Use a transaction to ensure atomicity
          await db.transaction(async (tx) => {
              // Delete the post within the transaction
              await tx.delete(posts).where(eq(posts.id, postId));
  
              // Decrement the post count for the user within the same transaction
              await tx
                  .update(users)
                  .set({ post_count: sql`${users.post_count} - 1` })
                  .where(eq(users.id, userId));
          });
  
          // Return success response
          return ResponseHelper.sendSuccessResponse(
              c,
              200,
              "Post deleted successfully."
          );
      } catch (error: any) {
          // Handle errors gracefully
          throw error;
      }
  }
  

    // Get all posts
    public async getAllPosts(c: Context) {
        try {
            const postsList = await getAllRecords(posts);
            return ResponseHelper.sendSuccessResponse(c, 200, "All posts fetched successfully.", postsList);
        } catch (error: any) {
            throw error;
        }
    }

    // Get all users
    public async getAllUsers(c: Context) {
        try {
            const usersList = await getAllRecords(users);
            return ResponseHelper.sendSuccessResponse(c, 200, "Users fetched successfully.", usersList);
        } catch (error: any) {
            throw error;
        }
    }

  

}
