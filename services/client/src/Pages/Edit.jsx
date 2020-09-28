import React from "react";
import { useParams } from "react-router-dom";

export default function Edit(props) {
  const { listId } = useParams();

  return (
    <div>
      <h1>Edit - List#{listId}</h1>
    </div>
  );
}
