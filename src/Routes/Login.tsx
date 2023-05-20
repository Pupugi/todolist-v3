import { useState, FormEvent } from "react";
import { ErrorMessage, UserForm, Wrapper } from "./Join";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { isLoggedinState } from "../atoms";

function Login() {
  const [data, setData] = useState({ id: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggedin, setIsLoggedin] = useRecoilState(isLoggedinState);
  const navigate = useNavigate();

  // 서버와 로그인 정보 통신
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/login`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    if (result.message !== "성공") {
      setErrorMessage("다시 시도해주세요.");
      return;
    }
    setErrorMessage("");
    sessionStorage.setItem("id", data.id);
    sessionStorage.setItem("jwt", result.token); // 로그인 정보 저장
    setIsLoggedin(true);
    navigate("/"); // 로그인 완료 시 홈으로 redirect
  };

  return (
    <>
      {/* 이미 로그인 한 유저는 다시 시도 못하게 방지 */}
      {isLoggedin ? (
        <span>이미 로그인 되어 있습니다.</span>
      ) : (
        <Wrapper>
          <h1>로그인</h1>
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
            <button>로그인</button>
          </UserForm>
        </Wrapper>
      )}
    </>
  );
}

export default Login;
