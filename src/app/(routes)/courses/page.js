'use client';
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Smartphone, Brain, MessageCircle, Menu, X, BookOpen, GraduationCap, Filter, Search, ArrowRight } from 'lucide-react';
import Card from '@/components/BlogsPage/ui/Card';
import InterviewCard from '@/components/interviewCard';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const BlogPage = () => {
  const [selectedCourse, setSelectedCourse] = useState('All Courses');
  const [showTopics, setShowTopics] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);

  // New states for section and interview questions
  const [activeSection, setActiveSection] = useState('blogs');
  const [interviewQuestions, setInterviewQuestions] = useState([]);
  const [interviewCards, setInterviewCards] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);

  // Dynamic data states
  const [courses, setCourses] = useState([]);
  const [courseSidebarData, setCourseSidebarData] = useState({});

  const selectCourse = (course) => {
    setSelectedCourse(course);
    setIsDropdownOpen(false);
    setShowTopics(false);
    setShowQuestions(false);
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        
        // Transform the data to match your frontend structure
        const transformedBlogs = data.map(blog => {
          const description = blog.content 
            ? blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' 
            : 'No content available';
            
          return {
            id: blog._id,
            title: blog.title,
            description: description,
            excerpt: blog.excerpt || description,
            date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'No date',
            readTime: blog.readTime || '5 min read',
            category: blog.category || 'Uncategorized',
            image: blog.image || blog.featuredImage,
            author: blog.author || 'Admin',
            slug: blog.slug || blog.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
            createdAt: blog.createdAt
          };
        });

        // Add icons and bgColor to blogs
        const bgColors = [
          "bg-gradient-to-br from-blue-500 to-blue-600",
          "bg-gradient-to-br from-blue-500 to-blue-600",
          "bg-gradient-to-br from-blue-500 to-blue-600",
          "bg-gradient-to-br from-blue-500 to-blue-600",
          "bg-gradient-to-br from-blue-500 to-blue- 600",
          "bg-gradient-to-br from-blue-500 to-blue-600"
        ];
        
        const blogsWithExtras = transformedBlogs.map((blog, index) => ({
          ...blog,
          bgColor: bgColors[index % bgColors.length]
        }));
        
        setBlogs(blogsWithExtras);
        
        // Extract unique categories for the course filter
        const categories = ['All Courses', ...new Set(data.map(blog => blog.category))];
        setCourses(categories);
        
        // Generate sidebar data structure
        const sidebarData = {};
        data.forEach(blog => {
          if (!sidebarData[blog.category]) {
            sidebarData[blog.category] = {
              topics: [],
              questions: []
            };
          }
          if (blog.topics) {
            sidebarData[blog.category].topics = [
              ...sidebarData[blog.category].topics,
              ...blog.topics
            ];
          }
        });
        setCourseSidebarData(sidebarData);
        
      } catch (error) {
        console.error('Error fetching blogs:', error);
        // Optionally set an error state to show to the user
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Fetch interview data when needed
  useEffect(() => {
    const fetchInterviewData = async () => {
      if (activeSection === 'interview' && interviewQuestions.length === 0) {
        setLoadingQuestions(true);
        setLoadingCards(true);
        try {
          const response = await fetch('/Jsonfolder/interview.json');
          if (!response.ok) throw new Error('Failed to fetch interview data');
          const data = await response.json();
          setInterviewQuestions(data);
          setInterviewCards(data); // Use the same data for both cards and questions
        } catch (err) {
          console.error('Error fetching interview data:', err);
        } finally {
          setLoadingQuestions(false);
          setLoadingCards(false);
        }
      }
    };

    fetchInterviewData();
  }, [activeSection, interviewQuestions.length]);

  // Helper function to convert heading to URL-friendly slug
  const getCategory = (heading) => {
    return heading
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  // Filter articles by selectedCourse and searchQuery
  const filteredBlogs = blogs.filter(blog => {
    // Check if blog matches the selected course filter
    const matchesCourse = selectedCourse === 'All Courses' || blog.category === selectedCourse;
    
    // Check if blog matches the search query
    const matchesSearch = searchQuery === '' || (
      (blog.title && blog.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (blog.description && blog.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (blog.category && blog.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (blog.author && blog.author.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    return matchesCourse && matchesSearch;
  });

  // Filter interview questions by selectedCourse and searchQuery
  const filteredQuestions = interviewQuestions.filter(q =>
    (selectedCourse === 'All Courses' || q.category === selectedCourse) &&
    (searchQuery === '' || (q.question && q.question.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const EnhancedSidebar = ({ isMobile = false }) => {
    return (
      <div className={`${isMobile ? 'w-full' : 'w-full max-w-md'} h-full flex flex-col`}>
      {/* Header */}
      <div className="mb-8 ">
        <h1 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2 pt-8">
          <GraduationCap className="w-7 h-7 text-blue-600" />
          All Courses
        </h1>
        <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full"></div>
      </div>

      {/* Course Selector */}
      <div className="pt-5 mb-3">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-left shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-slate-700 font-medium">{selectedCourse}</span>
            </div>
            <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 pt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
              {courses.map((course, index) => (
                <button
                  key={index}
                  onClick={() => selectCourse(course)}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-150 flex items-center gap-3 ${
                    selectedCourse === course ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    selectedCourse === course ? 'bg-blue-600' : 'bg-slate-300'
                  }`}></div>
                  {course}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-4 pt-6 flex-1 overflow-y-auto custom-scrollbar">
        {/* Blogs Section */}
        <div
          className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer transition ring-2 ${activeSection === 'blogs' ? 'ring-blue-400' : 'ring-transparent'}`}
          onClick={() => setActiveSection('blogs')}
        >
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-800">Blogs</h3>
                <p className="text-sm text-slate-500">Learning resources</p>
              </div>
              <span className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                {selectedCourse === 'All Courses'
                  ? filteredBlogs.length
                  : (blogs.filter(a => a.category === selectedCourse).length)}
              </span>
            </div>
          </div>
          <div className="px-6 pb-4 space-y-2">
            <div className="h-px bg-slate-100 mb-3"></div>
            {(courseSidebarData[selectedCourse]?.topics || []).map((topic, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  setSearchQuery(topic);
                  // Optionally scroll to articles grid
                  const grid = document.getElementById('blogs-grid');
                  if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm transition-colors duration-150"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Interview Questions Section */}
        <div
          className={`bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden cursor-pointer transition ring-2 ${activeSection === 'interview' ? 'ring-purple-400' : 'ring-transparent'}`}
          onClick={() => setActiveSection('interview')}
        >
          <div className="px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-800">Interview Questions</h3>
                <p className="text-sm text-slate-500">Prepare for interviews</p>
              </div>
              <span className="ml-auto bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {selectedCourse === 'All Courses'
                  ? interviewQuestions.length
                  : (interviewQuestions.filter(q => q.category === selectedCourse).length)}
              </span>
            </div>
          </div>
          <div className="px-6 pb-4 space-y-2">
            <div className="h-px bg-slate-100 mb-3"></div>
            {(selectedCourse === 'All Courses'
              ? Array.from(new Set(Object.values(courseSidebarData).flatMap(c => c.topics || [])))
              : (courseSidebarData[selectedCourse]?.topics || [])
            ).map((topic, index) => (
              <a
                key={index}
                href="#"
                className="block px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-600 text-sm transition-colors duration-150"
              >
                {topic}
              </a>
            ))}
          </div>
        </div>
      </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-white rounded-full p-2 shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="w-7 h-7 text-blue-700" />
      </button>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-full md:w-80 bg-gradient-to-br from-slate-50 to-blue-50 border-r border-gray-200 flex-col py-8 px-6 h-screen fixed left-0 top-0 bottom-0 overflow-y-auto custom-scrollbar">
        <EnhancedSidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 flex md:hidden">
          <aside className="relative w-80 max-w-full bg-gradient-to-br from-slate-50 to-blue-50 border-r border-gray-200 flex flex-col py-8 px-6 h-full overflow-y-auto custom-scrollbar animate-slide-in-left">
            <button
              className="absolute top-4 right-4 z-50 bg-white rounded-full p-2 shadow border border-gray-200 focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X className="w-7 h-7 text-blue-700" />
            </button>
            <div className="mt-8">
              <EnhancedSidebar isMobile={true} />
            </div>
          </aside>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-80 bg-gray-50">
        {/* Header Section */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 md:px-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Explore Learning Content
                </h1>
                <p className="text-gray-600">
                  Discover blogs, tutorials, and interview questions
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={activeSection === 'blogs' ? "Search blogs..." : "Search interview questions..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-80 placeholder-gray-500 text-black"
                  autoComplete="off"
                />
                {searchQuery && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
                    {Array.from(new Set([
                      ...(activeSection === 'blogs'
                        ? blogs.map(a => a.title)
                        : interviewQuestions.map(q => q.question)
                      ),
                      ...(courseSidebarData[selectedCourse]?.topics || [])
                    ])).filter(
                      suggestion =>
                        suggestion &&
                        suggestion.toLowerCase().includes(searchQuery.toLowerCase()) &&
                        suggestion.trim() !== ''
                    ).slice(0, 8).map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="w-full text-left px-4 py-2 hover:bg-blue-50 text-slate-700"
                        onClick={() => setSearchQuery(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="p-4 md:p-8" id="blogs-grid">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {activeSection === 'blogs'
                ? `${filteredBlogs.length} Blogs Found`
                : `${filteredQuestions.length} Interview Questions Found`
              }
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6"></div>
          </div>

          {activeSection === 'blogs' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBlogs.map((blog) => (
                <div 
                  key={blog.id}
                  className="relative transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:scale-[0.96]"
                >
                  <Card
                    href={`/blogs/${blog.category.toLowerCase()}/${blog.slug}`}
                    title={blog.title}
                    description={blog.description}
                    author={blog.author || 'Admin'}
                    image={blog.image || blog.featuredImage || '/placeholder-blog.jpg'}
                    contentClassName="p-6 flex flex-col flex-1"
                    imageClassName="h-48"
                    isHoverable={true}
                    className="h-full"
                    onImageError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/placeholder-blog.jpg';
                    }}
                    header={
                      <div className="absolute top-4 right-4 z-10">
                        <span className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-800">
                          {blog.category || 'Uncategorized'}
                        </span>
                      </div>
                    }
                    footer={
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div>
                            By <span className="font-medium text-blue-600">{blog.author || 'Admin'}</span>
                          </div>
                          <div>
                            {new Date(blog.createdAt || new Date()).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
          ) : (
            loadingQuestions ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">Loading interview questions...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredQuestions.map((item, idx) => (
    <InterviewCard
      key={item.id || idx}
      title={item.heading || item.question}
      description={item.description || item.answer}
      imageUrl={item.initialImage || item.image || '/placeholder-blog.jpg'}
      buttonText="View Questions"
      viewMoreLink={`/interview/${(item.heading || item.category || '').split(' ')[0].toLowerCase()}`}
    />
  ))}
</div>
            )
          )}

          {/* No data found message */}
          {activeSection === 'blogs' && filteredBlogs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}
          {activeSection === 'interview' && !loadingQuestions && filteredQuestions.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No interview questions found</h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 6px;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #e5e7eb #f8fafc;
        }
        .animate-slide-in-left {
          animation: slideInLeft 0.3s ease-out;
        }
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};  

export default BlogPage;