import Header from '../components/Header';
import Login from '../components/Login'
import { Link } from 'react-router-dom';

const DisplayLogin = () => {

    return (
        <>
            <Header>
                <h3>User Login</h3>
                <Link to={`/`}>New user? Sign up here.</Link>
            </Header>
            <Login />
        </>
    )
}

export default DisplayLogin;