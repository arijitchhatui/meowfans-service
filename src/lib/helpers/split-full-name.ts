import { REMOVE_SPACE_REGEX } from '../../services/auth';
import { AssetsEntity } from '../../services/postgres/entities';
import { GetPostsOutput } from '../../services/posts';
import { PostTypes } from '../../services/service.constants';

export const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
  const nameParts = fullName.trim().split(REMOVE_SPACE_REGEX);
  const hasLastName = nameParts.length > 1;

  const firstName = hasLastName ? nameParts.slice(0, -1).join(' ') : fullName.trim();
  const lastName = (hasLastName ? nameParts[nameParts.length - 1] : null) || '';

  return { firstName, lastName };
};

type GetPostsOutputType = {
  id: string;
  caption: string;
  creatorId: string;
  unlockPrice: number | null;
  likeCount: number;
  saveCount: number;
  shareCount: number;
  commentCount: number;
  totalEarning: number;
  types: PostTypes[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  lastCommentId: string;
  assets: AssetsEntity;
};

export const getPosts = () => {
  const rawPosts: GetPostsOutputType[] = [];

  const postsMap: Record<string, GetPostsOutput> = {};
  for (const rawPost of rawPosts) {
    postsMap[rawPost.id] ??= { ...rawPost, assets: [] };
    postsMap[rawPost.id].assets.push(rawPost.assets);
  }
  return Object.values(postsMap);
};
