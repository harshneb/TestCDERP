'use client';
import { useEffect } from 'react';

export default function ServerPing() {
  useEffect(() => {
    // Ping main server
    const pingServer = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ping`);
        const data = await response.json();
        console.log("Main server status:", data);
      } catch (error) {
        console.error("Main server ping failed:", error);
      }
    };

    // Ping blogs server
    const pingBlogsServer = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL_BLOG}/api/blogs/ping`
        );
        const data = await response.json();
        console.log("Blogs server status:", data);
      } catch (error) {
        console.error("Blogs server ping failed:", error);
      }
    };

    // Execute both pings
    pingServer();
    pingBlogsServer();

    // Optional: Set up interval to ping periodically (every 5 minutes)
    const interval = setInterval(() => {
      pingServer();
      pingBlogsServer();
    }, 5 * 60 * 1000); // 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything visible
}