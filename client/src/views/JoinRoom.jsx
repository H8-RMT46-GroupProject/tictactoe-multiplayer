import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, update } from "firebase/database";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../helpers/firebaseConfig";
import { UserContext } from "../UserContext";

export default function JoinRoom() {
  const [playerName, setPlayerName] = useState("");
  const [room, setRoom] = useState("");
  const { setUser } = useContext(UserContext);
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const navigate = useNavigate();

  const handleOnChange = (e) => {
    if (e.target.id === "playerName") {
      setPlayerName(e.target.value);
    } else {
      setRoom(e.target.value);
    }
  };

  const handleJoin = (e) => {
    e.preventDefault();

    get(ref(db, `rooms/${room}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        if (data.player2) {
          alert("Player 2 already exists");
          return;
        }

        const createPlayer = {
          player2: {
            turn: "O",
            winner: null,
            win: 0,
            lose: 0,
            draw: 0,
            role: "player2",
            name: playerName,
          },
        };

        update(ref(db, `rooms/${room}`), createPlayer);
        setUser({
          name: playerName,
          room: room,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({ name: playerName, room })
        );
        navigate("/dashboard");
      } else {
        alert("Room not found");
      }
    });
  };

  return (
    <>
      <form onSubmit={handleJoin}>
        <input
          type="text"
          id="playerName"
          value={playerName}
          onChange={handleOnChange}
        />
        <input type="text" id="room" value={room} onChange={handleOnChange} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}
