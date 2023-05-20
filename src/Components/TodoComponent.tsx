import React, { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { todosState } from "../atoms";

const TodoBox = styled.div`
  display: flex;
  background-color: #eee6e6;
  justify-content: center;
  align-items: center;
  width: 600px;
  height: 80px;
  border-radius: 10px;
  margin-bottom: 30px;
  padding: 10px;
  a {
    width: 50px;
    font-size: 16px;
    margin-right: 5px;
  }
`;

const Checkbox = styled.input`
  margin-right: 20px;
`;

const CreatedAtBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const CreatedAtDate = styled.span`
  font-size: 12px;
  margin-bottom: 5px;
`;

const CreatedAtTime = styled.span`
  font-size: 14px;
`;

const TodoText = styled.span`
  font-size: 18px;
  margin-right: auto;
  width: 400px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const TodoImageBox = styled.div`
  display: flex;
  align-items: center;
  margin: 0px 20px;
`;

export const TodoImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
`;

const DeleteButton = styled.span`
  cursor: pointer;
  width: 50px;
  font-size: 16px;
  margin-right: 5px;
`;

interface ITodoProps {
  todoId: number;
  todoText: string;
  todoImages: string[];
  todoChecked: boolean;
  todoCreatedAt: string;
  jwt: string | null;
}

const TodoComponent = ({
  todoId,
  todoText,
  todoImages,
  todoChecked,
  todoCreatedAt,
  jwt,
}: ITodoProps) => {
  const [todos, setTodos] = useRecoilState(todosState); // todo 상태관리

  // 체크박스 변동사항 서버와 recoil에 업데이트. 현재 작동하지 않음.(서버문제 추정)
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    const newTodos = [...todos];
    newTodos[todoId] = {
      ...newTodos[todoId],
      checked: newChecked,
    };
    setTodos(newTodos);
    console.log(newTodos);
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/todo/${todoId}`,
      {
        method: "PUT",
        body: JSON.stringify(newTodos),
        headers: {
          "Content-Type": "application/json",
          accesstoken: jwt ? jwt : "",
        },
      }
    );
    const result = await response.json();
    console.log(result);
    console.log(newTodos);
  };

  // 투두 삭제 기능
  const onDeleteClick = async () => {
    if (jwt) {
      await fetch(
        `http://ec2-43-201-61-254.ap-northeast-2.compute.amazonaws.com/todo/${todoId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            accesstoken: jwt,
          },
        }
      );
      // 삭제요청의 응답엔 성공/실패만 답한다.
      // 서버에 한번 더 목록요청을 해서 연결하는 것 보다 recoil을 통해 자체적으로 최신화를 한다.
      const newTodos = [...todos]; //mutation 에러 방지
      newTodos.splice(todoId, 1); // 투두 삭제
      setTodos(newTodos); // recoil 업데이트
    } else {
      return;
    }
  };

  return (
    <TodoBox key={todoId}>
      <Checkbox type="checkbox" checked={todoChecked} onChange={handleChange} />
      <CreatedAtBox>
        <CreatedAtDate>
          {todoCreatedAt.split("T")[0].substring(2)}
        </CreatedAtDate>
        <CreatedAtTime>
          {todoCreatedAt.split("T")[1].split(".")[0]}
        </CreatedAtTime>
      </CreatedAtBox>
      <TodoImageBox>
        {/* 표시할 사진이 있을경우 표시 */}
        {todoImages.length > 0 &&
          todoImages.map((image) => (
            <TodoImage
              key={image}
              src={`${process.env.REACT_APP_SERVER_URL}/${image}`}
            />
          ))}
      </TodoImageBox>
      <TodoText>{todoText}</TodoText>
      <Link to={`update/${todoId}`}>
        <span>수정</span>
      </Link>
      <DeleteButton onClick={onDeleteClick}>삭제</DeleteButton>
    </TodoBox>
  );
};

export default React.memo(TodoComponent);
