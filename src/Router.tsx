import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Header from "./Components/Header";
import Login from "./Routes/Login";
import Join from "./Routes/Join";
import Upload from "./Routes/Upload";
import Update from "./Routes/Update";
// import Update from "./Routes/Update1";

const Router = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="join" element={<Join />}></Route>
        <Route path="upload" element={<Upload />}></Route>
        <Route path="update/:id" element={<Update />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
