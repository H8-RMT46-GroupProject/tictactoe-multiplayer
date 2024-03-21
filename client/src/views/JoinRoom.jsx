import { initializeApp } from "firebase/app";
import { get, getDatabase, ref, update } from "firebase/database";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firebaseConfig } from "../helpers/firebaseConfig";
import { UserContext } from "../contexts/UserContext";
import toast from "../utils/toast";
import Image from "../images/vecteezy_abstract-geometric-background-of-fluid-liquid-and-dynamic_23514200-1.jpg";

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
            message: "Room is full",
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
          turn: "O",
        });
        localStorage.setItem(
          "user",
          JSON.stringify({ name: playerName, room, turn: "O" })
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
        <form
          onSubmit={handleJoin}
          className="border border-warning rounded p-5 bg-dark bg-opacity-25"
        >
          <label htmlFor="playerName" className="form-label h5 text-warning">
            Player Name:
          </label>
          <input
            type="text"
            id="playerName"
            className="form-control mb-3 w-100 form-control-lg"
            value={playerName}
            onChange={handleOnChange}
            minLength={3}
            maxLength={10}
          />
          <label htmlFor="room" className="form-label h5 text-warning">
            Room Code:
          </label>
          <input
            type="text"
            id="room"
            className="form-control mb-3 w-100 form-control-lg"
            value={room}
            onChange={handleOnChange}
            minLength={3}
            maxLength={10}
          />
          <div className="d-flex flex-column justify-content-center align-items-center mt-4">
            <button className="btn btn-primary mb-3 w-100" type="submit">
              Join Room
            </button>
            <button
              className="btn btn-danger w-100"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
