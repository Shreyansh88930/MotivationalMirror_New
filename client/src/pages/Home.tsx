import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';
// import PostFilters from '../components/PostFilters';
import { getPosts } from '../lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useFilterStore } from '../store/filterStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getQuoteOfTheDay } from "../lib/utils";

const Home = () => {
  const { hostFilter, typeFilter, sortBy, resetFilters } = useFilterStore();
  const filters = { hostFilter, typeFilter, sortBy };

  const { data: posts, isLoading, error } = useQuery({
    queryKey: ['posts', filters],
    queryFn: () => getPosts(filters),
  });

  // const availableHosts = posts ? [...new Set(posts.map(post => post.authorName))] : [];

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

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-blue/20 via-soft-beige/30 to-cream dark:from-teal/20 dark:via-indigo/30 dark:to-charcoal py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-devanagari text-gray-800 dark:text-white mb-5">
            अपने दिन को प्रेरणा से भरें
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            हर सुबह एक नई सोच, हर शब्द एक नई दिशा। नववितान के साथ पाएं हिंदी में जीवन को छूने वाले विचार, भावनाओं को रंगने वाली छवियां, और आत्मा को झकझोर देने वाले प्रेरक वीडियो।
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <span className="badge bg-white/80 dark:bg-gray-800/80">
              <span className="text-yellow-600">💭</span> प्रेरणादायक विचार
            </span>
            <span className="badge bg-white/80 dark:bg-gray-800/80">
              <span className="text-blue-600">🖼️</span> भावनाओं से जुड़ी छवियां
            </span>
            <span className="badge bg-white/80 dark:bg-gray-800/80">
              <span className="text-red-600">🎥</span> प्रेरक वीडियो
            </span>
          </div>
        </motion.div>
      </section>

      {/* Filters
      <section className="py-10">
        <div className="container mx-auto px-4">
          <PostFilters availableHosts={availableHosts} />
        </div>
      </section> */}
      {/* Quote of the Day */}
      {/* Quote of the Day */}
      <div className="mt-6 bg-white/80 dark:bg-gray-900/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md max-w-2xl mx-auto transition-all duration-500 hover:shadow-lg">
        <div className="flex items-center justify-center mb-3">
          <svg
            className="w-6 h-6 text-yellow-500 dark:text-yellow-400 mr-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-md font-semibold text-gray-800 dark:text-gray-100">
            Quote of the Day
          </h3>
        </div>
        <p className="text-lg italic text-center text-gray-700 dark:text-gray-200 leading-relaxed">
          “{getQuoteOfTheDay()}”
        </p>
      </div>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-card p-5 rounded-xl shadow border animate-pulse">
                  <div className="flex items-center space-x-3 mb-4">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="w-24 h-4 mb-2" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-full h-32 mb-4 rounded-md" />
                  <div className="flex justify-between">
                    <Skeleton className="w-16 h-8" />
                    <Skeleton className="w-16 h-8" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts && posts.length > 0 ? (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </motion.div>

              {/* Load More */}
              <div className="text-center mt-14">
                <Link to="/allposts">
                  <button className="bg-sky-blue dark:bg-teal text-white px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold">
                    View All Posts
                  </button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold font-devanagari mb-3">कोई पोस्ट नहीं मिली</h3>
              <p className="text-muted-foreground mb-6">
                No posts found matching your criteria. Try adjusting your filters.
              </p>
              <button
                onClick={resetFilters}
                className="bg-sky-blue dark:bg-teal text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-sky-blue/10 via-soft-beige/20 to-cream/30 dark:from-teal/10 dark:via-indigo/20 dark:to-charcoal/30 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-devanagari mb-4">
            प्रेरणा के साथ जुड़ें
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Daily motivational content delivered with love and positivity
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/allposts">
              <button className="bg-sky-blue dark:bg-teal text-white px-8 py-3 rounded-lg hover:opacity-90 transition font-semibold">
                View All Posts
              </button>
            </Link>
            <Link to="/about">
              <button className="border-2 border-sky-blue dark:border-teal text-sky-blue dark:text-teal px-8 py-3 rounded-lg hover:bg-sky-blue dark:hover:bg-teal hover:text-white transition font-semibold">
                About Us
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
