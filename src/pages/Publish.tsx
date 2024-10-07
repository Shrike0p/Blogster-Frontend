import { ChangeEvent, useState } from "react";
import { Appbar } from "../Components/Appbar";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();

    return (
        <div>
            <Appbar />
            <div className="flex justify-center pt-8">
                <div className="max-w-screen-lg w-full">
                    <input onChange={(e) => setTitle(e.target.value)} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="Title" />
                    <TextEditor onChange={(e) => setDescription(e.target.value)} />
                    <button onClick={async () => {
                        const token = localStorage.getItem("token"); // Retrieve the token
                        if (!token) {
                            console.error("No token found, please log in");
                            return;
                        }
                        try {
                            const resp = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
                                title,
                                content: description,
                            }, {
                                headers: {
                                    Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
                                },
                            });
                            navigate(`/blog/${resp.data.id}`);
                        } catch (error) {
                            console.error("Error publishing post:", error);
                        }
                    }} type="submit" className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                        Publish post
                    </button>
                </div>
            </div>
        </div>
    );
};

function TextEditor({ onChange }: { onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void }) {
    return (
        <div>
            <div className="w-full mb-4">
                <div className="flex items-center justify-between">
                    <div className="my-2 bg-white rounded-b-lg w-full border">
                        <label className="sr-only">Publish post</label>
                        <textarea onChange={onChange} id="editor" rows={8} className="block w-full px-0 text-sm text-gray-800 bg-white border-0 pl-2" placeholder="Write an article..." required ></textarea>
                    </div>
                </div>
            </div>
        </div>
    );
}
