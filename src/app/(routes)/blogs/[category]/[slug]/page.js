// src/app/(routes)/blogs/[category]/[slug]/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/BlogPage/BlogDetails.module.css";

// CHANGED: Use process.env.NEXT_PUBLIC_API_URL_BLOG
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL_BLOG;

const BlogDetails = () => {
  const { category, slug } = useParams(); // CHANGED: Destructure 'slug' instead of 'id'
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false); // Unused, consider removing
  const contentRef = useRef(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        // CHANGED: Fetch by slug using the new backend endpoint
        const response = await fetch(`${API_BASE_URL}/api/blogs/slug/${slug}`);
        const data = await response.json();

        if (!response.ok || !data || Object.keys(data).length === 0) {
          throw new Error("Blog not found");
        }

        setBlog({ ...data, category: data.category || category }); // Ensure category is set

        // Fetch related blogs - still filter by category, pass blog._id to exclude
        fetchRelatedBlogs(data.category || category, data._id);

        // Generate table of contents from content
        setTimeout(() => {
          generateTableOfContents();
        }, 500);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    if (slug) { // CHANGED: Condition to fetch based on 'slug'
      fetchBlog();
    } else {
      setLoading(false); // If no slug, stop loading and show not found
      // Optionally, set an error message here like setError("Blog slug is missing.");
    }

    // Set up scroll event for reading progress
    const handleScroll = () => {
      if (contentRef.current) {
        const contentElement = contentRef.current;
        const totalHeight = contentElement.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        const currentPosition = scrollTop - contentElement.offsetTop;
        const scrollableHeight = totalHeight - windowHeight;

        if (scrollableHeight > 0) {
          const progressPercentage = (currentPosition / scrollableHeight) * 100;
          setReadingProgress(Math.min(Math.max(progressPercentage, 0), 100));
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug, category]); // CHANGED: Dependencies to 'slug' and 'category'

  const fetchRelatedBlogs = async (blogCategory, currentBlogId) => {
    try {
      // CHANGED: Use API_BASE_URL. Your backend's /api/blogs returns { blogs: [], hasMore: bool }
      const response = await fetch(
        `${API_BASE_URL}/api/blogs?category=${encodeURIComponent(blogCategory)}`
      );
      const data = await response.json(); // Data is { blogs: [], hasMore: bool }

      if (response.ok && data && Array.isArray(data.blogs)) { // CHANGED: Check data.blogs
        // Filter out current blog and limit to 3 related blogs
        const filtered = data.blogs // CHANGED: Iterate over data.blogs
          .filter((b) => b._id !== currentBlogId)
          .slice(0, 3);
        setRelatedBlogs(filtered);
      }
    } catch (error) {
      console.error("Error fetching related blogs:", error);
    }
  };

  const generateTableOfContents = () => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll("h2, h3");
      const toc = Array.from(headings).map((heading, index) => {
        // Add ID to the heading if it doesn't have one
        if (!heading.id) {
          heading.id = `heading-${index}`;
        }

        return {
          id: heading.id,
          text: heading.textContent,
          level: heading.tagName === "H2" ? 2 : 3,
        };
      });

      setTableOfContents(toc);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className={styles.notFoundContainer}>
        <h2>Blog Not Found</h2>
        <p>The article you're looking for doesn't exist or has been removed.</p>
        <button
          className={styles.backButton}
          onClick={() => router.push("/blogs")}
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <div className={styles.blogPageContainer}>
      {/* Reading Progress Bar */}
      <div
        className={styles.readingProgressBar}
        style={{ width: `${readingProgress}%` }}
      ></div>

      <div className={styles.blogContainer}>
        {/* Blog Header Section */}
        <header className={styles.blogHeader}>
          <div className={styles.blogCategories}>
            {blog.category && (
              <Link
                href={`/blogs/${blog.category}`}
                className={styles.categoryLink}
              >
                {blog.category}
              </Link>
            )}
            {blog.subcategory && (
              <>
                <span className={styles.categorySeparator}>›</span>
                <span className={styles.subcategoryLink}>
                  {blog.subcategory}
                </span>
              </>
            )}
          </div>

          <h1 className={styles.title}>{blog.title}</h1>

          <div className={styles.metaInfo}>
            <div className={styles.authorInfo}>
              <div className={styles.authorAvatar}>
                {blog.authorAvatar ? (
                  <Image
                    src={
                      blog.authorAvatar.startsWith("http")
                        ? blog.authorAvatar
                        : `${API_BASE_URL}${blog.authorAvatar}` // CHANGED: Use API_BASE_URL
                    }
                    alt={blog.author}
                    width={40}
                    height={40}
                  />
                ) : (
                  <div className={styles.defaultAvatar}>
                    {blog.author?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
              </div>
              <div className={styles.authorDetails}>
                <span className={styles.authorName}>{blog.author}</span>
                <span className={styles.publishDate}>
                  {formatDate(blog.date || blog.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className={styles.featuredImageContainer}>
          <Image
            src={
              blog.image?.startsWith("http")
                ? blog.image
                : `${API_BASE_URL}${blog.image}` // CHANGED: Use API_BASE_URL
            }
            alt={blog.title}
            className={styles.blogImage}
            width={1200}
            height={600}
            priority
          />
          {blog.imageCaption && (
            <p className={styles.imageCaption}>{blog.imageCaption}</p>
          )}
        </div>

        <div className={styles.contentContainer}>
          {/* Table of Contents Sidebar */}
          {tableOfContents.length > 0 && (
            <div className={styles.tableOfContents}>
              <h3>Table of Contents</h3>
              <ul>
                {tableOfContents.map((item) => (
                  <li
                    key={item.id}
                    className={item.level === 3 ? styles.tocSubItem : ""}
                  >
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Content */}
          <div
            ref={contentRef}
            className={styles.blogContent}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Author Bio Section */}
        {blog.authorBio && (
          <div className={styles.authorBio}>
            <div className={styles.authorBioHeader}>
              <div className={styles.authorAvatarLarge}>
                {blog.authorAvatar ? (
                  <Image
                    src={
                      blog.authorAvatar.startsWith("http")
                        ? blog.authorAvatar
                        : `${API_BASE_URL}${blog.authorAvatar}` // CHANGED: Use API_BASE_URL
                    }
                    alt={blog.author}
                    width={80}
                    height={80}
                  />
                ) : (
                  <div className={styles.defaultAvatarLarge}>
                    {blog.author?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
              </div>
              <div>
                <h3>About the Author</h3>
                <h4>{blog.author}</h4>
              </div>
            </div>
            <p>{blog.authorBio}</p>
          </div>
        )}

        {/* Related Articles Section */}
        {relatedBlogs.length > 0 && (
          <div className={styles.relatedArticles}>
            <h2>Related Articles</h2>
            <div className={styles.relatedArticlesGrid}>
              {relatedBlogs.map((relatedBlog) => (
                <Link
                  // CHANGED: Use blog.slug for the Link href
                  href={`/blogs/${relatedBlog.category}/${relatedBlog.slug || relatedBlog._id}`}
                  key={relatedBlog._id}
                  className={styles.relatedArticleCard}
                >
                  <div className={styles.relatedArticleImage}>
                    <Image
                      src={
                        relatedBlog.image?.startsWith("http")
                          ? relatedBlog.image
                          : `${API_BASE_URL}${relatedBlog.image}` // CHANGED: Use API_BASE_URL
                      }
                      alt={relatedBlog.title}
                      width={300}
                      height={180}
                    />
                  </div>
                  <div className={styles.relatedArticleContent}>
                    <h3>{relatedBlog.title}</h3>
                    <p>
                      {relatedBlog.content
                        ?.replace(/<[^>]*>/g, "")
                        .slice(0, 80)}
                      ...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogDetails;