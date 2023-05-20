import styled from "styled-components";
import { useState, ChangeEvent, useEffect, FormEvent, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Wrapper } from "./Join";
import { useRecoilState, useSetRecoilState } from "recoil";
import { isLoggedinState, todosState } from "../atoms";
import { TodoImage, TodoImageBox } from "../Components/TodoComponent";

const ContentForm = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  input {
    margin-bottom: 24px;
    width: 300px;
    height: 36px;
  }
  button {
    width: 120px;
    height: 36px;
    cursor: pointer;
  }
`;

const SelectFileLabel = styled.label`
  cursor: pointer;
  margin: 20px 0px;
`;

const UpdateImageBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span {
    cursor: pointer;
    font-size: 18px;
  }
`;

interface IData {
  text: string;
  checked: boolean;
  images: string[];
}

function Update() {
  const [todos, setTodos] = useRecoilState(todosState);
  const todoId = useParams().id;
  const setIsLoggedin = useSetRecoilState(isLoggedinState);
  const foundIndex = todos.findIndex((todo) => todo.id.toString() === todoId);
  // 수정하기 페이지에서 새로고침시 targetTodo가 undefined라서 발생하는 에러 방지
  const targetTodo = useMemo(() => {
    return (
      todos[foundIndex] || {
        text: "",
        checked: false,
        images: [],
      }
    );
  }, [todos, foundIndex]);
  // immutable인 todos 대신 새로운 state에 todo를 저장하여 변환하고 업로드하기 쉽게 만듦
  const [data, setData] = useState<IData>({
    text: "",
    checked: false,
    images: [],
  });
  const navigate = useNavigate();
  const jwt = sessionStorage.getItem("jwt");

  // 서버에 업데이트한 정보 통신
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/todo/${todoId}`,
      {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          accesstoken: jwt ? jwt : "",
        },
      }
    );
    const result = await response.json();
    if (result.message === "성공") {
      navigate("/");
    }
  };

  // 사진 선택 후에 파일 선택 요소 초기화 하기 위한 함수
  // 파일을 추가했다가 X를 눌러 지우고 다시 같은 파일을 추가하려고 할 때 작동하지 않는 버그 방지
  const handleResetFileInput = () => {
    const fileInput = document.getElementById("image") as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  // 사진 추가로 업로드
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    // 이미지파일 업로드 형식에 맞추기
    const files = Array.from(e.target.files || []);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/images`, {
      method: "POST",
      body: formData,
      headers: {
        accesstoken: jwt ? jwt : "",
      },
    });
    const result = await response.json();
    if (result.message === "성공") {
      const newImages = [...targetTodo.images, ...result.imageUrls];
      const updatedTodo = {
        ...targetTodo,
        images: newImages,
      };
      // immutable 관련 에러 방지, recoil과 state에 추가한 이미지 업데이트
      const updatedTodos = [...todos];
      updatedTodos[foundIndex] = updatedTodo;
      setData((prevData) => ({ ...prevData, images: newImages }));
      setTodos(updatedTodos);
    } else {
      return;
    }
    handleResetFileInput(); // 사진 선택 후에 파일 선택 요소 초기화
  };

  // 처음 수정페이지에 들어왔을 때 text부분이 비어있는 현상 방지
  useEffect(() => {
    setData({
      text: targetTodo.text,
      checked: targetTodo.checked,
      images: [...targetTodo.images],
    });
  }, [targetTodo]);

  // 수정페이지에서 새로고침 시 로그아웃으로 표시되는 현상 방지
  useEffect(() => {
    jwt ? setIsLoggedin(true) : setIsLoggedin(false);
  }, [jwt, setIsLoggedin]);

  // 선택된 사진 state와 recoil에서 삭제
  const handleRemoveImage = (image: string) => {
    const updatedImages = targetTodo.images.filter((img) => img !== image);
    const updatedTodo = { ...targetTodo, images: updatedImages };
    const updatedTodos = [...todos];
    updatedTodos[foundIndex] = updatedTodo;
    setTodos(updatedTodos);
    setData({ ...data, images: updatedImages });
  };

  return (
    <Wrapper>
      <h1>Update1 실험</h1>
      <ContentForm onSubmit={handleSubmit}>
        <input
          name="todo"
          type="text"
          placeholder="Todo List 작성"
          required
          value={data.text}
          onChange={(e) => setData({ ...data, text: e.target.value })}
        />
        <TodoImageBox>
          {targetTodo.images.length > 0 &&
            targetTodo.images.map((image) => (
              <UpdateImageBox key={image}>
                <TodoImage
                  src={`${process.env.REACT_APP_SERVER_URL}/${image}`}
                />
                <span onClick={() => handleRemoveImage(image)}>X</span>
              </UpdateImageBox>
            ))}
        </TodoImageBox>
        <SelectFileLabel htmlFor="image">
          {/* input type=file은 커스터마이징 하기가 어렵다. 따라서 input은 display none 하고 우회해서 label로 커스터마이징 한다 */}
          <span>사진 추가</span>
          <input
            id="image"
            name="image"
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            style={{ display: "none" }}
          />
        </SelectFileLabel>
        <button>작성완료</button>
      </ContentForm>
    </Wrapper>
  );
}

export default Update;
