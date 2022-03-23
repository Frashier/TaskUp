import "./App.css";
import { useState, useRef, useEffect } from "react";

function Task(props) {
  const [checked, setChecked] = useState(props.done);

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

  const handleCheckboxClick = async () => {
    const newValue = !checked;
    const response = await fetch("http://localhost:3001/complete_task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        SessionID: props.sessionid,
      },
      body: JSON.stringify({
        _id: props._id,
        done: newValue,
      }),
    });
    setChecked(newValue);
  };
  const dateOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  return (
    <div className="taskList-task">
      <div className="taskList-task-header">
        <h3 style={{ color: "lightgray", marginBottom: "0" }}>Task</h3>
        <p>
          {new Date(props.dateCreated).toLocaleDateString("en-US", dateOptions)}
        </p>
      </div>
      <p style={{ fontSize: "30px", marginTop: 0 }}>{props.description}</p>
      <div className="taskList-task-bottom">
        <label className="container">
          Done
          <input
            type="checkbox"
            id="done"
            name="done"
            checked={checked}
          ></input>
          <span onClick={handleCheckboxClick} className="checkmark"></span>
        </label>
        <button className="deleteButton" onClick={handleDeleteClick}>
          X
        </button>
      </div>
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

    if (response.ok) {
      descriptionInput.current.value = "";
      setMessage("Task added");
    } else setMessage(await response.text());
  };

  useEffect(async () => {
    const response = await fetch(
      "http://localhost:3001/tasks",
      {
        method: "GET",
        headers: {
          "Content-Type": "text/plain",
          SessionID: props.sessionid,
        },
      },
      []
    );
    let tasks = await response.text().then(JSON.parse);
    tasks.sort((a, b) => a.dateCreated < b.dateCreated);
    tasks.sort((a, b) => a.done > b.done);
    setTasks(tasks);
  }, [tasks]);

  return (
    <div className="taskList">
      <div className="taskList-toolbar">
        <form className="taskList-toolbar-form">
          <input
            type="text"
            ref={descriptionInput}
            id="description"
            name="description"
            placeholder="Add task..."
          />
          <button onClick={handleAddClick}>+</button>
        </form>
        <p className="taskList-toolbar-message">{message}</p>
      </div>
      <div className="taskList-tasks">
        {tasks.map((task) => {
          return (
            <Task key={task._id} {...task} sessionid={props.sessionid}></Task>
          );
        })}
      </div>
    </div>
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
    else setMessage(await response.text());
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
      setMessage(await response.text());
    }
  };

  if (sessionid == null) {
    return (
      <div className="app">
        <div className="login">
          <form className="login-input">
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
            <div className="login-input-buttons">
              <button onClick={handleLoginClick}>Login</button>
              <button onClick={handleRegisterClick}>Register</button>
            </div>
          </form>
          <p className="login-message">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <TaskList sessionid={sessionid} />
    </div>
  );
}

export default App;
