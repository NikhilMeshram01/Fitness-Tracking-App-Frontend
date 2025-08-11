import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Clock, 
  User, 
  ArrowRight,
  Heart,
  Utensils,
  Coffee,
  BookOpen,
} from 'lucide-react';
import { blogPosts } from '../data/mockData';
import { BlogPost } from '../types';

const categoryIcons = {
  fitness: Heart,
  nutrition: Utensils,
  lifestyle: Coffee,
};

const categoryColors = {
  fitness: 'bg-red-100 text-red-600',
  nutrition: 'bg-green-100 text-green-600',
  lifestyle: 'bg-blue-100 text-blue-600',
};

const BlogCard: React.FC<{ post: BlogPost; index: number }> = ({ post, index }) => {
  const Icon = categoryIcons[post.category];
  const colorClass = categoryColors[post.category];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${colorClass} text-sm font-medium`}>
            <Icon className="h-4 w-4" />
            <span className="capitalize">{post.category}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h2>
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              {post.author}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {post.readTime} min read
            </div>
          </div>
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
        </div>

        <Link
          to={`/blog/${post.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
        >
          Read more
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.article>
  );
};

const FeaturedPost: React.FC<{ post: BlogPost }> = ({ post }) => {
  const Icon = categoryIcons[post.category];
  const colorClass = categoryColors[post.category];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="relative bg-white rounded-2xl shadow-2xl overflow-hidden mb-12"
    >
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="mb-4">
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${colorClass} text-sm font-medium mb-4`}>
              <Icon className="h-4 w-4" />
              <span className="capitalize">{post.category}</span>
            </div>
            <span className="text-sm text-gray-500">Featured Article</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {post.readTime} min read
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>

          <Link
            to={`/blog/${post.id}`}
            className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 group"
          >
            Read Full Article
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export const BlogPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'readTime'>('latest');

  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  const filteredPosts = otherPosts
    .filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'latest':
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'readTime':
          return a.readTime - b.readTime;
        default:
          return 0;
      }
    });

  const categories = ['all', 'fitness', 'nutrition', 'lifestyle'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Fitness Blog & Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover expert tips, nutrition advice, and lifestyle insights to fuel your fitness journey
          </p>
        </motion.div>
      </div>

      {/* Featured Article */}
      <FeaturedPost post={featuredPost} />

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-12"
      >
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'latest' | 'popular' | 'readTime')}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="latest">Latest First</option>
              <option value="readTime">Quick Reads</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Category Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Fitness Articles</p>
              <p className="text-3xl font-bold">
                {blogPosts.filter(p => p.category === 'fitness').length}
              </p>
            </div>
            <Heart className="h-8 w-8 text-red-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Nutrition Guides</p>
              <p className="text-3xl font-bold">
                {blogPosts.filter(p => p.category === 'nutrition').length}
              </p>
            </div>
            <Utensils className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Lifestyle Tips</p>
              <p className="text-3xl font-bold">
                {blogPosts.filter(p => p.category === 'lifestyle').length}
              </p>
            </div>
            <Coffee className="h-8 w-8 text-blue-200" />
          </div>
        </div>
      </motion.div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <BlogCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
          <p className="text-gray-500">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}

      {/* Newsletter Signup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 md:p-12 text-center text-white mt-16"
      >
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
          Get the latest fitness tips, nutrition advice, and wellness insights delivered straight to your inbox
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105">
            Subscribe
          </button>
        </div>
      </motion.div>
    </div>
  );
};