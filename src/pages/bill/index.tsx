import { useParams } from 'react-router-dom';

function Bill() {
  const { groupId = "None" } = useParams<{ groupId: string }>();

  return (
    <>
      <h1>I am bill page</h1>
      <p>Group ID: {groupId}</p>
    </>
  );
}

export default Bill;
