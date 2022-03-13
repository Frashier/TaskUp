import "./App.css";
import { useState, useRef } from "react";

function App() {
  const [sessionid, setSessionid] = useState(null);
  const usernameInput = useRef(null);
  const passwordInput = useRef(null);

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput.current.value,
        password: passwordInput.current.value,
      }),
    })
      .then((response) => response.text())
      .then((response) => setSessionid(response));
  };

  if (sessionid == null) {
    return (
      <div className="App">
        <form onSubmit={handleLoginSubmit}>
          <label for="username">Username:</label>
          <br />
          <input
            ref={usernameInput}
            type="text"
            id="username"
            name="username"
          />
          <br />
          <label for="password">Password:</label>
          <br />
          <input
            ref={passwordInput}
            type="password"
            id="password"
            name="password"
          />
          <br />
          <input type="submit" value="Login" />
        </form>
      </div>
    );
  }

  return <div className="App">{sessionid}</div>;
}

export default App;
