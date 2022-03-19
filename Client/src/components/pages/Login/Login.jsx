import { CircularProgress } from "@material-ui/core";
import React, { useContext, useRef } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { loginCall } from "../../../apiCalls";
import { AuthContext } from "../../../Context/AuthContext";
import styles from "./login.module.scss";

const Login = () => {
  const username = useRef();
  const password = useRef();
  const { isFetching, error, dispatch } = useContext(AuthContext);

  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { username: username.current.value, password: password.current.value },
      "https://metabook-by-mahbub-server.herokuapp.com/api/auth/login",
      history,
      from,
      dispatch
    );
  };

  return (
    <div className={styles.login}>
      <div className={styles.loginWrapper}>
        <div className={styles.loginLeft}>
          <h4 className={styles.loginLogo}>MetaBook</h4>
          <span className={styles.loginDesc}>
            Connect with friends and the world around you on MetaBook.
          </span>
        </div>
        <div className={styles.loginRight}>
          <form onSubmit={handleClick} className={styles.loginBox}>
            <p style={{ color: "red" }}>
              {error && "Please check your credential"}
            </p>
            <input
              ref={username}
              type="username"
              placeholder="Username"
              minLength="4"
              maxLength="20"
              className={styles.loginInput}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className={styles.loginInput}
              minLength="6"
              ref={password}
              required
            />
            <button
              type="submit"
              className={styles.loginButton}
              disabled={isFetching ? true : false}
            >
              {isFetching ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                "Log In"
              )}
            </button>
            <hr />
            <Link
              to={isFetching ? "" : "/register"}
              className={styles.loginRegisterButton}
            >
              {isFetching ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                "Create a new Account"
              )}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
