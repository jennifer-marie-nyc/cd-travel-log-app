import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../App";

const ProtectedRoute = (props) => {
    const { loggedUser } = useContext(LoggedInUserContext)
    const navigate = useNavigate()

    useEffect(() => {
        // If user is not logged in, redirect to login page
    if (!loggedUser || !loggedUser.token) {
        navigate("/login")
    }
    }, [loggedUser])
    
    // If user is logged in, render component
    if (loggedUser && loggedUser.token) {
        return props.children
    } else {
        return <p>Loading login page...</p>
    }
}

export default ProtectedRoute