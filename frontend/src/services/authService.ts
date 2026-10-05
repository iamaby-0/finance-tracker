import api  from "./api";
import type { LoginResponse } from "../types/auth";

interface LoginData {
    email : string;
    password : string;
}

interface RegisterData {
    name : string;
    email : string;
    password: string;
    userType : "student" | "employed" | "unemployed";
}

const loginUser = async(data : LoginData) : Promise<LoginResponse> =>{
    const response = await api.post<LoginResponse>("auth/signin", data);

    return response.data;
}

const registerUser = async(data : RegisterData) =>{
    const response = await api.post("auth/signup", data);

    return response.data;
}

export {
    loginUser,
    registerUser
}
