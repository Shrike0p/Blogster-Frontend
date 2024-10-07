import { Appbar } from "../Components/Appbar";
import { BlogCards } from "../Components/BlogsCard";
import { BLogSklton } from "../Components/BlogsSkelton";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Blog } from "../hooks"; // Make sure Blog type is imported

// Date formatting function
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const Blogs = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("date");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, please log in.");
                return;
            }

            const url = debouncedQuery
                ? `${BACKEND_URL}/api/v1/blog/search?query=${debouncedQuery}&page=${page}&limit=10&sort=${sortOption}`
                : `${BACKEND_URL}/api/v1/blog/bulk?page=${page}&limit=10&sort=${sortOption}`;

            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.blogs) {
                setBlogs(response.data.blogs);
                setTotalPages(response.data.totalPages);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching blogs:", error);
            setLoading(false);
        }
    };

    // Debounce logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        fetchBlogs();
    }, [debouncedQuery, sortOption, page]);

    if (loading) {
        return (
            <div>
                <Appbar />
                <div className="flex justify-center py-10">
                    <div className="flex flex-col space-y-4">
                        <BLogSklton />
                        <BLogSklton />
                        <BLogSklton />
                        <BLogSklton />
                    </div>
                </div>
            </div>
        );
    }

    if (!blogs || blogs.length === 0) {
        return (
            <div>
                <Appbar />
                <div className="flex justify-center py-10">
                    <div className="text-gray-500 text-lg font-semibold">No blogs found.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <Appbar />
            {/* Search and Sorting */}
            <div className="flex flex-col sm:flex-row justify-center py-6 px-4 sm:px-8 items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <input
                    type="text"
                    placeholder="Search blogs..."
                    className="bg-white border border-gray-300 shadow-md text-gray-900 text-sm rounded-lg p-3 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    value={searchQuery}
                />
                <select
                    className="bg-white border border-gray-300 shadow-md text-gray-900 text-sm rounded-lg p-3 w-full max-w-md sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onChange={(e) => setSortOption(e.target.value)}
                    value={sortOption}
                >
                    <option value="date">Sort by Date</option>
                    <option value="likes">Sort by Likes</option>
                    <option value="comments">Sort by Comments</option>
                </select>
            </div>

            {/* Blog Cards */}
            <div className="flex flex-col items-center px-4 sm:px-8">
                {blogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="w-full max-w-2xl mb-6 transform hover:scale-105 transition-transform duration-300"
                    >
                        <BlogCards
                            id={blog.id}
                            authorName={blog.author?.name || "Anonymous"}
                            title={blog.title}
                            content={blog.content}
                            publishedDate={formatDate(blog.createdAt)} // Use the actual creation date
                            likesCount={blog.likesCount}
                            commentsCount={blog.commentsCount}
                        />
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-8 space-x-4">
                <button
                    className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${page <= 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                >
                    Previous
                </button>
                <span className="px-4 py-2 text-lg font-semibold">{page}</span>
                <button
                    className={`px-4 py-2 rounded-lg text-white font-semibold transition-colors duration-300 ${page >= totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Blogs;
