import { createBrowserRouter } from "react-router-dom";
import RouteLayout from "../layouts/RouteLayout";
import CreateRoom from "../views/CreateRoom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout />,
    children: [],
  },
  {
    path: "/create",
    element: <CreateRoom />,
    children: [],
  },
]);
