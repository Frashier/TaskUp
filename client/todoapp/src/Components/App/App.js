import "./App.css";
import { useState, useRef, useEffect } from "react";

function TaskList(props) {
  const [tasks, setTasks] = useState([]);

  useEffect(async () => {
    const response = await fetch("http://localhost:3001/tasks", {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        SessionID: props.sessionid,
      },
    });
    const tasks = await response.text().then(JSON.parse);
    setTasks(tasks);
  }, []);

  return (
    <div>
      {tasks.map((task) => {
        return <h2 key={task._id}>{task.description}</h2>;
      })}
    </div>
  );
}

function App() {
  const [sessionid, setSessionid] = useState(null);
  const [message, setMessage] = useState("");
  const descriptionInput = useRef(null);
  const usernameInput = useRef(null);
  const passwordInput = useRef(null);

  const handleLoginClick = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput.current.value,
        password: passwordInput.current.value,
      }),
    });

    response.text().then(setSessionid);
  };

  const handleRegisterClick = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3001/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameInput.current.value,
        password: passwordInput.current.value,
      }),
    });

    if (response.ok) {
      setMessage("User registered");
    } else {
      setMessage("Error registering an user");
    }
  };

  const handleAddClick = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3001/add_task", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        SessionID: sessionid,
      },
      body: descriptionInput.current.value,
    });

    descriptionInput.current.value = "";
  };

  if (sessionid == null) {
    return (
      <div className="App">
        <form>
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
          <input type="submit" value="Login" onClick={handleLoginClick} />
          <input type="submit" value="Register" onClick={handleRegisterClick} />
        </form>
        <p className="message">{message}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="Toolbar">
        <form>
          <input
            type="text"
            ref={descriptionInput}
            id="description"
            name="description"
          />
          <input type="submit" value="Add task" onClick={handleAddClick} />
        </form>
      </div>
      <TaskList sessionid={sessionid} />
    </div>
  );
}

export default App;
