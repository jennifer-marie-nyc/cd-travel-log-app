import CreateTrip from "../components/CreateTrip";
import Header from "../components/Header";
import { useContext } from "react";
import { LoggedInUserContext } from "../App";
import { Link } from "react-router-dom";

const DisplayCreateTrip = () => {
    const { loggedUser } = useContext(LoggedInUserContext)
    return (
        <>
            <Header>
                <h3>Add A Trip</h3>
                <Link to={`/dashboard/${loggedUser.userId}`}>Dashboard</Link>
            </Header>
            <CreateTrip />
        </>
    )
}

export default DisplayCreateTrip;