import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, isLoggedinState, todosState } from "../atoms";
import TodoComponent from "../Components/TodoComponent";

const HomeBox = styled.div`
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ToUploadButton = styled.span`
  font-size: 22px;
  border: 1px solid;
  padding: 8px 48px;
`;

const TodoList = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function Home() {
  const jwt = sessionStorage.getItem("jwt"); // 세션스토리지에 저장된 jwt 가져오기
  const [todos, setTodos] = useRecoilState(todosState); // todos 상태관리
  const setIsLoggedin = useSetRecoilState(isLoggedinState); // 로그인 상태관리

  // jwt의 변화가 있을 때 마다 로그인 상태 업데이트
  useEffect(() => {
    jwt ? setIsLoggedin(true) : setIsLoggedin(false);
  }, [jwt, setIsLoggedin]);

  // 서버에서 todos 목록 가져오기
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/todos`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              accesstoken: jwt ? jwt : "",
            },
          }
        );
        const result = await response.json();
        setTodos(result.todos); // 가져온 목록 recoil로 업데이트
      } catch {
        return setTodos([]); // 로그인 실패하면 혹시 recoil에 남아있을 todolist 삭제
      }
    };
    jwt && fetchTodos(); // jwt가 없으면, 즉 로그인 상태가 아니라면 todolist 목록 가져오는 서버와의 통신을 시도하지 않음
  }, [jwt, setTodos]);

  return (
    <HomeBox>
      <Link to="upload">
        <ToUploadButton>Todo List 작성하기</ToUploadButton>
      </Link>
      <TodoList>
        {/* todos가 있다면 표시 */}
        {todos &&
          todos.map((todo: ITodo) => (
            <TodoComponent
              key={todo.id}
              todoId={todo.id}
              todoText={todo.text}
              todoImages={todo.images}
              todoChecked={todo.checked}
              todoCreatedAt={todo.createdAt}
              jwt={jwt}
            />
          ))}
      </TodoList>
    </HomeBox>
  );
}

export default React.memo(Home);
