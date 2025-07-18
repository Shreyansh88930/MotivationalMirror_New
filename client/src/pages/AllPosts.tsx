import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import PostFilters from '../components/PostFilters';
import { getPosts } from '../lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const AllPosts = () => {
  const [hostFilter, setHostFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', hostFilter, typeFilter],
    queryFn: () => getPosts(hostFilter, typeFilter),
  });

  const availableHosts = posts ? [...new Set(posts.map(post => post.authorName))] : [];

  if (error) {
    return (
      <div className="min-h-screen bg-cream dark:bg-charcoal">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Posts</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please check your Firebase configuration and try again.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal">
      <Navbar />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-sky-blue/20 via-soft-beige/30 to-cream dark:from-teal/20 dark:via-indigo/20 dark:to-charcoal py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-devanagari text-gray-800 dark:text-white mb-4">
            सभी पोस्ट्स
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Browse through our collection of motivational content
          </p>
        </div>
      </section>

      {/* Filters */}
      <PostFilters
        hostFilter={hostFilter}
        setHostFilter={setHostFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        availableHosts={availableHosts}
      />

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="w-24 h-4 mb-2" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-full h-32 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="w-16 h-8" />
                    <Skeleton className="w-16 h-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold font-devanagari mb-4">कोई पोस्ट नहीं मिली</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                No posts found matching your criteria. Try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setHostFilter('');
                  setTypeFilter('');
                }}
                className="bg-sky-blue dark:bg-teal text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllPosts;
