import { createContext, useState } from "react";

export const UserContext = createContext({
  user: {
    name: "",
    room: "",
    turn: "",
  },
  setUser: () => {},
});

export function UserProvider({ children }) {
  const [user, setUser] = useState({
    name: "",
    room: "",
    turn: "",
  });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
