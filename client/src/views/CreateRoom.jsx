import { getDatabase, ref, update } from "firebase/database";
import { firebaseConfig } from "../helpers/firebaseConfig.js";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { UserContext } from "../contexts/UserContext";
import toast from "../utils/toast";
import Image from "../images/vecteezy_abstract-geometric-background-of-fluid-liquid-and-dynamic_23514200-1.jpg";

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
          isLogin: true,
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
          backgroundImage: `url(${Image})`,
          backgroundSize: "cover",
        }}
      >
        <form
          onSubmit={handleCreate}
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
          <div className="d-flex flex-column justify-content-center align-items-center mt-3">
            <button className="btn btn-primary mb-3 w-100" type="submit">
              Create Room
            </button>
            <button
              className="btn btn-danger w-100"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>{" "}
        <br />
      </div>
    </>
  );
}
