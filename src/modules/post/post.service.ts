import {
  findAllPosts,
  findPostById,
  createPost,
  updatePost,
  deletePost,
  togglePublishPost,
  incrementViewCount,
  countPosts,
  findPostsByAuthor
} from "./post.model.js";

export async function getPostsService(filters?: any, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    findAllPosts(filters, skip, limit),
    countPosts(filters)
  ]);

  return {
    data: posts,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getPostsByAuthorService(authorId: number, filters?: any, page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    findPostsByAuthor(authorId, filters, skip, limit),
    countPosts({ ...filters, authorId })
  ]);

  return {
    data: posts,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export function getPostByIdService(id: number) {
  return findPostById(id);
}

export function createPostService(title: string, content: string | null, authorId: number) {
  return createPost(title, content, authorId);
}

export function updatePostService(id: number, title: string, content: string | null) {
  return updatePost(id, title, content);
}

export function deletePostService(id: number) {
  return deletePost(id);
}

export function togglePublishService(id: number) {
  return togglePublishPost(id);
}

export function incrementViewCountService(id: number) {
  return incrementViewCount(id);
}
