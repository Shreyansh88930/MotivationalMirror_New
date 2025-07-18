import React from 'react';
import { Quote, Image, Video, Users } from 'lucide-react';

interface PostFiltersProps {
  hostFilter: string;
  setHostFilter: (filter: string) => void;
  typeFilter: string;
  setTypeFilter: (filter: string) => void;
  availableHosts: string[];
}

const PostFilters: React.FC<PostFiltersProps> = ({
  hostFilter,
  setHostFilter,
  typeFilter,
  setTypeFilter,
  availableHosts,
}) => {
  return (
    <section className="bg-white dark:bg-gray-900 py-8 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-xl font-semibold font-devanagari">Latest Posts</h3>
          
          <div className="flex flex-wrap items-center gap-4">
            {/* Host Filter */}
            <div className="relative">
              <select
                value={hostFilter}
                onChange={(e) => setHostFilter(e.target.value)}
                className="appearance-none bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-blue dark:focus:ring-teal"
              >
                <option value="">All Hosts</option>
                {availableHosts.map((host) => (
                  <option key={host} value={host}>
                    {host}
                  </option>
                ))}
              </select>
              <Users className="absolute right-2 top-3 text-gray-500 pointer-events-none" size={16} />
            </div>
            
            {/* Content Type Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setTypeFilter('')}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  typeFilter === '' 
                    ? 'bg-sky-blue dark:bg-teal text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter('text')}
                className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1 ${
                  typeFilter === 'text' 
                    ? 'bg-sky-blue dark:bg-teal text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Quote size={12} />
                Text
              </button>
              <button
                onClick={() => setTypeFilter('image')}
                className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1 ${
                  typeFilter === 'image' 
                    ? 'bg-sky-blue dark:bg-teal text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Image size={12} />
                Image
              </button>
              <button
                onClick={() => setTypeFilter('video')}
                className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1 ${
                  typeFilter === 'video' 
                    ? 'bg-sky-blue dark:bg-teal text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Video size={12} />
                Video
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostFilters;
