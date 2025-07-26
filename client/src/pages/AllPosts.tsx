import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import PostFilters from '../components/PostFilters';
import { getPosts } from '../lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

const AllPosts = () => {
  const [hostFilter, setHostFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', hostFilter, typeFilter],
    queryFn: () => getPosts(hostFilter, typeFilter),
  });

  const availableHosts = posts ? [...new Set(posts.map((post) => post.authorName))] : [];

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">⚠️ Error Loading Posts</h2>
          <p className="text-muted-foreground">
            Please check your Firebase configuration or network connection.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-r from-sky-blue/20 via-soft-beige/30 to-cream dark:from-teal/20 dark:via-indigo/20 dark:to-charcoal py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-devanagari mb-3">
            सभी पोस्ट्स
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Browse our curated motivational content by speakers, topics and format.
          </p>
        </motion.div>
      </section>

      {/* Filters
      <section className="py-8">
        <div className="container mx-auto px-4">
          <PostFilters
            hostFilter={hostFilter}
            setHostFilter={setHostFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            availableHosts={availableHosts}
          />
        </div>
      </section> */}

      {/* Posts Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="bg-card p-5 rounded-xl shadow animate-pulse border border-border"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-24 h-4" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-full h-36 mb-4 rounded-md" />
                  <div className="flex justify-between">
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-20 h-6" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold font-devanagari mb-3">
                कोई पोस्ट नहीं मिली
              </h3>
              <p className="text-muted-foreground mb-6">
                No posts found matching your criteria. Try adjusting your filters.
              </p>
              <button
                onClick={() => {
                  setHostFilter('');
                  setTypeFilter('');
                }}
                className="bg-sky-blue dark:bg-teal text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                Clear Filters
              </button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AllPosts;
