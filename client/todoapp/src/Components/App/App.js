import "./App.css";
import { useState, useRef, useEffect } from "react";

function Task(props) {
  const handleDeleteClick = async () => {
    const response = await fetch("http://localhost:3001/delete_task", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        SessionID: props.sessionid,
      },
      body: props._id,
    });
  };

  const handleDoneClick = async () => {
    const response = await fetch("http://localhost:3001/complete_task", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        SessionID: props.sessionid,
      },
      body: props._id,
    });
  };

  const style = props.done ? { color: "green" } : { color: "red" };
  const buttons = props.done ? (
    <div>
      {" "}
      <button onClick={handleDeleteClick}>Delete</button>
    </div>
  ) : (
    <div>
      {" "}
      <button onClick={handleDeleteClick}>Delete</button>{" "}
      <button onClick={handleDoneClick}>Done</button>
    </div>
  );

  return (
    <div className="Task" style={style}>
      <h2>{props.description}</h2>
      <h3>{props.dateCreated}</h3>
      {buttons}
    </div>
  );
}

function TaskList(props) {
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const descriptionInput = useRef(null);

  const handleAddClick = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3001/add_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        SessionID: props.sessionid,
      },
      body: JSON.stringify({
        description: descriptionInput.current.value,
        dateCreated: Date.now(),
      }),
    });

    if (response.ok) descriptionInput.current.value = "";
    else setMessage("Error while adding task");
  };

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
  }, [tasks]);

  return (
    <>
      <p className="Message">{message}</p>
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
      <div className="Tasks">
        {tasks.map((task) => {
          return (
            <Task key={task._id} {...task} sessionid={props.sessionid}></Task>
          );
        })}
      </div>
    </>
  );
}

function App() {
  const [sessionid, setSessionid] = useState(null);
  const [message, setMessage] = useState("");
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
    if (response.ok) response.text().then(setSessionid);
    else setMessage("Invalid input");
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
        <p className="Message">{message}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <TaskList sessionid={sessionid} />
    </div>
  );
}

export default App;
