import { Blog } from "../hooks";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogsCard";
import axios from "axios";
import { useState, useEffect } from "react";
import { BACKEND_URL } from "../config";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

export const FullBlog = ({ blog }: { blog: Blog | null }) => {
    const [likes, setLikes] = useState(blog?.likesCount || 0);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(blog?.comments || []);
    const [relatedPosts, setRelatedPosts] = useState<Blog[]>([]);

    // Fetch related posts
    useEffect(() => {
        const fetchRelatedPosts = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk?page=1&limit=3`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setRelatedPosts(response.data.blogs);
            } catch (error) {
                console.error("Failed to fetch related posts:", error);
            }
        };

        fetchRelatedPosts();
    }, [blog]);

    const handleLike = async () => {
        if (!blog) return;
        try {
            await axios.post(`${BACKEND_URL}/api/v1/blog/${blog.id}/like`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setLikes(likes + 1);
        } catch (error) {
            console.error("Failed to like the blog post:", error);
        }
    };

    const handleCommentSubmit = async () => {
        if (!blog) return;
        try {
            await axios.post(`${BACKEND_URL}/api/v1/blog/${blog.id}/comment`, {
                comment_text: newComment,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setComments([...comments, { text: newComment }]);
            setNewComment("");
        } catch (error) {
            console.error("Failed to submit comment:", error);
        }
    };

    if (!blog) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 px-10 w-full pt-12 max-w-screen-xl">
                    <div className="col-span-8">
                        <div className="text-5xl font-extrabold mb-4">{blog.title}</div>
                        <div className="text-slate-500 pt-2 mb-6">
                            Posted {formatDistanceToNow(new Date(blog.createdAt))} ago
                        </div>
                        <div className="pt-4 mb-6 text-lg leading-7 text-gray-800">{blog.content}</div>

                        <div className="pt-4 mb-6">
                            <button onClick={handleLike} className="mr-4 text-sm text-blue-500 hover:underline">
                                Like ({likes})
                            </button>
                        </div>

                        <div className="pt-4 mb-6">
                            <h3 className="font-bold text-lg mb-2">Comments</h3>
                            <div className="mb-4">
                                {comments.map((comment, index) => (
                                    <div key={index} className="border-b py-2">
                                        {comment.text}
                                    </div>
                                ))}
                            </div>
                            <div>
                                <input
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    type="text"
                                    className="border rounded px-2 py-1 w-full mb-2"
                                    placeholder="Add a comment..."
                                />
                                <button onClick={handleCommentSubmit} className="text-sm text-white bg-blue-500 px-4 py-2 rounded">
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Author Section */}
                    <div className="col-span-4">
                        <div className="text-slate-600 text-lg mb-4">Author</div>
                        <div className="flex items-center mb-6">
                            <div className="pr-4">
                                <Avatar size="big" name={blog.author.name || "Anonymous"} />
                            </div>
                            <div>
                                <div className="text-xl font-bold">{blog.author.name || "Anonymous"}</div>
                                <div className="pt-2 text-slate-500">Author description or catchphrase here.</div>
                            </div>
                        </div>

                        {/* Related Posts Section */}
                        <div className="pt-10">
                            <h3 className="font-bold text-xl mb-4">Related Posts</h3>
                            <div className="flex flex-col space-y-4">
                                {relatedPosts.map((post) => (
                                    <Link to={`/blog/${post.id}`} key={post.id} className="group">
                                        <div className="bg-white rounded-lg shadow-md p-4 transition-transform transform group-hover:scale-105 hover:bg-blue-50 duration-300">
                                            <h4 className="text-lg font-semibold mb-2 text-gray-800 group-hover:text-blue-600">{post.title}</h4>
                                            <p className="text-sm text-gray-600">
                                                {formatDistanceToNow(new Date(post.createdAt))} ago
                                            </p>
                                            <p className="text-gray-700 mt-2">
                                                {post.content.slice(0, 70)}...
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
