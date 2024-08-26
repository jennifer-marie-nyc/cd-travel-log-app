import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { LoggedInUserContext } from "../App";

const Login = () => {
    const {setToken, setLoggedUser} = useContext(LoggedInUserContext)
    const [formState, setFormState] = useState({
        email: "",
        password: ""
    })
    const [errorMsg, setErrorMsg] = useState("")
    const navigate = useNavigate()

    function logInUser(e) {
        e.preventDefault()
        // Obtain JWT token
        axios({
            method: "POST",
            url: "http://localhost:8080/token",
            data:{
                email: formState.email,
                password: formState.password
            }
        })
        .then((res) => {
            setToken(res.data.access_token)
            const userData = {
                "userId": res.data.user_id,
                "email": res.data.email,
                "firstName": res.data.first_name,
                "token": res.data.access_token
            }
            setLoggedUser(userData)

            // Save user data to localStorage
            localStorage.setItem('loggedUser', JSON.stringify(userData))
            navigate(`/dashboard/${res.data.user_id}`)
        }).catch((error) => {
            setErrorMsg("Login details incorrect.")
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
        })

        setFormState(({
            email: "",
            password: ""
        }))
    }

    function handleChange(e) {
        const {value, name} = e.target
        setFormState((prevData) => ({
            ...prevData, [name]: value
        }))
    }

    return (
        <div>
            <div className="container">
                {errorMsg && <p className="text-danger">{errorMsg}</p>}
                    <form onSubmit={logInUser} className="login">
                        <div>
                            <label htmlFor="email" className="form-label">Email:</label>
                            <input onChange={handleChange} type="text" name="email" placeholder="email" value={formState.email} className="form-control" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label"></label>
                            <input onChange={handleChange} type="password"  name="password" placeholder="password" value={formState.password} className="form-control"/>
                        </div>
                        <div className="text-right"><input type="submit" value="Submit" className="btn btn-info text-white" /></div>
                    </form>
            </div>
        </div>
    )
}

export default Login;