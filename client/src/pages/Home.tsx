import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
import PostFilters from '../components/PostFilters';
import { getPosts } from '../lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

const Home = () => {
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
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-blue/20 via-soft-beige/30 to-cream dark:from-teal/20 dark:via-indigo/30 dark:to-charcoal py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold font-devanagari text-gray-800 dark:text-white mb-4">
            अपने दिन को प्रेरणा से भरें
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Daily Hindi thoughts, motivational images, and inspiring videos to uplift your spirit
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <span className="text-yellow-600">💭</span>
              प्रेरणादायक विचार
            </span>
            <span className="bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <span className="text-blue-600">🖼️</span>
              प्रेरणादायक छवियां
            </span>
            <span className="bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full text-sm flex items-center gap-2">
              <span className="text-red-600">🎥</span>
              प्रेरणादायक वीडियो
            </span>
          </div>
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
              {[...Array(6)].map((_, i) => (
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="text-center mt-12">
                <Link href="/posts">
                  <a className="bg-sky-blue dark:bg-teal text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold">
                    View All Posts
                  </a>
                </Link>
              </div>
            </>
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

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sky-blue/10 via-soft-beige/20 to-cream/30 dark:from-teal/10 dark:via-indigo/20 dark:to-charcoal/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-devanagari text-gray-800 dark:text-white mb-4">
            प्रेरणा के साथ जुड़ें
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Daily motivational content delivered with love and positivity
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/posts">
              <a className="bg-sky-blue dark:bg-teal text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold">
                View All Posts
              </a>
            </Link>
            <Link href="/about">
              <a className="border-2 border-sky-blue dark:border-teal text-sky-blue dark:text-teal px-8 py-3 rounded-lg hover:bg-sky-blue dark:hover:bg-teal hover:text-white transition-colors font-semibold">
                About Us
              </a>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
