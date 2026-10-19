import { z } from 'zod';
import { postSchema, itemSchema, userSchema, tagSchema } from '../contracts.ts';
import postData from './fixtures/posts.json';
import itemData from './fixtures/items.json';
import userData from './fixtures/users.json';
import tagData from './fixtures/tags.json';

export const posts = z.array(postSchema).parse(postData);
export const initialItems = z.array(itemSchema).parse(itemData);
export const users = z.array(userSchema).parse(userData);
export const tags = z.array(tagSchema).parse(tagData);
