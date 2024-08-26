import Header from "../components/Header";
import RegistrationForm from "../components/RegistrationForm";
import { Link } from "react-router-dom";

const DisplayRegForm = () => {
    return (
        <>

            <nav className="navbar navbar-expand-lg bg-light px-4 py-3 mb-4 d-flex flex-column">
                <h1 className="w-100 text-center display-3 mb-4">Travel Log & Journal</h1>
                <h3 className=" display- mb-4">Sign up to start documenting and sharing your travels!</h3>
                <Link to={`/login`}>Already have an account? Sign in here.</Link>
            </nav>

            <RegistrationForm />
        </>
    )
}

export default DisplayRegForm;