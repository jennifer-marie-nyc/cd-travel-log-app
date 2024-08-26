import { useContext, useState } from "react";
import { LoggedInUserContext } from "../App";
import { Link } from "react-router-dom";
import EditTrip from "../components/EditTrip";
import Header from "../components/Header";

const DisplayEditTrip = () => {
    const { loggedUser } = useContext(LoggedInUserContext)

    return (
        <>
            <Header>
                <h3>Edit Trip</h3>
                <Link to={`/dashboard/${loggedUser.userId}`}>Dashboard</Link>
            </Header>
            <EditTrip />
        </>
    )
}

export default DisplayEditTrip;