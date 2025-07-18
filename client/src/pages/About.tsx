import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Heart, Users, Target, Lightbulb } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-cream dark:bg-charcoal">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-sky-blue/20 via-soft-beige/30 to-cream dark:from-teal/20 dark:via-indigo/20 dark:to-charcoal py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-devanagari text-gray-800 dark:text-white mb-6">
            हमारे बारे में
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            प्रेरणा - A platform dedicated to spreading daily motivation and positive energy 
            through Hindi content, inspiring people to achieve their dreams and live their best lives.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold font-devanagari text-gray-800 dark:text-white mb-4">
                हमारा मिशन
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Our mission is to create a positive impact in people's lives through meaningful content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-sky-blue dark:bg-teal rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold font-devanagari text-lg mb-2">प्रेम और करुणा</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Spreading love and compassion through every piece of content we share
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-sky-blue dark:bg-teal rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold font-devanagari text-lg mb-2">समुदाय</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Building a community of dreamers and achievers who support each other
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-sky-blue dark:bg-teal rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold font-devanagari text-lg mb-2">लक्ष्य</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Helping people set and achieve their goals through daily inspiration
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-sky-blue dark:bg-teal rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold font-devanagari text-lg mb-2">प्रेरणा</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Igniting the spark of inspiration in every individual who visits our platform
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-devanagari text-gray-800 dark:text-white mb-6">
                  हमारी कहानी
                </h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    प्रेरणा की शुरुआत एक सरल विचार से हुई - हर दिन लोगों के जीवन में सकारात्मक ऊर्जा लाना। 
                    हमारा मानना है कि छोटे-छोटे प्रेरणादायक संदेश बड़े बदलाव ला सकते हैं।
                  </p>
                  <p>
                    Our platform focuses on providing daily motivation through three key formats:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Hindi Text Posts:</strong> Thoughtful quotes and wisdom in beautiful Devanagari script</li>
                    <li><strong>Motivational Images:</strong> Visually inspiring content with meaningful messages</li>
                    <li><strong>Inspiring Videos:</strong> Short, powerful video content to uplift spirits</li>
                  </ul>
                  <p>
                    We believe that motivation should be accessible to everyone, which is why our content is 
                    free to access and available in Hindi - connecting with people in their native language.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-sky-blue/10 to-teal/10 dark:from-teal/20 dark:to-indigo/20 p-8 rounded-2xl">
                <h3 className="text-2xl font-bold font-devanagari text-gray-800 dark:text-white mb-4">
                  हमारे मूल्य
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sky-blue dark:bg-teal rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold font-devanagari">प्रामाणिकता</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Authentic content that resonates with real-life experiences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sky-blue dark:bg-teal rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold font-devanagari">सरलता</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Simple, clean design that focuses on content over complexity
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sky-blue dark:bg-teal rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold font-devanagari">पहुंच</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Accessible to all age groups and backgrounds
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-sky-blue dark:bg-teal rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold font-devanagari">निरंतरता</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Consistent daily content to maintain momentum
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-sky-blue/10 via-soft-beige/20 to-cream/30 dark:from-teal/10 dark:via-indigo/20 dark:to-charcoal/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-devanagari text-gray-800 dark:text-white mb-4">
            आज ही शुरू करें अपनी प्रेरणा यात्रा
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of people who start their day with positive energy and motivation
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/posts"
              className="bg-sky-blue dark:bg-teal text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-semibold inline-block"
            >
              Browse All Posts
            </a>
            <a
              href="/contact"
              className="border-2 border-sky-blue dark:border-teal text-sky-blue dark:text-teal px-8 py-3 rounded-lg hover:bg-sky-blue dark:hover:bg-teal hover:text-white transition-colors font-semibold inline-block"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
