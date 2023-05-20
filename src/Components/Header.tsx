import { Link } from "react-router-dom";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { isLoggedinState } from "../atoms";

const HeaderBox = styled.div`
  margin-top: 72px;
  position: relative;
  display: flex;
  justify-content: center;
`;

const HeaderLinks = styled.div`
  position: absolute;
  display: flex;
  right: 16px;
  top: -36px;
  width: 30%;
  justify-content: space-evenly;
`;

const Logout = styled.button`
  position: absolute;
  right: 36px;
  top: -36px;
  font-size: 18px;
  background-color: white;
  border: none;
  cursor: pointer;
`;

const Title = styled.span`
  font-size: 38px;
  width: 100%;
  color: #17cba0;
`;

function Header() {
  const [isLoggedin, setIsLoggedin] = useRecoilState(isLoggedinState); // 로그인 상태관리
  //로그아웃 구현
  const handleClick = () => {
    setIsLoggedin(false);
    sessionStorage.clear(); // 세션스토리지에 저장된 로그인 정보 삭제
    window.location.reload(); // 로그아웃 후 페이지 새로고침 - 로그아웃 후에도 이전의 todolist가 남아있는것 방지
  };

  return (
    <HeaderBox>
      {/* 로그인인 경우와 아닌경우의 렌더링 */}
      {isLoggedin ? (
        <Logout onClick={handleClick}>Logout</Logout>
      ) : (
        <HeaderLinks>
          <Link to="login">Log In</Link>
          <Link to="join">Join</Link>
        </HeaderLinks>
      )}
      <Link to="/">
        <Title>Todo List</Title>
      </Link>
    </HeaderBox>
  );
}

export default Header;
