import { atom } from "recoil";

export const isLoggedinState = atom({
  key: "isLoggedIn",
  default: false,
});

export interface ITodo {
  id: number;
  text: string;
  images: string[];
  checked: boolean;
  createdAt: string;
}

export const todosState = atom<ITodo[]>({
  key: "todos",
  default: [],
});
