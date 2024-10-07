import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

// Define the structure for a Blog
export interface Blog {
    id: string;
    content: string;
    title: string;
    author: {
        name: string;
    };
    likesCount: number;
    commentsCount: number;
    comments?: { text: string }[]; // Comments array for individual blog
}

// Hook to fetch a single blog by its ID
export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog | null>(null); // Initialize blog as null

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, please log in");
            setLoading(false);  // Stop the loader if no token is found
            return;
        }

        axios
            .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("Full blog response:", response.data); // Log the full response for debugging
                if (response.data && response.data.blog) {
                    setBlog(response.data.blog); // Set the blog data
                } else {
                    console.error("Blog data is not available in the response.");
                }
                setLoading(false); // Stop the loader
            })
            .catch((error) => {
                console.error("Error fetching blog:", error);
                setLoading(false); // Stop the loader on error
            });
    }, [id]);

    return { loading, blog };
};

// Hook to fetch multiple blogs (for the blog list page)
export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found, please log in");
            setLoading(false);  // Stop the loader if no token is found
            return;
        }

        axios
            .get(`${BACKEND_URL}/api/v1/blog/bulk`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log("Blogs response:", response.data); // Log the full response for debugging
                // Assuming the backend returns an array directly
                if (Array.isArray(response.data)) {
                    setBlogs(response.data); // Set the blogs directly from response.data
                } else {
                    console.error("No blogs found in the response.");
                }
                setLoading(false); // Stop the loader
            })
            .catch((error) => {
                console.error("Error fetching blogs:", error);
                setLoading(false); // Stop the loader on error
            });
    }, []);

    return { loading, blogs };
};
