import React, { useEffect, useState } from 'react';
import {
  Heart,
  MessageCircle,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import {
  likePost,
  fetchLikes,
  addCommentToPost,
  fetchComments,
  dislikePost
} from '@/lib/firebase';
import { Link } from 'react-router-dom';

interface Comment {
  id: string;
  text: string;
  authorName: string;
  createdAt: any;
}

interface Post {
  id: string;
  title: string;
  content: string;
  contentType: 'text' | 'image' | 'video';
  mediaUrl?: string;
  mediaCaption?: string;
  authorName?: string;
  createdAt?: any;
}

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);



  const handleLike = async () => {
    if (liked) {
      await dislikePost(post.id);
      setLiked(false);
      setLikes(prev => Math.max(prev - 1, 0));
    } else {
      await likePost(post.id);
      setLiked(true);
      setLikes(prev => prev + 1);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
    await addCommentToPost(post.id, comment, 'Anonymous');
    setComment('');
  };

  const formatDate = (timestamp: any) => {
    try {
      const date = new Date(timestamp?.seconds * 1000);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  useEffect(() => {
    fetchLikes(post.id).then(setLikes);
    const unsubscribe = fetchComments(post.id, setComments);
    return () => unsubscribe();
  }, [post.id]);

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-lg p-6 md:p-8 mb-10 transition-transform hover:scale-[1.015] border border-gray-200 dark:border-zinc-800">
      {/* Title */}
      <h2 className="text-3xl font-bold font-devanagari text-zinc-800 dark:text-white mb-4 tracking-tight">
        {post.title}
      </h2>

      {/* Content */}
     {post.content && (
  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-5 text-lg">
    {post.content.length > 250
      ? `${post.content.slice(0, 250)}... `
      : post.content}

    {post.content.length > 250 && (
      <Link to={`/posts/${post.id}`}>
        <button className="ml-2 text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
          और पढ़ें →
        </button>
      </Link>
    )}
  </p>
)}
      {/* Image or Video */}
      {post.contentType === 'image' && post.mediaUrl && (
        <div className="group relative mb-6 overflow-hidden rounded-xl shadow-lg">
          <img
            src={post.mediaUrl}
            alt={post.mediaCaption || 'Post Image'}
            className="w-full h-72 object-cover transform group-hover:scale-105 transition duration-300 ease-in-out"
          />
          {post.mediaCaption && (
            <p className="absolute bottom-2 left-4 text-sm text-white bg-black/60 px-2 py-1 rounded">
              {post.mediaCaption}
            </p>
          )}
        </div>
      )}

      {post.contentType === 'video' && post.mediaUrl && (
        <div className="mb-6 rounded-xl overflow-hidden shadow-lg">
          <video controls className="w-full h-72 rounded-md">
            <source src={post.mediaUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {post.mediaCaption && (
            <p className="mt-2 px-4 py-2 text-base italic rounded-md border bg-muted text-muted-foreground dark:text-gray-300 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-200 shadow-sm">
              {post.mediaCaption}
            </p>
          )}
        </div>
      )}

      {/* Meta Info */}
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-gray-200 dark:border-zinc-700 text-sm text-gray-600 dark:text-gray-400 font-medium">
        <p>🖊️ लेखक: <span className="font-semibold">{post.authorName || 'Unknown'}</span></p>
        <p>📅 {formatDate(post.createdAt)}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-6 flex-wrap">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border ${liked
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
              : 'border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300'
            } hover:scale-105 transition`}
        >
          <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : 'stroke-current'}`} />
          {likes}
        </button>

        <button
          onClick={() => setCommentVisible(!commentVisible)}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-zinc-600 text-gray-700 dark:text-gray-300 hover:scale-105 transition"
        >
          <MessageCircle className="w-5 h-5" />
          टिप्पणी
          {commentVisible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Comments Section */}
      {commentVisible && (
        <div className="mt-5 space-y-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg bg-gray-50 dark:bg-zinc-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="अपनी टिप्पणी लिखें..."
          />
          <button
            onClick={handleCommentSubmit}
            disabled={!comment.trim()}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            टिप्पणी भेजें
          </button>

          <div className="divide-y divide-gray-200 dark:divide-zinc-700 mt-4">
            {comments.map((c) => (
              <div key={c.id} className="pt-3">
                <p className="text-gray-800 dark:text-gray-100 text-sm">
                  <span className="font-semibold">{c.authorName}</span>: {c.text}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">{formatDate(c.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
