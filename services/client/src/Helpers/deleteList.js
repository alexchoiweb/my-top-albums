import fetchUserLists from './fetchUserLists'

const deleteList = async (list, setLists, setLoading) => {
  const listId = list.list_id;
  await fetch(`/api/lists/delete/${listId}`, {
    method: "DELETE",
  })
  fetchUserLists(setLists, setLoading)
}

export default deleteList;