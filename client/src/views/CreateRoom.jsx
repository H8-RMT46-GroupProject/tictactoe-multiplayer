import { getDatabase, ref, update } from "firebase/database";
import { firebaseConfig } from "../helpers/firebaseConfig.js";
import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { UserContext } from "../UserContext";
import toast from "../utils/toast"

export default function CreateRoom() {
  const [playerName, setPlayerName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  useEffect(() => {
    const room = Math.floor(Math.random() * 10000);
    setRoomNumber(room.toString());
  }, []);

  const handleOnChange = (e) => {
    setPlayerName(e.target.value);
  };

  const handleCreate = (e) => {
    e.preventDefault();
    if (!playerName.trim()) {
      toast({ message: "Player name is required", backgroundColor: "red" });
      return;
    }
    try {
      const createRoom = {
        [roomNumber]: {
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
        room: roomNumber,
      });

      localStorage.setItem("user", JSON.stringify({ name: playerName, room: roomNumber }));
      toast({ message: `${playerName} Room created`, backgroundColor: "green" })
      navigate("/dashboard");
    } catch (error) {
      console.log(error)
    }
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
        <form onSubmit={handleCreate} style={{ textAlign: "center" }}>
          <label htmlFor="playerName">Player Name:</label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={handleOnChange}
            style={{ marginLeft: "0.5rem" }}
          /> <br /><br />
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "0.5rem" }}>Room Code:</div>
            <div>{roomNumber}</div>
          </div> <br />
          <button className="btn btn-primary" style={{ marginLeft: "0.5rem" }} type="submit">Create Room</button>
        </form> <br />
        <Link to="/">
          <button className="btn btn-danger">Cancel</button>
        </Link>
      </div>
    </>
  );
}
