import React, { useState, useEffect } from "react";
import fetchUserLists from "../Helpers/fetchUserLists";
import createList from "../Helpers/createList";
import deleteList from "../Helpers/deleteList";

export default function Lists(props) {
  const [lists, setLists] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = props;

  useEffect(() => {
    fetchUserLists(setLists, setLoading);
  }, []);

  const goToEdit = (list) => {
    props.history.push({ pathname: `edit/${list.list_id}` });
  };

  return (
    <div className="Lists">
      <h1>Lists Page</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <button onClick={() => createList(user, props.history)}>
            Create New List
          </button>
          {lists.map((list, index) => (
            <div key={index}>
              <h2 onClick={() => goToEdit(list)}>
                {list.list_id}: {list.title}
              </h2>
              <button onClick={() => deleteList(list, setLists, setLoading)}>
                Delete List
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
