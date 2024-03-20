import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, update } from "firebase/database";
import { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { firebaseConfig } from "../helpers/firebaseConfig";
import { UserContext } from "../UserContext";
import toast from "../utils/toast";
import Image from "../images/vecteezy_abstract-geometric-background-of-fluid-liquid-and-dynamic_23514200-1.jpg"

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
        if (data.player2) {
          toast({
            message: "Player name already taken",
            backgroundColor: "red",
          });
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
        toast({
          message: `${playerName} has joined room ${room}`,
          backgroundColor: "green",
        });
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
          backgroundImage: `url(${Image})`,
          backgroundSize: "cover",
        }}
      >
        <form onSubmit={handleJoin} style={{ textAlign: "center" }}>
          <label htmlFor="playerName" className="form-label" style={{color: "white"}}>Player Name:</label>
          <input
            type="text"
            id="playerName"
            className="form-control"
            value={playerName}
            onChange={handleOnChange}
            style={{ marginLeft: "0.5rem" }}
          />{" "}
          <br />
          <br />
          <label htmlFor="room" className="form-label" style={{color: "white"}}>Room Code:</label>
          <input
            type="text"
            id="room"
            className="form-control"
            value={room}
            onChange={handleOnChange}
            style={{ marginLeft: "0.5rem" }}
          />{" "}
          <br />
          <br />
          <div className="d-flex justify-content-center">
            <button className="btn btn-primary me-2" type="submit">
              Join Room
            </button>
            <Link to="/">
              <button className="btn btn-danger ms-2">Cancel</button>
            </Link>
          </div>
        </form>{" "}
      </div>
    </>
  );
}
