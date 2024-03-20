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
        [playerName]: {
          turn: "X",
          winner: null,
          win: 0,
          lose: 0,
          draw: 0,
          role: "player1",
        },
        squares: {
          0: "null",
          1: "null",
          2: "null",
          3: "null",
          4: "null",
          5: "null",
          6: "null",
          7: "null",
          8: "null",
        },
      },
    };

    update(ref(db, "rooms"), createRoom);
    setUser({
      name: playerName,
      room: room,
    });
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