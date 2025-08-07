// src/components/BlogsPage/BlogClientContent.js
"use client";

import { useEffect, useState, useRef } from "react"; // useRef is unused, consider removing
// Import necessary components used previously in blogs/page.js
import styles from "@/styles/BlogPage/BlogsPage.module.css";
import Breadcrumb from "@/components/BlogsPage/Breadcrumb";
import CategoryFilter from "@/components/BlogsPage/CategoryFilter";
import BlogCarousel from "@/components/BlogsPage/BlogCarousel";
import BlogHorizontalCarousel from "@/components/BlogsPage/BlogHorizontalCarousel";

// CHANGED: Use process.env.NEXT_PUBLIC_API_URL_BLOG directly
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_BLOG;

const BlogClientContent = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [blogs, setBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (blogs.length > 0) {
      const trending = blogs.filter((blog) => blog.status === "Trending");
      const recommended = blogs.filter((blog) => blog.status === "Recommended");
      setTrendingBlogs(trending);
      setRecommendedBlogs(recommended);
      const uniqueCategories = Array.from(
        new Set(blogs.map((blog) => blog.category))
      );
      setCategories(uniqueCategories);
      setLoading(false);
    }
  }, [blogs]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error on retry
      // CHANGED: Use API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/blogs`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      
      // CHANGED: Access data.blogs from the API response
      if (!Array.isArray(data.blogs)) {
          throw new Error("Invalid response format: 'blogs' array missing.");
      }
      setBlogs(data.blogs);

    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again later.");
      setLoading(false);
    }
  };

  const filteredBlogs = // This filteredBlogs is unused in the provided JSX for this component
    selectedCategory === "all"
      ? blogs
      : blogs.filter((blog) => blog.category === selectedCategory);

  return (
    <div className={styles.blogsPageContainer}>
      <Breadcrumb />

      <div className={styles.blogsHero}>
        <h1 className={styles.blogsHeading}>Explore Our Latest Blogs</h1>
        <p className={styles.blogsSubheading}>
          Let's start career with the following domains
        </p>
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {loading ? (
        <div className={styles.loadingState}>
          <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
          </div>
          <p>Loading blogs...</p>
        </div>
      ) : error ? (
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={fetchBlogs} className={styles.retryButton}>
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Render carousels based on fetched data */}
          {recommendedBlogs.length > 0 && (
            <BlogHorizontalCarousel
              blogs={recommendedBlogs}
              title="Recommended Blogs"
              // REMOVED: BASE_URL prop, component will use env var directly
            />
          )}

          {trendingBlogs.length > 0 && (
            <BlogCarousel
              blogs={trendingBlogs}
              title="Trending Blogs"
              // REMOVED: BASE_URL prop, component will use env var directly
            />
          )}
        </>
      )}
    </div>
  );
};

export default BlogClientContent;