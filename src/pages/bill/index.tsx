import { useParams } from 'react-router-dom';

function Bill() {
  const { groupid = "None" } = useParams<{ groupid: string }>();

  return (
    <>
      <h1>I am bill page</h1>
      <p>Group ID: {groupid}</p>
    </>
  );
}

export default Bill;
