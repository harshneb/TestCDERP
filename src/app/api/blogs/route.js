import { connectDB } from "@/lib/mongodb";
import mongoose from 'mongoose';
 
// Import the Blog model using the correct path
import Blog from "@/models/Blog";
 
export async function GET(request) {
  try {
    await connectDB();
    console.log('Fetching blogs from database...');
   
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
   
    let query = Blog.find({})
      .sort({ createdAt: -1 })
      .select('title slug content category subcategory author image status createdAt updatedAt');
   
    // Apply limit if specified
    if (limit && !isNaN(parseInt(limit, 10))) {
      query = query.limit(parseInt(limit, 10));
      console.log(`Limiting results to ${limit} blogs`);
    }
   
    const blogs = await query.lean().exec();
 
    if (!blogs || blogs.length === 0) {
      console.log('No blogs found in database');
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
 
    console.log(`Found ${blogs.length} blogs`);
    const blogsWithStringId = blogs.map(blog => ({
      ...blog,
      _id: blog._id.toString(),
      featuredImage: blog.image, // Map image to featuredImage for frontend compatibility
      createdAt: blog.createdAt?.toISOString(),
      updatedAt: blog.updatedAt?.toISOString()
    }));
   
    return new Response(JSON.stringify(blogsWithStringId), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error in API route:", error);
    // Return an empty array on error to prevent client-side errors
    return new Response(
      JSON.stringify({
        success: false,
        error: "API Error",
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
 
 