import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import fetchList from "../Helpers/fetchList";
import { DragDropContext } from "react-beautiful-dnd";
import initialData from "../initial-data";
import { v4 as uuid } from "uuid";
import Row from "../Components/Row";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;

export default function Edit() {
  const [title, setTitle] = useState(null);
  const [loading, setLoading] = useState(null);
  const [dragData, setDragData] = useState(initialData);
  const { listId } = useParams();

  console.log("**STATE**");
  console.log(dragData);

  useEffect(() => {
    const getListData = async () => {
      const list = await fetchList(listId);
      if (list) {
        // setList(list);
        // transfer list data to dragData
        let newDragData = dragData;
        newDragData.savedAlbums = list.albums;
        newDragData.rows["row-2"].albumIds = list.album_ids;
        setDragData(newDragData);
        setTitle(list.title);
        setLoading(false);

        // set title of component through list
        // console.log(list);
      }
    };
    getListData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const searchInput = e.currentTarget.elements.searchInput.value;
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
    <div>
      <h1>Edit - {title ? title : null}</h1>
      {loading ? <span>Loading</span> : null}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search album or artist.."
          name="searchInput"
        ></input>
        <button className="btn-primary" type="submit">
          Submit
        </button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          {title ? <h1>list retrieved</h1> : null}
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
