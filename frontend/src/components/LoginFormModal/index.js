import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { closeModal } = useModal();
    const [validationErrors, setValidationErrors] = useState({});
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const history = useHistory();

    useEffect(() => {
        const errors = {};
        if (credential.length < 4) {
            errors.credential =
                "Username or Email must be at least 4 characters";
        }
        if (password.length < 6) {
            errors.password = "Password must be at least 6 characters";
        }

        setValidationErrors(errors);

        if (Object.keys(errors).length === 0) {
            setSubmitDisabled(false);
        } else setSubmitDisabled(true);
    }, [credential, password]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors([]);
        await dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(Object.values(data.errors));
            });
        if (errors.length === 0) {
            const self = document.getElementsByClassName("nav-container")[0];
            self.style.borderBottom = "1px solid rgb(103, 102, 102)";
            history.push("/");
        }
    };

    const handleDemoLogin = async (e) => {
        const self = document.getElementsByClassName("nav-container")[0];
        self.style.borderBottom = "1px solid rgb(103, 102, 102)";
        e.preventDefault();
        const demoUser = {
            credential: "Demo-lition",
            password: "password",
        };
        await dispatch(sessionActions.login(demoUser))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(Object.values(data.errors));
            });
        if (errors.length === 0) history.push("/");
    };

    return (
        <div className="login-container">
            <h1 id="title">Log In</h1>
            <form className="login-form" onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => (
                        <li className="errors" key={idx}>
                            {error}
                        </li>
                    ))}
                </ul>
                <div className="form-item">
                    <label>
                        <input
                            className="input-field"
                            type="text"
                            value={credential}
                            placeholder="Username or Email"
                            onChange={(e) => setCredential(e.target.value)}
                            required
                        />
                    </label>
                    {/* {validationErrors.credential && (
                        <p className="errors">*{validationErrors.credential}</p>
                    )} */}
                </div>
                <div className="form-item">
                    <label>
                        <input
                            className="input-field"
                            placeholder="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {/* {validationErrors.password && (
                        <p className="errors">*{validationErrors.password}</p>
                    )} */}
                </div>
                <button
                    className="decorated-button button-needs-adjustment"
                    disabled={submitDisabled}
                    id="submit"
                    type="submit"
                >
                    Log In
                </button>
                <button
                    className="decorated-button button-needs-adjustment"
                    onClick={handleDemoLogin}
                    id="demo"
                >
                    Demo User
                </button>
            </form>
        </div>
    );
}

export default LoginFormModal;
