import React, {FC, useContext, useState} from "react";
import { Context } from "..";
import { observer } from "mobx-react-lite";

const LoginForm: FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const {store} = useContext(Context)
    const [error, setError] = useState(false)

    return (
        <div className="loginModal">
            <h1>Welcome!</h1>
            <input 
                onChange={(e) => {setEmail(e.target.value)}}
                value={email}
                type="email" 
                placeholder="Email"
                className="loginInput"
            />

            <input 
                onChange={(e) => {setPassword(e.target.value)}}
                value={password}
                type="password" 
                placeholder="Password"
                className="loginInput"
            />
            <button onClick={() => store.login(email, password)}>Log in</button>
            <button onClick={() => store.registration(email, password)}>Registration</button>
        </div>
    );
};

export default observer(LoginForm)