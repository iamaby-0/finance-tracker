import api from "./api"

export const loginUser = async(data) =>{
    const response = await api.post("/auth/signin",data);

    return response.data
}

export const registerUser = async(data)=>{
    const response = await api.post("/auth/signup",data);

    return response.data;
}

export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

export const getStoreUser = () =>{
    const user = localStorage.getItem('user');

    if(!user){
        return null;
    }

    try{
        return JSON.parse(user);
    
    } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("user");
        return null;
    }
}