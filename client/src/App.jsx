import { RouterProvider } from "react-router-dom";
import { router } from "./routers";
import { useState } from "react";
import { UserContext } from "./contexts/UserContext";

function App() {
  const [user, setUser] = useState({
    name: "",
    room: "",
    turn: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <RouterProvider router={router} />
    </UserContext.Provider>
  );
}

export default App;
