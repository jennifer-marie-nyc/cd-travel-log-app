import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LoggedInUserContext } from "../App";

const RegistrationForm = () => {
    const {setToken, setLoggedUser} = useContext(LoggedInUserContext)
    const [newUserData, setNewUserData] = useState({
        "firstName": "",
        "lastName": "",
        "email": "",
        "username": "",
        "password": "",
        "confirmPassword": ""
    });
    const [errors, setErrors] = useState({})

    const navigate = useNavigate();

    const updateNewUserData = e => {
        const {name, value} = e.target;
        // update state variables with user input
        setNewUserData( prev => ( { ...prev, [name]: value } ) )
    }

    const createUser = e => {
        e.preventDefault();
        axios.post("http://localhost:8080/api/newuser", newUserData)
            .then( res => {
                let newUserId = res.data.user_id
                // After successful registration, log user in and create token
                axios.post(`http://localhost:8080/regtoken/${newUserId}`)
                    .then( res => {
                        setToken(res.data.access_token)
                        const userData = {
                            "userId": newUserId,
                            "token": res.data.access_token
                        }
                        setLoggedUser(userData)
                        // Save user data to localStorage
                        localStorage.setItem('loggedUser', JSON.stringify(userData))
                        setNewUserData({
                            "firstName": "",
                            "lastName": "",
                            "email": "",
                            "username": "",
                            "password": "",
                            "confirmPassword": ""
                        });
                        setErrors({});
                        navigate(`/dashboard/${newUserId}`)
                    })
                    .catch(error => {
                        console.log(error)
                    })
            })
            .catch( error => {
                console.log("error: ", error);
                console.log(error.response.data.errors);
                if (error) {
                    setErrors(error.response.data.errors)
                }
            })
    }

    return (
        <>
            <div className="container">
                

                <div className="card shadow px-5 py-3">
                    <div className="card-body">
                        <form onSubmit={createUser}>
                            <div className="mb-3">
                                <label htmlFor="firstName" className="form-label">First Name: </label>
                                <input type="text" id="firstName" name="firstName" value={newUserData.firstName} className="form-control" onChange={updateNewUserData} />
                                {errors.firstName && <p className="text-danger">{errors.firstName}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="lastName" className="form-label">Last Name: </label>
                                <input type="text" id="lastName" name="lastName" value={newUserData.lastName} className="form-control" onChange={updateNewUserData} />
                                {errors.lastName && <p className="text-danger">{errors.lastName}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email: </label>
                                <input type="email" id="email" name="email" value={newUserData.email} className="form-control" onChange={updateNewUserData} />
                                {errors.email && <p className="text-danger">{errors.email}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="username" className="form-label">Username: </label>
                                <input type="username" id="username" name="username" value={newUserData.username} className="form-control" onChange={updateNewUserData} />
                                {errors.username && <p className="text-danger">{errors.username}</p>}
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Password: </label>
                                <input type="password" id="password" name="password" value={newUserData.password} className="form-control" onChange={updateNewUserData} />
                                {errors.password && errors.password.map((pwError, index) => (
                                    <p key={index} className="text-danger">{pwError}</p>
                                ))
                                }
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">Confirm Password: </label>
                                <input type="password" id="confirmPassword" name="confirmPassword" value={newUserData.confirmPassword} className="form-control" onChange={updateNewUserData} />
                            </div>
                            <input type="submit" value="Sign up!" className="btn btn-info text-white" />
                        </form>
                    </div>
                </div>
            </div>
        </>
    )

}

export default RegistrationForm