import { getDatabase, ref, update } from "firebase/database";
import { firebaseConfig } from "../helpers/firebaseConfig.js";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { UserContext } from "../UserContext";

export default function CreateRoom() {
  const [playerName, setPlayerName] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const handleOnChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const room = Math.floor(Math.random() * 10000);

    const createRoom = {
      [room]: {
        xIsNext: true,
        player1: {
          turn: "X",
          winner: null,
          win: 0,
          lose: 0,
          draw: 0,
          role: "player1",
          name: playerName,
        },
        squares: {
          10: 0,
        },
      },
    };

    update(ref(db, "rooms"), createRoom);
    setUser({
      name: playerName,
      room: room,
    });

    localStorage.setItem("user", JSON.stringify({ name: playerName, room }));
    navigate("/dashboard");
  };

  return (
    <>
      <form onSubmit={handleCreate}>
        <input
          type="text"
          id="playerName"
          value={playerName}
          onChange={handleOnChange}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
