import jwt from 'jsonwebtoken'
import { supabase } from './supabaseClient';

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key';

export const generateToken = (user, expiresIn = '1d') => {
    const payload = {
        userId : user.id,
        phone : user.phone,
        supabaseAuthId : user.supabaseAuthId,
        gender : user.gender,
        adminVerficationStatus : user.adminVerficationStatus
    }

    const SECRET_KEY = 'abc123'

    if (!SECRET_KEY) {
        throw new Error("SECRET_KEY is not defined in environment variables");
    }

    return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

// Verify JWT
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (err) {
        console.error('Invalid token', err);
        return null; // Token is invalid or expired
    }
};


export const getDecodedToken = () => {
    const cookies = document.cookie; // Get all cookies
    const token = cookies
        .split('; ')
        .find((row) => row.startsWith('authToken='))?.split('=')[1]; // Extract the authToken cookie

    if (!token) {
        console.error('Token not found in cookies');
        return null;
    }

    try {
        return jwt.verify(token, SECRET_KEY); // Decode the token
    } catch (err) {
        console.error('Invalid or expired token', err);
        return null;
    }
}; 