import React, { useEffect, useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
import "./NewLoginForm.css";


export default function NewLoginForm() {
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
    return (<div className="login-container-new">
    <h2 className="login-container-new-heading">Log in</h2>
    <button className="modal-close-btn" onClick={() => closeModal()}>
                <i className="fa-solid fa-x"></i>
            </button>
    <form onSubmit={handleSubmit}>
    <ul style={{marginBottom: "15px"}}>
        {errors.map((error, idx) => (
            <li className="errors" key={idx}>
                {error}
            </li>
            )
        )}
    </ul>
      <div className="form-group">
        <label htmlFor="credential">Username or Email:</label>
        <input
            type="text"
            id="credential"
            placeholder="Enter your username or email"
            onChange={e => setCredential(e.target.value)}
            required />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password:</label>
        <input
            type="password"
            id="password"
            placeholder="Enter your password"
            onChange={e => setPassword(e.target.value)}
            required />
      </div>
      <div className="form-group">
        <button disabled={credential.length === 0 && password.length === 0} type="submit">Log In</button>
        <button onClick={handleDemoLogin} className="login-alt-color">Demo User</button>
      </div>
    </form>
  </div>)

}
