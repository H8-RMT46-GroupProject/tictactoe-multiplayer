import { getDatabase, ref, update } from "firebase/database";
import { firebaseConfig } from "../helpers/firebaseConfig.js";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { UserContext } from "../UserContext";
import toast from "../utils/toast"
import Image from "../images/vecteezy_abstract-geometric-background-of-fluid-liquid-and-dynamic_23514200-1.jpg"

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
    let trimmedPlayerName = playerName.trim();
    if (!trimmedPlayerName) {
      toast({ message: "Player name is required", backgroundColor: "red" });
      return;
    }
    if (trimmedPlayerName.length > 10) {
      trimmedPlayerName = trimmedPlayerName.substring(0, 10);
    }
    try {
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
          name: trimmedPlayerName,
        },
        squares: {
          10: 0,
        },
      },
    };

    update(ref(db, "rooms"), createRoom);
    setUser({
      name: trimmedPlayerName,
      room: room,
    });

    localStorage.setItem("user", JSON.stringify({ name: trimmedPlayerName, room }));
    toast({ message: `${trimmedPlayerName} Room created`, backgroundColor: "green" })
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
          backgroundImage: `url(${Image})`,
          backgroundSize: "cover",
        }}
      >
        <form onSubmit={handleCreate} style={{ textAlign: "center" }}>
          <label htmlFor="playerName" className="form-label" style={{color: "white"}}>Player Name:</label>
          <input
            type="text"
            id="playerName"
            className="form-control"
            value={playerName}
            onChange={handleOnChange}
            style={{ marginLeft: "0.5rem" }}
          /> <br /><br />
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary me-2" type="submit">
              Create Room
            </button>
            <Link to="/">
              <button className="btn btn-danger ms-2">Cancel</button>
            </Link>
          </div>
        </form> <br />
      </div>
    </>
  );
}
