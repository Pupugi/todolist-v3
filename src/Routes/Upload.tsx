import styled from "styled-components";
import { useState, ChangeEvent, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Wrapper } from "./Join";
import { useRecoilState } from "recoil";
import { isLoggedinState } from "../atoms";

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

const Message = styled.div`
  color: #e44b4b;
  text-align: center;
  margin-top: 48px;
  font-size: 18px;
`;

interface IData {
  text: string;
  checked: boolean;
  images: string[];
}

function Upload() {
  // 업로드 할 데이터
  const [data, setData] = useState<IData>({
    text: "",
    checked: false,
    images: [],
  });

  const [isLoggedin, setIsLoggedin] = useRecoilState(isLoggedinState);
  const navigate = useNavigate();
  const jwt = sessionStorage.getItem("jwt");

  // 업로드 정보 서버와 통신
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/todo`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        accesstoken: jwt ? jwt : "",
      },
    });
    const result = await response.json();
    if (result.message === "성공") {
      navigate("/"); // 업로드 성공 시 홈으로 redirect
    }
  };

  useEffect(() => {
    jwt ? setIsLoggedin(true) : setIsLoggedin(false);
  }, [jwt, setIsLoggedin]); // 업로드 페이지에서 새로고침 시 로그아웃으로 표시되는 현상 방지

  // 이미지파일 선택되면 서버에 업로드하고 url 받아오기
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
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
      setData({ ...data, images: result.imageUrls }); // 받아온 url 업로드할 data에 저장
    } else {
      return;
    }
  };

  return (
    <>
      {isLoggedin ? (
        <Wrapper>
          <h1>Todo List 작성하기</h1>
          <ContentForm onSubmit={handleSubmit}>
            <input
              name="todo"
              type="text"
              placeholder="Todo List 작성"
              required
              onChange={(e) => setData({ ...data, text: e.target.value })}
            />
            <input
              name="image"
              type="file"
              onChange={handleChange}
              multiple
              accept="image/*"
            />
            <button>작성완료</button>
          </ContentForm>
        </Wrapper>
      ) : (
        <Message>로그인 먼저 해주세요.</Message>
      )}
    </>
  );
}

export default Upload;
