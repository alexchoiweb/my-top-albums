import React, { useState, useRef } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import styled from "styled-components";
import initialData from "./initial-data";
import Row from "./Components/Row";
import { v4 as uuid } from "uuid";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;

fetch("http://localhost:5000/users")
  .then((res) => res.json())
  .then((data) => {
    console.log("Fetching users data");
    console.log(data);
  });

const addUser = async () => {
  console.log("Add User clicked");
  try {
    const body = {
      username: "Hello",
      first_name: "Goodbye",
      last_name: "Moonbeam",
      email: "HelloMoon@gmail.com",
    };
    const res = await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    window.location = "/";
  } catch (err) {
    console.error(err.message);
  }
};

export default function App() {
  const [dragData, setDragData] = useState(initialData);
  const [searchInput, setSearchInput] = useState(null);

  console.log("**STATE**");
  console.log(dragData);

  const searchRef = useRef(null);

  const searchAlbums = (searchInput) => {
    const url = `${process.env.REACT_APP_ROOT_URL}?method=album.search&album=${searchInput}&api_key=${process.env.REACT_APP_API_KEY}&format=json`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(`%cLog Data`, "color: orange");
        console.log(data);
        let albums = data.results.albummatches.album;

        //update dragData albums with new album data
        //update dragData row-1 with new albumIds
        let newAlbums = {};
        const newAlbumIds = [];
        for (let i = 0; i < 4; i++) {
          const album = albums[i];
          const id = uuid();
          newAlbums[id] = {
            id: id,
            url: album.image[2]["#text"],
            title: album.name,
            artist: album.artist,
          };
          newAlbumIds.push(id);
        }

        const newDragData = {
          ...dragData,
          albums: newAlbums,
          rows: {
            ...dragData.rows,
            "row-1": {
              id: "row-1",
              title: "Search Results",
              albumIds: newAlbumIds,
            },
          },
        };

        setDragData(newDragData);
      });
    searchRef.current.value = "";
    setSearchInput(searchRef.current.value);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination == null) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    if (destination.droppableId === "row-1") return;

    const start = dragData.rows[source.droppableId];
    const finish = dragData.rows[destination.droppableId];

    // rearranging in same row
    if (start === finish) {
      const newAlbumIds = Array.from(start.albumIds);
      newAlbumIds.splice(source.index, 1);
      newAlbumIds.splice(destination.index, 0, draggableId);

      const newRow = {
        ...start,
        albumIds: newAlbumIds,
      };

      const newDragData = {
        ...dragData,
        rows: {
          ...dragData.rows,
          [newRow.id]: newRow,
        },
      };

      setDragData(newDragData);
      // call endpoint after performing this update to let server/db know that a re-order has occurred.
    }
    // moving from one row to another
    else {
      // update albums - remove album
      // update row-1.albumIds - remove albumId
      // update savedAlbums - add album
      // update row-2.albumIds - add albumId

      const newAlbums = dragData.albums;
      let draggedAlbum;
      for (let key in newAlbums) {
        if (newAlbums[key].id === draggableId) {
          draggedAlbum = newAlbums[key];
          delete newAlbums[key];
        }
      }

      const newSavedAlbums = dragData.savedAlbums;
      newSavedAlbums[draggableId] = draggedAlbum;
      console.log(newSavedAlbums);

      const startAlbumIds = Array.from(start.albumIds);
      startAlbumIds.splice(source.index, 1);

      const newStart = {
        ...start,
        albumIds: startAlbumIds,
      };

      const finishAlbumIds = Array.from(finish.albumIds);
      finishAlbumIds.splice(destination.index, 0, draggableId);
      const newFinish = {
        ...finish,
        albumIds: finishAlbumIds,
      };

      const newDragData = {
        ...dragData,
        rows: {
          ...dragData.rows,
          [newStart.id]: newStart,
          [newFinish.id]: newFinish,
        },
      };
      setDragData(newDragData);
    }
  };

  return (
    <div className="App col-12">
      <button onClick={addUser}>Add User</button>
      <h1>my-top-albums</h1>
      <input
        ref={searchRef}
        type="text"
        placeholder="Search album or artist.."
        onChange={() => setSearchInput(searchRef.current.value)}
      ></input>
      <button
        className="btn-primary"
        onClick={() => {
          searchAlbums(searchInput);
        }}
      >
        Submit
      </button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          {dragData.rowOrder.map((rowId) => {
            const row = dragData.rows[rowId];
            let albums;
            if (rowId === "row-1") {
              albums = row.albumIds.map((albumId) => dragData.albums[albumId]);
            } else {
              albums = row.albumIds.map(
                (albumId) => dragData.savedAlbums[albumId]
              );
            }
            return <Row key={row.id} row={row} albums={albums} />;
          })}
        </Container>
      </DragDropContext>
    </div>
  );
}
