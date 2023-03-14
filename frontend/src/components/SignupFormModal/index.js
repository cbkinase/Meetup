import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [validationErrors, setValidationErrors] = useState({});
    const signUpDependencies = [
        email,
        username,
        firstName,
        lastName,
        password,
        confirmPassword,
    ];
    useEffect(() => {
        const errors = {};
        if (signUpDependencies.some((formInput) => formInput.length === 0))
            errors.empty = "Positive input length required";
        if (username.length < 4)
            errors.username = "Username must be at least 4 characters";
        if (password.length < 6)
            errors.password = "Password must be at least 6 characters";
        if (password !== confirmPassword)
            errors.confirmation = "Passwords do not match";
        setValidationErrors(errors);

        if (Object.keys(errors).length === 0) setSubmitDisabled(false);
        else setSubmitDisabled(true);
    }, signUpDependencies);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmPassword) {
            setErrors([]);
            return dispatch(
                sessionActions.signup({
                    email,
                    username,
                    firstName,
                    lastName,
                    password,
                })
            )
                .then(closeModal)
                .catch(async (res) => {
                    setHasSubmitted(true);
                    const data = await res.json();
                    if (data && data.errors) setErrors(data.errors);
                });
        }
        return setErrors([
            "Confirm Password field must be the same as the Password field",
        ]);
    };

    return (
        <div className="login-container">
            <h1 id="title">Sign Up</h1>
            <form className="signup-form" onSubmit={handleSubmit}>
                <div className="form-item">
                    <label>
                        <input
                            className="input-field"
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    {hasSubmitted && errors.email && (
                        <p className="errors">*{errors.email}</p>
                    )}
                </div>
                <div className="form-item">
                    <label>
                        <input
                            className="input-field"
                            placeholder="Username - 4 characters minimum"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                    {hasSubmitted && errors.username && (
                        <p className="errors">*{errors.username}</p>
                    )}
                </div>
                <div className="form-item">
                    <label>
                        <input
                            className="input-field"
                            placeholder="First Name"
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-item">
                    <label>
                        <input
                            className="input-field"
                            placeholder="Last Name"
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div className="form-item">
                    <label>
                        <input
                            className="input-field"
                            placeholder="Password - 6 characters minimum"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    {hasSubmitted && errors.password && (
                        <p className="errors">*{errors.password}</p>
                    )}
                </div>
                <div className="form-item">
                    <label>
                        <input
                            className="input-field"
                            placeholder="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button disabled={submitDisabled} id="submit" type="submit">
                    Sign Up
                </button>
            </form>
        </div>
    );
}

export default SignupFormModal;
