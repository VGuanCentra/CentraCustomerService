import React, { useState, useCallback, useEffect, useRef } from "react";
import cn from 'classnames';
import AuthenticationApi from "../../api/AuthenticationApi";
import styles from "./styles.module.scss";
// import Logo from "../../assets/images/blueLogo.webp";
import Logo from "../../../public/blueLogo.webp";
import useDevice from "../../hooks/useDevice";
// const imageUrl = require('../../../public/blueLogo.webp');

const Login = ({ onLogin }) => {
  const ref = useRef(null)
  const { isMobile } = useDevice();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState("");
  const isMobileV = useCallback(() => isMobile(), [])();

  const [logining, setLogining] = useState(false)

  useEffect(() => {
    ref.current.focus()
  }, [])
  

  const handleLogin = () => {
    doLogin();
  };

  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      handleLogin();
    }
  }

  const doLogin = async () => {
    try {
      setLogining(true)
      setErrors(null);
      const res = await AuthenticationApi.login({ username, password });
      onLogin(res);
      setLogining(false)
    } catch (error) {
      onLogin(null);
      setErrors(error.message);
      setLogining(false)
    }
  };

  return (
    <div className={cn(styles.root, isMobileV ? styles.mobile: '')}>
      {!isMobileV && (
        <div className={styles.left}>
          <span className={styles.title}>Welcome!</span> <br />
          Centra Portal User
        </div>
      )}

      <div className={styles.right}>
        <img className={styles.logo} src={Logo} />
        <input
          placeholder="username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
          ref = {ref}
        />
        <input
          placeholder="password"
          type="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className={styles.error}>{errors}</div>
        <button className={styles.button} onClick={handleLogin} disabled={logining}>
          login
        </button>
      </div>
    </div>
  );
};

export default Login;
