import { createBrowserRouter } from "react-router-dom";
import CreateRoom from "../views/CreateRoom";
import HomePage from "../views/HomePage";
import Dashboard from "../views/Dashboard";
import JoinRoom from "../views/JoinRoom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [],
  },
  {
    path: "/create",
    element: <CreateRoom />,
    children: [],
  },
  {
    path: "/join",
    element: <JoinRoom />,
    children: [],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [],
  },
]);
