import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  SendHorizonal,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  getPost,
  addCommentToPost,
  fetchComments,
  likePost,
  dislikePost,
  fetchLikes,
} from '../lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner'; // ✅ Correct toast import

const PostDetail = () => {
  const { postId } = useParams();
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId!),
    enabled: !!postId,
  });

  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    if (postId) {
      fetchLikes(postId).then(setLikes);
      const unsub = fetchComments(postId, setComments);
      return () => unsub();
    }
  }, [postId]);

  const handleLike = async () => {
    if (!postId) return;
    if (liked) {
      await dislikePost(postId);
      setLiked(false);
      setLikes((prev) => Math.max(prev - 1, 0));
    } else {
      await likePost(postId);
      setLiked(true);
      setLikes((prev) => prev + 1);
    }
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim() || !postId) return;
    await addCommentToPost(postId, comment, 'Anonymous');
    setComment('');
  };

  const formatDate = (date: any) => {
    try {
      const d = date?.toDate ? date.toDate() : new Date(date);
      return formatDistanceToNow(d, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  const handleShare = async () => {
    const postUrl = `${window.location.origin}/post/${postId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title || 'Motivational Post',
          text: 'Check out this inspiring post!',
          url: postUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        toast.success('Link copied to clipboard!');
      } catch {
        toast.error('Failed to copy link');
      }
    }
  };

  if (error || !post) {
    return (
      <div className="min-h-screen bg-cream dark:bg-charcoal">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Post not found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This post could not be loaded or does not exist.
          </p>
          <Link
            to="/allposts"
            className="inline-block bg-sky-blue dark:bg-teal text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            Back to Posts
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-charcoal">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="w-32 h-10 mb-8" />
            <Skeleton className="w-3/4 h-12 mb-4" />
            <Skeleton className="w-full h-64 mb-8" />
            <Skeleton className="w-full h-32" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal transition-colors duration-500">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-4xl mx-auto">
          <Link
            to="/allposts"
            className="inline-flex items-center gap-2 text-sky-blue dark:text-teal hover:underline mb-6"
          >
            <ArrowLeft size={20} />
            Back to Posts
          </Link>

          <article className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden">
            {post.mediaUrl && (
              post.contentType === 'image' ? (
                <img
                  src={post.mediaUrl}
                  alt={post.mediaCaption || 'Post'}
                  className="w-full object-cover max-h-[480px]"
                />
              ) : post.contentType === 'video' ? (
                <video
                  src={post.mediaUrl}
                  controls
                  className="w-full rounded-t-2xl max-h-[480px] object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              ) : null
            )}


            <div className="p-6 md:p-8">
              {/* Author Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-blue dark:bg-teal rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {post.authorName?.slice(0, 2) || 'A'}
                  </div>
                  <div>
                    <h3 className="font-semibold font-devanagari text-lg">
                      {post.authorName || 'Anonymous'}
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <Calendar size={14} className="inline mr-1" />
                      {formatDate(post.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Like/Share */}
                <div className="flex gap-4">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border transition ${liked
                      ? 'bg-red-100 text-red-600 border-red-200 dark:bg-red-900/40 dark:text-red-300'
                      : 'text-gray-600 dark:text-gray-400 border-gray-300 dark:border-zinc-600'
                      } hover:scale-105`}
                  >
                    <Heart className={liked ? 'fill-red-500' : ''} size={18} />
                    {likes}
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-sky-blue dark:hover:text-teal transition"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold font-devanagari text-gray-800 dark:text-white mb-6">
                {post.title}
              </h1>

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none font-devanagari text-lg leading-relaxed">
                {post.content?.split('\n').map((p: string, i: number) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {/* Comments */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4 font-devanagari text-gray-800 dark:text-white">
                  टिप्पणियाँ
                </h3>
                <div className="space-y-4">
                  {comments.map((c) => (
                    <div key={c.id} className="bg-gray-100 dark:bg-zinc-800 p-4 rounded-xl shadow-sm">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        <span className="font-semibold">{c.authorName}</span>: {c.text}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(c.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Comment */}
                <div className="mt-6 flex flex-col md:flex-row items-start gap-4">
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full md:w-3/4 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 p-3 text-gray-800 dark:text-white resize-none"
                    placeholder="अपनी टिप्पणी यहाँ लिखें..."
                  />
                  <button
                    onClick={handleCommentSubmit}
                    disabled={!comment.trim()}
                    className="bg-sky-blue dark:bg-teal hover:opacity-90 text-white px-5 py-2 rounded-lg transition mt-2 md:mt-0 flex items-center gap-2 disabled:opacity-50"
                  >
                    <SendHorizonal size={16} />
                    भेजें
                  </button>
                </div>
              </div>
            </div>
          </article>

          {/* CTA */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold font-devanagari mb-4">अन्य पोस्ट्स देखें</h2>
            <Link
              to="/allposts"
              className="inline-block bg-sky-blue dark:bg-teal text-white px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold"
            >
              Browse All Posts
            </Link>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
};

export default PostDetail;
