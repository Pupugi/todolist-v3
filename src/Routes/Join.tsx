import styled from "styled-components";
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

export const Wrapper = styled.div`
  width: 500px;
  margin: 0 auto;
  margin-top: 5%;
  background-color: whitesmoke;
  height: 50vh;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1 {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 24px;
  }
  span {
    margin-bottom: 24px;
  }
`;

export const UserForm = styled.form`
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

export const ErrorMessage = styled.span`
  color: #e44b4b;
`;

function Join() {
  const [data, setData] = useState({ id: "", password: "" }); // 서버에 전송할 회원가입 정보
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // 서버에 회원가입 요청
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (data.password === password2) {
      const response = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/signup`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const result = await response.json();
      if (result.message === "성공") {
        alert("회원가입이 완료되었습니다. 로그인 해주세요.");
        navigate("../login"); // 회원가입 완료시 로그인 페이지로 이동
      } else {
        setErrorMessage("다시 시도해주세요.");
        return;
      }
      setErrorMessage("");
    } else {
      setErrorMessage("비밀번호를 확인해주세요."); // 비밀번호와 비밀번호 확인이 일치하지 않을 시
      return;
    }
  };

  return (
    <Wrapper>
      <h1>회원가입</h1>
      <ErrorMessage>{errorMessage}</ErrorMessage>
      <UserForm onSubmit={handleSubmit}>
        <input
          name="id"
          type="text"
          placeholder="아이디"
          required
          onChange={(e) => setData({ ...data, id: e.target.value })}
        />
        <input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <input
          name="password2"
          type="password"
          placeholder="비밀번호 확인"
          required
          onChange={(e) => setPassword2(e.target.value)}
        />
        <button>회원가입</button>
      </UserForm>
    </Wrapper>
  );
}

export default Join;
