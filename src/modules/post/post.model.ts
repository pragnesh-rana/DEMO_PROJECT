import { prisma } from "../../lib/prisma.js";

// Get all posts
// Get all posts
export async function findAllPosts(where?: any, skip?: number, take?: number) {
  return prisma.post.findMany({
    where,
    include: { author: true },
    orderBy: { createdAt: 'desc' },
    ...(skip !== undefined && { skip }),
    ...(take !== undefined && { take })
  });
}

// Count posts
export async function countPosts(where?: any) {
  return prisma.post.count({ where });
}

// Get post by ID
export async function findPostById(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: { author: true }
  });
}

// Create new post
export async function createPost(title: string, content: string | null, authorId: number) {
  return prisma.post.create({
    data: { title, content, authorId }
  });
}

// Update post
export async function updatePost(id: number, title: string, content: string | null) {
  return prisma.post.update({
    where: { id },
    data: { title, content }
  });
}

// Delete post
export async function deletePost(id: number) {
  return prisma.post.delete({
    where: { id }
  });
}

// Toggle publish status
export async function togglePublishPost(id: number) {
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return null;

  return prisma.post.update({
    where: { id },
    data: { published: !post.published }
  });
}

// Increment view count
export async function incrementViewCount(id: number) {
  return prisma.post.update({
    where: { id },
    data: { viewCount: { increment: 1 } }
  });
}
