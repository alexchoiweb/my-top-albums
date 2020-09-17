import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

const Container = styled.div`
  border: 1px solid lightgrey;
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? "lightgreen" : "white")};
`;

export default class Album extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.album.id} index={this.props.index}>
        {(provided, snapshot) => (
          <Container
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            isDragging={snapshot.isDragging}
          >
            <img src={this.props.album.url} alt="" />
            {this.props.album.title} - {this.props.album.artist}
          </Container>
        )}
      </Draggable>
    );
  }
}
