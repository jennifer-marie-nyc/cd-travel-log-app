import { useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoggedInUserContext } from "../App";

const Header = (props) => {
    const { removeToken, setLoggedUser } = useContext(LoggedInUserContext)
    const navigate = useNavigate()

    const logOutUser = e => {
        axios({
            method: "POST",
            url:"http://localhost:8080/logout"
        })
        .then((res) => {
            removeToken()
            localStorage.removeItem("loggedUser")
            setLoggedUser({"userId": "", "email": "", "token": ""})
            navigate("/login")
        }).catch((error) => {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
        })
    }

    return (
        <nav className="navbar navbar-expand-lg bg-light px-4 py-3 mb-4 flex-column">
        <h1 className="w-100 text-center">Travel Log & Journal</h1>
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center">
            <div className="d-flex mb-3">
                {props.children[0] ? props.children[0] : props.children}
            </div>
                {props.children[1] ? <div className="mb-3">{props.children[1]}</div> : null}
                <div>
                    <button onClick={logOutUser} className="btn btn-link">Logout</button>
                </div>
        </div>
    </nav>
    )

}

export default Header;