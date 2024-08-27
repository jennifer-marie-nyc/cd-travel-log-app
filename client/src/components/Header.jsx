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
            <div className="container-fluid d-flex flex-column justify-content-between align-items-center">
                <div className="d-flex mb-3">
                    {props.children[0] ? props.children[0] : props.children}
                </div >
                {/* <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarSupportedContent">
                    <ul className="navbar-nav mb-2 mb-lg-0">
                        <li className="nav-item me-4">
                        {props.children[1] ? 
                        <div className="container mb-4">{props.children[1]}</div> : 
                        null}
                        </li>
                        <li className="nav-item">
                            <button onClick={logOutUser} className="btn btn-link">Logout</button>
                        </li>
                    </ul>
                </div> */}
                <div>
                    <div className="nav-item me-4">
                    {props.children[1] ?
                    <div>{props.children[1]}</div> :
                    null}
                    </div>
                    <p>
                        <button onClick={logOutUser} className="btn btn-link">Logout</button>
                    </p>
                </div>
            </div>
        </nav>
    )

}

export default Header;