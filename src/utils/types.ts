import { NewUser, User, UserTable } from "../schemas/user";
import { Post, PostTable, NewPost } from "../schemas/post";


export type DBRecord = User | Post
export type NewDBRecord = NewUser | NewPost
export type DBTable = UserTable  | PostTable
