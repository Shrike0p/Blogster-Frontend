import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@shrike0p/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInput] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    });

    async function sendRequest() {
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            
            // Assuming the token is returned as response.data
            const jwt = response.data.token || response.data; // Adjust if the token is under a different key
            localStorage.setItem("token", jwt); // Store only the token string
            
            navigate("/blogs");
        } catch (e) {
            console.error("Error during authentication:", e);
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-3xl font-extrabold">Create Account</div>
                        <div className="text-slate-400">
                            {type === "signin" ? "Don't have an account?" : "Already have an Account?"}
                            <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up" : "Sign in"}
                            </Link>
                        </div>
                    </div>
                    <div className="pt-4">
                        {type === "signup" ? <LabelInput label="Name" placeholder="Prakhar Singh" onChange={(e) => {
                            setPostInput({ ...postInputs, name: e.target.value });
                        }} /> : null}
                        <LabelInput label="Username" placeholder="prakharsinghjnv22@gmail.com" onChange={(e) => {
                            setPostInput({ ...postInputs, email: e.target.value });
                        }} />
                        <LabelInput label="Password" type="password" placeholder="Prakhar@123" onChange={(e) => {
                            setPostInput({ ...postInputs, password: e.target.value });
                        }} />
                        <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface LabelInputTypes {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}

function LabelInput({ label, placeholder, onChange, type }: LabelInputTypes) {
    return (
        <div>
            <label className="block mb-2 text-sm font-semibold text-black pt-4">
                {label}
            </label>
            <input
                onChange={onChange}
                type={type || "text"}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={placeholder}
                required
            />
        </div>
    );
}
