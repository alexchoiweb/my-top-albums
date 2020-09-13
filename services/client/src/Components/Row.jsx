import React from "react";
import styled from "styled-components";
import Album from "./Album";
import { Droppable } from "react-beautiful-dnd";

const Container = styled.div`
  margin: 8px;
  border: 1px solid lightgrey;
  border-radius: 2px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;
const Title = styled.h3`
  padding: 8px;
`;
const AlbumList = styled.div`
  padding; 8px;
  background-color: ${(props) => (props.isDraggingOver ? "skyblue" : "white")};
  display:flex;
`;

export default class Row extends React.Component {
  render() {
    return (
      <Container className="Row">
        <Title>{this.props.row.title}</Title>
        <Droppable droppableId={this.props.row.id} direction="horizontal">
          {(provided, snapshot) => (
            <AlbumList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}
            >
              {this.props.albums.map((album, index) => (
                <Album key={album.id} album={album} index={index} />
              ))}
              {provided.placeholder}
            </AlbumList>
          )}
        </Droppable>
      </Container>
    );
  }
}
