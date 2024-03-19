import { createBrowserRouter } from "react-router-dom";
import RouteLayout from "../layouts/RouteLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout />,
    children: [],
  },
]);
