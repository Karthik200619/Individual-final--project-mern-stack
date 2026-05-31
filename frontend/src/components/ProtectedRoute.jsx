import React from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../store/authStore'

function ProtectedRoute({
    children,
    allowedRoles = []
}) {

    const {
        isAuthenticated,
        loading,
        currentUser
    } = useAuth();

    if (loading) {

        return (
            <div className='flex justify-center items-center h-screen'>
                Loading...
            </div>
        );

    }

    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }

    if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(
            currentUser?.role
        )
    ) {

        return (
            <Navigate
                to={
                    currentUser?.role === "ADMIN"
                        ? "/admin-dashboard"
                        : "/userhome"
                }
                replace
            />
        );

    }

    return children;

}

export default ProtectedRoute