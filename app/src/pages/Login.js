import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import logoImg from '../logo.svg';
import { Card, Logo, Form, Input, Button, Error } from '../components/AuthForms';
import { AuthContext } from '../context/auth';

class Login extends Component {
    // Get context from the closest Provider
    static contextType = AuthContext;

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            isError: false,
            userName: '',
            password: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.logIn = this.logIn.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const key = target.name;
        const value = target.value;
        this.setState({ [key]: value });
    }

    async logIn() {
        const { userName, password } = this.state;
        // TODO: login api
        await fetch('/api/auth/logIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: userName,
                password: password
            })
        }).then(result => {
            if (result.status === 200) {
                this.context.setAuthTokens(result.data);
                this.setState({ isLoggedIn: true });
            } else {
                this.setState({ isError: true });
            }
        }).catch(e => {
            this.setState({ isError: true });
        });
    }

    render() {
        const { isLoggedIn, isError, userName, password } = this.state;
        if (isLoggedIn) {
            return <Redirect to='/' />
        }
        // TODO: use reactstrap
        return (
            <Card>
                <Logo src={logoImg} />
                <Form>
                    <Input type='email' name='userName' placeholder='email' value={userName} onChange={this.handleChange} />
                    <Input type='password' name='password' placeholder='password' value={password} onChange={this.handleChange} />
                    <Button onClick={this.logIn}>Sign In</Button>
                </Form>
                { isError && <Error>The username or password provided were incorrect!</Error>}
                <Link to="/signup">Don't have an account?</Link>
            </Card>
        );
    }
}

export default Login;
