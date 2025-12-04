import { Request, Response, NextFunction } from "express";
import {
  getPostsService,
  getPostByIdService,
  createPostService,
  updatePostService,
  deletePostService,
  togglePublishService,
  incrementViewCountService,
  getPostsByAuthorService
} from "./post.service.js";

export async function getPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, page = 1, limit = 10, status } = req.query;
    const user = req.user as { userId: number } | undefined;

    // Base filter for visibility
    let visibilityFilter: any = { published: true };
    if (user) {
      visibilityFilter = {
        OR: [
          { published: true },
          { authorId: user.userId }
        ]
      };
    }

    // Status filter
    let statusFilter: any = {};
    if (status === 'published') {
      statusFilter = { published: true };
    } else if (status === 'draft') {
      // Only allow filtering by draft if logged in (though visibilityFilter handles security, this is explicit)
      statusFilter = { published: false };
    }

    // Search filter
    let searchFilter: any = {};
    if (search) {
      searchFilter = {
        OR: [
          { title: { contains: String(search), mode: 'insensitive' } },
          { content: { contains: String(search), mode: 'insensitive' } }
        ]
      };
    }

    // Combine filters
    const filters = {
      AND: [
        visibilityFilter,
        searchFilter,
        statusFilter
      ]
    };

    const result = await getPostsService(filters, Number(page), Number(limit));
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}

export async function getPost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const user = req.user as { userId: number } | undefined;

    const post = await getPostByIdService(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // If post is not published, only author can view it
    if (!post.published) {
      if (!user || user.userId !== post.authorId) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    // Increment view count when viewing a post
    await incrementViewCountService(id);

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
}

export async function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, content, authorId } = req.body;
    const newPost = await createPostService(title, content, Number(authorId));
    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    next(err);
  }
}

export async function updatePost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const { title, content } = req.body;
    const updatedPost = await updatePostService(id, title, content);
    res.json({ success: true, data: updatedPost });
  } catch (err) {
    next(err);
  }
}

export async function removePost(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await deletePostService(id);
    res.json({ success: true, message: "Post deleted" });
  } catch (err) {
    next(err);
  }
}

export async function togglePublish(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const updatedPost = await togglePublishService(id);
    if (!updatedPost) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }
    res.json({ success: true, data: updatedPost });
  } catch (err) {
    next(err);
  }
}

export async function getPostsByAuthor(req: Request, res: Response, next: NextFunction) {
  try {
    const authorId = Number(req.params.authorId);
    const { page = 1, limit = 10 } = req.query;
    const user = req.user as { userId: number } | undefined;

    // Visibility filter: show published posts, or if viewing own profile, show drafts too
    let filters: any = { published: true };
    if (user && user.userId === authorId) {
      // User viewing their own profile - show all posts
      filters = {};
    }

    const result = await getPostsByAuthorService(authorId, filters, Number(page), Number(limit));
    res.json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
}
