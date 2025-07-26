import React from 'react';
import { Quote, Image, Video, Users, Flame, Clock } from 'lucide-react';
import { useFilterStore } from '../store/filterStore';

interface PostFiltersProps {
  availableHosts: string[];
}

const PostFilters: React.FC<PostFiltersProps> = ({ availableHosts }) => {
  const hostFilter = useFilterStore((state) => state.hostFilter);
  const typeFilter = useFilterStore((state) => state.typeFilter);
  const sortBy = useFilterStore((state) => state.sortBy);
  const setHostFilter = useFilterStore((state) => state.setHostFilter);
  const setTypeFilter = useFilterStore((state) => state.setTypeFilter);
  const setSortBy = useFilterStore((state) => state.setSortBy);
  const resetFilters = useFilterStore((state) => state.resetFilters);

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
                aria-label="Filter by Host"
                className="appearance-none bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 pr-8 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-blue dark:focus:ring-teal"
              >
                <option value="">All Hosts</option>
                {availableHosts.map((hostName) => (
                  <option key={hostName} value={hostName}>
                    {hostName}
                  </option>
                ))}
              </select>
              <Users className="absolute right-2 top-3 text-gray-500 pointer-events-none" size={16} />
            </div>

            {/* Type Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { type: '', label: 'All' },
                { type: 'text', label: 'Text', icon: <Quote size={12} /> },
                { type: 'image', label: 'Image', icon: <Image size={12} /> },
                { type: 'video', label: 'Video', icon: <Video size={12} /> },
              ].map(({ type, label, icon }) => (
                <button
                  key={type || 'all'}
                  onClick={() => setTypeFilter(type)}
                  className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1 ${
                    typeFilter === type
                      ? 'bg-sky-blue dark:bg-teal text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {/* Sort Filter */}
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {[
                { value: 'latest', label: 'Latest', icon: <Clock size={12} /> },
                { value: 'popular', label: 'Popular', icon: <Flame size={12} /> },
                { value: 'trending', label: 'Trending', icon: <Flame size={12} /> },
              ].map(({ value, label, icon }) => (
                <button
                  key={value}
                  onClick={() => setSortBy(value as 'latest' | 'popular' | 'trending')}
                  className={`px-3 py-1 rounded-md text-sm transition-colors flex items-center gap-1 ${
                    sortBy === value
                      ? 'bg-sky-blue dark:bg-teal text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="ml-2 px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PostFilters;
