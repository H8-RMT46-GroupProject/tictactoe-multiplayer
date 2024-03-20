import { getDatabase, ref, update } from "firebase/database";
import { firebaseConfig } from "../helpers/firebaseConfig.js";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { UserContext } from "../contexts/UserContext";
import toast from "../utils/toast";

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
    if (!playerName.trim()) {
      toast({ message: "Player name is required", backgroundColor: "red" });
      return;
    }
    try {
      const room = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;

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
        turn: "X",
      });

      localStorage.setItem(
        "user",
        JSON.stringify({ name: playerName, room, turn: "X" })
      );

      toast({
        message: `${playerName} Room created`,
        backgroundColor: "green",
      });
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
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
          />{" "}
          <br />
          <br />
          <button
            className="btn btn-primary"
            style={{ marginLeft: "0.5rem" }}
            type="submit"
          >
            Create Room
          </button>
        </form>{" "}
        <br />
        <Link to="/">
          <button className="btn btn-danger">Cancel</button>
        </Link>
      </div>
    </>
  );
}
