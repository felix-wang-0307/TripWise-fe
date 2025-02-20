import React from "react";
import { useParams } from "react-router-dom";

function Travel() {
  const { groupId = "None" } = useParams<{ groupId: string }>();
  // 这样可以在URL中传递参数，例如：http://localhost:xxx/travel/123
  // 然后利用groupId向后端请求数据
  // 如有必要，需做权限校验
  return (
    <>
      <h1>I am travel page</h1>
      <p>Group ID: {groupId}</p>
    </>
  );
}

export default Travel;
