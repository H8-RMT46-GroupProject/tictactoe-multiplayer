import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, update } from "firebase/database";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { firebaseConfig } from "../helpers/firebaseConfig";
import { UserContext } from "../UserContext";
import toast from "../utils/toast"

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
    if (!playerName.trim()) {
      toast({ message: "Player name is required", backgroundColor: "red" });
      return;
    }
    if (!room.trim()) {
      toast({ message: "Room code is required", backgroundColor: "red" });
      return;
    }

    get(ref(db, `rooms/${room}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        if (data[playerName]) {
          toast({ message: "Player name already taken", backgroundColor: "red" });
          return;
        }

        const createPlayer = {
          [playerName]: {
            turn: "O",
            winner: null,
            win: 0,
            lose: 0,
            draw: 0,
            role: "player2",
          },
        };

        if (Object.keys(snapshot.val()).length > 3) {
          createPlayer[playerName].role = "penonton";
          createPlayer[playerName].turn = "Z";
        }

        update(ref(db, `rooms/${room}`), createPlayer);
        setUser({
          name: playerName,
          room: room,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({ name: playerName, room })
        );
        toast({ message: `${playerName} has joined room ${room}`, backgroundColor: "green" })
        navigate("/dashboard");
      } else {
        toast({ message: "Room not found", backgroundColor: "red" });
      }
    });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <form onSubmit={handleJoin} style={{ textAlign: "center" }}>
          <label htmlFor="playerName">Player Name:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={handleOnChange}
            style={{ marginLeft: "0.5rem" }}
          /> <br /><br />
          <label htmlFor="room">Room Code:</label>
          <input type="text" id="room" value={room} onChange={handleOnChange} style={{ marginLeft: "0.5rem" }} /> <br /><br />
          <button class="btn btn-primary" type="submit">Join Room</button>
        </form> <br />
        <Link to="/">
          <button class="btn btn-danger">Cancel</button>
        </Link>
      </div>
    </>
  );
}
