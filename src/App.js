import { useState, useEffect } from "react";
import "./App.css"; // Keep your custom styles here
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

function App() {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState(0);
  const [users, setUsers] = useState([]);
  const usersCollectionRef = collection(db, "users");

  const createUser = async () => {
    await addDoc(usersCollectionRef, { name: newName, age: Number(newAge) });
    setNewName(""); // Clear input after adding
    setNewAge(0);
  };

  const updateUser = async (id, age) => {
    const userDoc = doc(db, "users", id);
    const newFields = { age: age + 1 };
    await updateDoc(userDoc, newFields);
  };

  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
  };

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }); // Add an empty dependency array to run once

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Management</h1>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Name..."
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Age..."
          value={newAge}
          onChange={(event) => setNewAge(event.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" onClick={createUser}>
            Create User
          </button>
        </div>
      </div>

      <div className="row">
        {users.map((user) => {
          return (
            <div className="col-md-4 mb-4" key={user.id}>
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Name: {user.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Age: {user.age}</h6>
                  <button
                    className="btn btn-warning mr-2"
                    onClick={() => updateUser(user.id, user.age)}
                  >
                    Increase Age
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => deleteUser(user.id)}
                  >
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
