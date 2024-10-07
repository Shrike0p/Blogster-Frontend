import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupInput } from "@shrike0p/medium-common";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { z } from "zod";

// Zod schema for form validation
const AuthSchema = z.object({
    name: z.string().optional(),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one special character"),
});

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const navigate = useNavigate();
    const [postInputs, setPostInput] = useState<SignupInput>({
        name: "",
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    async function sendRequest() {
        // Validate inputs before sending the request
        const validationResult = AuthSchema.safeParse(postInputs);
        if (!validationResult.success) {
            // Extract and set errors if validation fails
            const formErrors = validationResult.error.formErrors.fieldErrors;
            setErrors({
                email: formErrors.email?.[0],
                password: formErrors.password?.[0],
            });
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs);
            
            const jwt = response.data.token || response.data;
            localStorage.setItem("token", jwt);
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
                        <div className="text-3xl font-extrabold">{type === "signup" ? "Create Account" : "Sign In"}</div>
                        <div className="text-slate-400">
                            {type === "signin" ? "Don't have an account?" : "Already have an Account?"}
                            <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                                {type === "signin" ? "Sign up" : "Sign in"}
                            </Link>
                        </div>
                    </div>
                    <div className="pt-4">
                        {type === "signup" ? (
                            <LabelInput 
                                label="Name" 
                                placeholder="Prakhar Singh" 
                                onChange={(e) => setPostInput({ ...postInputs, name: e.target.value })} 
                            />
                        ) : null}
                        <LabelInput 
                            label="Email" 
                            placeholder="prakharsinghjnv22@gmail.com" 
                            onChange={(e) => setPostInput({ ...postInputs, email: e.target.value })} 
                            error={errors.email} 
                        />
                        <LabelInput 
                            label="Password" 
                            type="password" 
                            placeholder="Prakhar@123" 
                            onChange={(e) => setPostInput({ ...postInputs, password: e.target.value })} 
                            error={errors.password} 
                        />
                        <button 
                            onClick={sendRequest} 
                            type="button" 
                            className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        >
                            {type === "signup" ? "Sign up" : "Sign in"}
                        </button>
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
    error?: string; // For displaying validation errors
}

function LabelInput({ label, placeholder, onChange, type, error }: LabelInputTypes) {
    return (
        <div>
            <label className="block mb-2 text-sm font-semibold text-black pt-4">
                {label}
            </label>
            <input
                onChange={onChange}
                type={type || "text"}
                className={`bg-gray-50 border ${error ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
                placeholder={placeholder}
                required
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}
