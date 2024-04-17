import React, { useState, useEffect } from "react";
import styles from "./TodoList.module.css";

function TodoList() {
  const [userName, setUserName] = useState(""); //para almacenar el user creado
  const [input, setInput] = useState(""); // input que se esta escribiendo
  const [todoList, setTodoList] = useState([]); // para almacenar el array (task list) que se esta creando

  //creamos una funcion asicrona que estara creando un usuario en la api el cual utiliza el metodo post y creara un array vacio
  const crearUser = async () => {
    try {
      let response = await fetch(
        `https://playground.4geeks.com/contact/agendas/${userName}`,
        {
          method: "POST",
          body: JSON.stringify([]),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      let data = await response.json();
      console.log(data);
      setUserName(userName); // para actualizar el estado userName despues de crear el usuario
    } catch (error) {
      console.error(error.message);
    }
  };

  // evento del inputUserName
  const valueUserName = (e) => {
    setUserName(e.target.value);
    console.log(userName);
  };

  // se utiliza un useEffect para cargar todas las tareas que tiene el usuario asignado utilizamos el metodo GET para hacer la consulta a la api
  useEffect(() => {
    const fetchTodoList = async () => {
      try {
        if (userName) {
          let response = await fetch(
            `https://playground.4geeks.com/contact/agendas/${userName}/contacts`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
          }
          let data = await response.json();
          // Revisa la estructura de 'data' para entender cómo manejarla
          console.log(data);
          // Actualiza el estado basado en la estructura de 'data'
          setTodoList(data); // Supongamos que 'data' es un array directo de tareas
        }
      } catch (error) {
        console.error(error.message);
      }
    };
  
    fetchTodoList();
  }, [userName]); // Ejecutar el efecto cada vez que userName cambie

  // evento del inputTask
  const valueInput = (e) => {
    setInput(e.target.value);
    // console.log(input);
  };

  //hacemos un metodo POST para agregar todas las tareas a la api
  const addInput = async () => {
    let newInput = { name: input, phone: "", email: "", address: "" };
    try {
      let response = await fetch(
        `https://playground.4geeks.com/contact/agendas/${userName}/contacts`,
        {
          method: "POST",
          body: JSON.stringify(newInput),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to add task: ${response.statusText}`);
      }
      let data = await response.json();
      console.log(data);
      // Actualización del estado después de que se completa la solicitud
      setTodoList([...todoList, data]);
      // console.log(todoList)
      setInput("");
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };
  

  //eliminamos el usuario api con todas sus tareas
  const deleteAll = async () => {
    try {
      const response = await fetch(
        `https://playground.4geeks.com/contact/agendas/${userName}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!response.ok) {
        throw new Error(
          `No se pudieron recuperar los datos: ${response.statusText}`
        );
      }
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h1>ToDo List Fetch</h1>
        <input type="text" onChange={valueUserName}></input>
        <div className="input-group-append">
          <button
            onClick={crearUser}
            className="btn btn-outline-secondary"
            type="button"
          >
            Create userAPI
          </button>
          <button
            onClick={deleteAll}
            className="btn btn-outline-secondary"
            type="button"
          >
            delete userAPI
          </button>
        </div>
        <div className="input-group">
          <input
            type="text"
            value={input}
            onChange={valueInput}
            className="form-control"
            placeholder="create your task"
            aria-label="create your task"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button
              onClick={addInput}
              className="btn btn-outline-secondary"
              type="button"
            >
              add task
            </button>
          </div>
        </div>
        <ul className="list-group">
          {todoList.map((contenido, index) => {
            return (
              <li key={index} className="list-group-item">
                {contenido.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
