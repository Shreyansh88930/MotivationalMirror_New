import React from 'react';
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Heart, Share2, Calendar, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getPost } from '../lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const PostDetail = () => {
  const { postId } = useParams();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPost(postId!),
    enabled: !!postId,
  });

  const formatDate = (date: any) => {
    try {
      const dateObj = date?.toDate ? date.toDate() : new Date(date);
      return formatDistanceToNow(dateObj, { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-cream dark:bg-charcoal">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Post</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The post could not be loaded. Please try again.
          </p>
          <Link href="/posts">
            <a className="bg-sky-blue dark:bg-teal text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Back to Posts
            </a>
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
            <div className="flex items-center gap-4 mb-8">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="w-32 h-4 mb-2" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
            <Skeleton className="w-full h-64 mb-8" />
            <Skeleton className="w-full h-32" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-cream dark:bg-charcoal">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold font-devanagari mb-4">पोस्ट नहीं मिली</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/posts">
            <a className="bg-sky-blue dark:bg-teal text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
              Browse All Posts
            </a>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/posts">
            <a className="inline-flex items-center gap-2 text-sky-blue dark:text-teal hover:underline mb-8">
              <ArrowLeft size={20} />
              Back to Posts
            </a>
          </Link>

          {/* Post Content */}
          <article className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            {/* Media */}
            {post.mediaUrl && (
              <div className="relative">
                <img
                  src={post.mediaUrl}
                  alt={post.mediaCaption || post.title || 'Post media'}
                  className="w-full h-96 object-cover"
                />
                {post.mediaCaption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                    <p className="text-white font-devanagari text-2xl font-bold">
                      {post.mediaCaption}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sky-blue dark:bg-teal rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {post.authorName.split(' ').map(word => word.charAt(0)).join('').substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold font-devanagari text-lg">{post.authorName}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={14} />
                        {post.contentType.charAt(0).toUpperCase() + post.contentType.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-sky-blue dark:hover:text-teal transition-colors">
                    <Heart size={20} />
                    <span>Like</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-sky-blue dark:hover:text-teal transition-colors">
                    <Share2 size={20} />
                    <span>Share</span>
                  </button>
                </div>
              </div>

              {/* Title */}
              {post.title && (
                <h1 className="text-3xl md:text-4xl font-bold font-devanagari text-gray-800 dark:text-white mb-6">
                  {post.title}
                </h1>
              )}

              {/* Content */}
              {post.content && (
                <div className="prose prose-lg max-w-none">
                  <div className="font-devanagari text-xl leading-relaxed text-gray-800 dark:text-gray-200">
                    {post.content.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Video Embed */}
              {post.contentType === 'video' && post.mediaUrl && (
                <div className="mt-6">
                  <video
                    controls
                    className="w-full rounded-lg"
                    poster={post.mediaUrl}
                  >
                    <source src={post.mediaUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </article>

          {/* Related Posts Section */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold font-devanagari mb-6">अधिक पोस्ट्स देखें</h2>
            <Link href="/posts">
              <a className="bg-sky-blue dark:bg-teal text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold">
                Browse All Posts
              </a>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PostDetail;
