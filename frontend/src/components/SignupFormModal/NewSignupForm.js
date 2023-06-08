import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";

export default function NewSignupForm() {
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
            errors.empty = "Nonzero input length required";
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
        <div className="signup-container-new">
            <h2 className="login-container-new-heading">Sign up</h2>
            <button className="modal-close-btn" onClick={() => closeModal()}>
                <i className="fa-solid fa-x"></i>
            </button>

        <ul>

        </ul>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email" placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required />
                {hasSubmitted && errors.email && (
                        <p className="errors">*{errors.email}</p>
                    )}
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
                type="text"
                id="username" placeholder="Enter your username (4 character minimum)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required />
                {hasSubmitted && errors.username && (
                        <p className="errors">*{errors.username}</p>
                    )}
          </div>
          <div className="form-group">
              <label htmlFor="firstname">First name</label>
              <input
                type="text"
                id="firstname"
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required />
            </div>
          <div className="form-group">
              <label htmlFor="lastname">Last name</label>
              <input
                type="text"
                id="lastname"
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required />
            </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                placeholder="Enter your password (6 character minimum)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required />
                {hasSubmitted && errors.password && (
                        <p className="errors">*{errors.password}</p>
                    )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmpassword">Confirm Password</label>
            <input
                type="password"
                id="confirmpassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required />
                {validationErrors.confirmation && (
                        <p className="errors">*{validationErrors.confirmation}</p>
                    )}
          </div>
          <div style={{height: "1vh"}}></div>
          <div className="form-group">
            <button type="submit">Sign up</button>
          </div>
        </form>
      </div>
    );
}
