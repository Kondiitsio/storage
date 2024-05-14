import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Logout({ className, children }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        let accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        // Function to make a request to the logout endpoint
        const logout = async () => {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            if (response.status === 401) {
                const data = await response.json();
                if (data.error === 'token_expired') {
                    // Token is expired, consider the user logged out
                    console.log('Token expired, user is logged out');
                } else {
                    throw new Error(data.message);
                }
            } else if (!response.ok) {
                throw new Error('Logout failed');
            } else {
                const data = await response.json();
                // console.log(data.message); // Log the logout message when successful
            }
            // If the request was successful, remove the tokens and redirect the user
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            navigate('/');
        };
        await logout();
    };

    return (
        <Link to="/" className={className} onClick={handleLogout}>{children}Logout</Link>
    );
}

export default Logout;