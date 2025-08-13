"use client";
import React, { useState, useEffect } from 'react';
import { Crown, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Card from './ui/Card.js';
 
const TrendingBlogs = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        console.log('Fetching blogs...');
        const response = await fetch('/api/blogs?limit=4');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        console.log('Fetched blogs:', data);
        if (data && data.length > 0) {
          console.log('First blog slug:', data[0].slug);
          console.log('First blog _id:', data[0]._id);
        }
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
 
    fetchLatestBlogs();
  }, []);
 
  if (loading) return <div className="text-center py-10">Loading trending blogs...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  if (!blogs || blogs.length === 0) return <div className="text-center py-10">No trending blogs found</div>;
 
  // Format blog data for Card component
  const formattedBlogs = blogs.map((blog, index) => ({
    id: blog._id || index,
    title: blog.title || 'Untitled Blog',
    description: blog.excerpt || (blog.content ?
      blog.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' :
      'No description available'),
    category: blog.category || 'Blog',
    image: blog.featuredImage || 'https://res.cloudinary.com/decptkmx7/image/upload/v1751974369/trending_pg_img_nmsinr.jpg',
    author: blog.author || 'Admin',
    date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'No date',
    readTime: '5 min read',
    slug: blog.slug || '#',
    Icon: index % 2 === 0 ? Crown : TrendingUp,
    iconColor: index % 2 === 0 ? 'bg-yellow-500' : 'bg-blue-500'
  }));
 
 
  return (
    <>
      <div id="trending-blogs" className="relative min-h-screen p-8" style={{ backgroundColor: '#0a2a43' }}>
        {/* Floating geometric elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Large rectangle - top left */}
          <div className="absolute top-20 left-20 w-24 h-32 bg-blue-600/20 rounded-lg transform rotate-12 animate-float-1"></div>
          {/* Medium rectangle - top right */}
          <div className="absolute top-32 right-32 w-20 h-16 bg-blue-500/15 rounded-lg transform -rotate-6 animate-float-2"></div>
          {/* Small circle - top center */}
          <div className="absolute top-16 left-1/2 w-3 h-3 bg-white/40 rounded-full animate-float-3"></div>
          {/* Medium circle - right side */}
          <div className="absolute top-1/3 right-20 w-6 h-6 bg-blue-400/30 rounded-full animate-float-4"></div>
          {/* Rectangle - bottom left */}
          <div className="absolute bottom-32 left-16 w-16 h-20 bg-blue-600/15 rounded-lg transform rotate-45 animate-float-5"></div>
          {/* Rectangle - bottom right */}
          <div className="absolute bottom-40 right-24 w-28 h-20 bg-blue-500/20 rounded-lg transform -rotate-12 animate-float-6"></div>
          {/* Additional floating elements */}
          <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-white/20 rounded-full animate-float-7"></div>
          <div className="absolute bottom-1/4 right-1/3 w-18 h-24 bg-blue-600/10 rounded-lg transform rotate-30 animate-float-8"></div>
        </div>
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="relative inline-block">
              <h1 className="text-5xl font-bold text-white mb-4 relative">
                <span className="relative z-10">
                  Trending
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent ml-3">
                    Blogs
                  </span>
                </span>
                {/* Animated glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 blur-xl animate-pulse"></div>
                {/* Decorative elements */}
                <div className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-300"></div>
              </h1>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 rounded-full shadow-lg"></div>
              {/* Sparkle effects */}
              <div className="absolute -top-8 left-1/4 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
              <div className="absolute -top-6 right-1/3 w-1 h-1 bg-cyan-300 rounded-full animate-twinkle delay-500"></div>
              <div className="absolute -bottom-6 left-2/3 w-1 h-1 bg-purple-300 rounded-full animate-twinkle delay-700"></div>
            </div>
            <p className="text-gray-300 text-lg mt-8">Discover the most popular technical articles and insights</p>
          </div>
 
          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {formattedBlogs.map((blog) => (
              <div
                key={blog.id}
                className="group relative"
                onMouseEnter={() => setHoveredCard(blog.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`transform transition-all duration-300 ${
                    hoveredCard === blog.id ? 'scale-96' : ''
                  }`}
                >
                  <Card
                    href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}
                    title={blog.title}
                    description={blog.description}
                    image={blog.image}
                    icon={blog.Icon}
                    iconColor={blog.iconColor}
                    contentClassName="p-5"
                    imageClassName="h-48"
                  />
                </div>
              </div>
            ))}
          </div>
 
          {/* Call to Action */}
          <div className="text-center mt-16">
            <Link
              href="/courses"
              className="inline-block px-6 py-3 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-4 border-white shadow-lg hover:shadow-xl"
              style={{ boxShadow: '0 0 0 2px #1e90ff, 0 2px 8px rgba(0,0,0,0.08)' }}
            >
              View All Blogs
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
 
export default TrendingBlogs;