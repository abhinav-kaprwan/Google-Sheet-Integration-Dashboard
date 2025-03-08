"use client";
import {createContext,useContext,useState, useEffect} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
interface User {
    userId: string;
    email: string;
}
interface AuthContextType {
    user: User | null;
    login: (email:string, password:string) => Promise<void>;
    logout: () => void;
}   

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token) {
            try {
                const decoded = jwtDecode<User>(token);
                setUser(decoded);
            } catch (error) {
                console.error('Token decode error:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    },[]);

    const login = async (email:string, password:string) => {
        try {
            console.log('Attempting login for:', email);
            const response = await axios.post(
                `${API_URL}/api/auth/login`, 
                {email, password}, 
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true
                });
            console.log('Login successful:', response.data);
            if(response.data.token) {
                localStorage.setItem('token',response.data.token);
                setUser(jwtDecode<User>(response.data.token));
                router.push('/dashboard');
            } else{
                throw new Error('No token received');
            }
            
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    const logout = async() =>{
        try {
            await axios.post(
                `${API_URL}/api/auth/logout`,
                {}, 
                {
                    withCredentials:true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            localStorage.removeItem('token');
            setUser(null);
            router.push('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    const createTable = async (tableName:string, columns:{name:string; type:string}) => {
        try{
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${API_URL}/api/table/create`,
                {name: tableName, columns },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            console.log("Table Created:", response.data);
        }catch (error) {
            console.error("Error creating table:", error);
          }
    };


    return <AuthContext.Provider value={{user, login, logout}}>{children}</AuthContext.Provider>
}

export function useAuth(){
    return useContext(AuthContext);
}
