import React from 'react';
import { Link } from 'wouter';
import { Heart, Share2, Quote, Image as ImageIcon, Video, Play } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Post {
  id: string;
  title?: string;
  content?: string;
  contentType: string;
  mediaUrl?: string;
  mediaCaption?: string;
  authorName: string;
  createdAt: any;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Quote size={12} />;
      case 'image':
        return <ImageIcon size={12} />;
      case 'video':
        return <Video size={12} />;
      default:
        return <Quote size={12} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text':
        return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
      case 'image':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
      case 'video':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200';
    }
  };

  const formatDate = (date: any) => {
    try {
      const dateObj = date?.toDate ? date.toDate() : new Date(date);
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  return (
    <article className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Media Section */}
      {post.mediaUrl && (
        <div className="relative">
          <img
            src={post.mediaUrl}
            alt={post.mediaCaption || post.title || 'Post media'}
            className="w-full h-48 object-cover"
          />
          {post.contentType === 'video' && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors">
                <Play className="ml-1" size={24} />
              </button>
            </div>
          )}
          {post.mediaCaption && (
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-devanagari text-xl font-bold">{post.mediaCaption}</p>
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-sky-blue dark:bg-teal rounded-full flex items-center justify-center text-white font-bold">
              {getAuthorInitials(post.authorName)}
            </div>
            <div>
              <h4 className="font-semibold font-devanagari">{post.authorName}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getTypeColor(post.contentType)}`}>
            {getTypeIcon(post.contentType)}
            {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)}
          </span>
        </div>

        {/* Content */}
        <div className="mb-4">
          {post.title && (
            <h3 className="font-bold text-lg mb-2 font-devanagari">{post.title}</h3>
          )}
          {post.content && (
            <div className="font-devanagari text-lg leading-relaxed text-gray-800 dark:text-gray-200">
              {post.content.split('\n').map((line, index) => (
                <p key={index} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
          <button className="flex items-center space-x-2 hover:text-sky-blue dark:hover:text-teal transition-colors">
            <Heart size={16} />
            <span>Like</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-sky-blue dark:hover:text-teal transition-colors">
            <Share2 size={16} />
            <span>Share</span>
          </button>
          <Link href={`/posts/${post.id}`}>
            <a className="text-sky-blue dark:text-teal hover:underline">
              Read More
            </a>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
