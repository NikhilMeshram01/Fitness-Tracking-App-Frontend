import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  Calendar,
  Heart,
  Utensils,
  Coffee,
  Share,
  BookmarkPlus,
  Eye,
} from 'lucide-react';
import { blogPosts } from '../data/mockData';

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

export const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post not found</h1>
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </div>
    );
  }

  const Icon = categoryIcons[post.category];
  const colorClass = categoryColors[post.category];
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          to="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Link>
      </motion.div>

      {/* Article Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="mb-6">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${colorClass} text-sm font-medium mb-4`}>
            <Icon className="h-4 w-4" />
            <span className="capitalize">{post.category}</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center space-x-6 text-gray-600">
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">{post.author}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{post.readTime} min read</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              <BookmarkPlus className="h-4 w-4" />
              <span>Save</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors">
              <Share className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg mb-8"
        />
      </motion.header>

      {/* Article Content */}
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="prose prose-lg max-w-none mb-12"
      >
        <div className="bg-blue-50 p-6 rounded-2xl mb-8">
          <p className="text-lg font-medium text-gray-800 italic">
            {post.excerpt}
          </p>
        </div>

        <div className="text-gray-700 leading-relaxed space-y-6">
          {/* Mock article content */}
          <p>
            Embarking on a fitness journey can be both exciting and overwhelming. Whether you're a complete beginner or looking to elevate your current routine, understanding the fundamentals is crucial for long-term success.
          </p>

          <p>
            The key to sustainable fitness lies not in extreme measures or quick fixes, but in building consistent, healthy habits that become part of your lifestyle. This approach ensures that you not only achieve your goals but maintain them over time.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Getting Started</h2>
          
          <p>
            Before diving into any exercise routine, it's important to assess your current fitness level and set realistic, achievable goals. This self-evaluation helps prevent injury and sets the foundation for steady progress.
          </p>

          <ul className="list-disc pl-6 space-y-2">
            <li>Start with a comprehensive health assessment</li>
            <li>Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)</li>
            <li>Choose activities you enjoy to ensure consistency</li>
            <li>Plan for gradual progression in intensity and duration</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Nutrition Fundamentals</h2>

          <p>
            Exercise and nutrition work hand in hand. A well-balanced diet provides the energy needed for workouts and aids in recovery. Focus on whole foods, adequate protein intake, and proper hydration.
          </p>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 my-8">
            <h3 className="font-bold text-gray-900 mb-2">Pro Tip:</h3>
            <p className="text-gray-700">
              Consistency trumps perfection. It's better to maintain a moderate routine consistently than to burn out with an intense program you can't sustain.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Building Your Routine</h2>

          <p>
            A well-rounded fitness routine should include cardiovascular exercise, strength training, and flexibility work. The specific combination depends on your goals, preferences, and current fitness level.
          </p>

          <p>
            Remember, fitness is a journey, not a destination. Celebrate small victories, learn from setbacks, and keep moving forward. The most important workout is the next one.
          </p>
        </div>
      </motion.article>

      {/* Article Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-50 rounded-2xl p-6 mb-12"
      >
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="flex items-center justify-center mb-2">
              <Eye className="h-5 w-5 text-gray-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">2.1k</div>
            <div className="text-sm text-gray-600">Views</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">156</div>
            <div className="text-sm text-gray-600">Likes</div>
          </div>
          <div>
            <div className="flex items-center justify-center mb-2">
              <Share className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">43</div>
            <div className="text-sm text-gray-600">Shares</div>
          </div>
        </div>
      </motion.div>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => {
              const RelatedIcon = categoryIcons[relatedPost.category];
              const relatedColorClass = categoryColors[relatedPost.category];

              return (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="block bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden group"
                >
                  <img
                    src={relatedPost.imageUrl}
                    alt={relatedPost.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-4">
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${relatedColorClass} text-xs font-medium mb-2`}>
                      <RelatedIcon className="h-3 w-3" />
                      <span className="capitalize">{relatedPost.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {relatedPost.readTime} min read
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* Newsletter CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-center text-white"
      >
        <h2 className="text-2xl font-bold mb-4">Enjoyed this article?</h2>
        <p className="text-blue-100 mb-6">
          Subscribe to our newsletter for more fitness tips and insights
        </p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
          />
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all">
            Subscribe
          </button>
        </div>
      </motion.div>
    </div>
  );
};