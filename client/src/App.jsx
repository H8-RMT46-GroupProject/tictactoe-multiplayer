import { RouterProvider } from "react-router-dom";
import { router } from "./routers";
import { UserProvider } from "./contexts/UserContext.jsx";

function App() {
  return (
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  );
}

export default App;
