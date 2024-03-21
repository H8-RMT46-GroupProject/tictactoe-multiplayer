import { useContext, useEffect, useState } from "react";
import Square from "../components/Square";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../helpers/firebaseConfig.js";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { UserContext } from "../contexts/UserContext";
import { calculateWinner, calculatedraw } from "../helpers/helper";
import { useNavigate } from "react-router-dom";
import clickSoundAsset from "../sounds/click.wav";
import gameOverSoundAsset from "../sounds/game_over.wav";
import "../styles/style.css";
import Image from "../images/rm218-bb-07.jpg";

export default function Dashboard() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [status, setStatus] = useState("");

  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState({});

  const [player1, setPlayer1] = useState({
    turn: "X",
    win: 0,
    lose: 0,
    draw: 0,
    role: "player1",
    name: "",
  });

  const [player2, setPlayer2] = useState({
    turn: "O",
    win: 0,
    lose: 0,
    draw: 0,
    role: "player2",
    name: "Waiting...",
  });

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const navigate = useNavigate();

  const clickSound = new Audio(clickSoundAsset);
  const gameOverSound = new Audio(gameOverSoundAsset);

  const handleClick = (i) => {
    if (
      squares[i] ||
      calculateWinner(squares) ||
      (user.turn === "X" && !xIsNext) ||
      (user.turn === "O" && xIsNext) ||
      !data.player2
    ) {
      return;
    }

    xIsNext ? (squares[i] = "X") : (squares[i] = "O");
    setSquares(squares);
    setXIsNext(!xIsNext);

    clickSound.play();

    const updateStatus = {
      xIsNext: !xIsNext,
      squares: {
        ...squares,
        [i]: squares[i],
      },
    };
    update(ref(db, `rooms/${user.room}`), updateStatus);
  };

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      const winningPlayer = winner === "X" ? "Player 1 (X)" : "Player 2 (O)";
      setStatus("Winner: " + winningPlayer);

      if (winner === "X") {
        update(ref(db, `rooms/${user.room}/player1`), {
          win: data.player1.win + 1,
        });
        update(ref(db, `rooms/${user.room}/player2`), {
          lose: data.player2.lose + 1,
        });
      } else if (winner === "O") {
        update(ref(db, `rooms/${user.room}/player2`), {
          win: data.player2.win + 1,
        });
        update(ref(db, `rooms/${user.room}/player1`), {
          lose: data.player1.lose + 1,
        });
      }
      gameOverSound.play();
    } else if (Object.keys(squares).length === 1) {
      xIsNext ? setStatus("Player 1 Start") : setStatus("Player 2 Start");
    } else if (calculatedraw(squares) && !winner) {
      update(ref(db, `rooms/${user.room}/player2`), {
        draw: data.player1.draw + 1,
      });
      update(ref(db, `rooms/${user.room}/player1`), {
        draw: data.player2.draw + 1,
      });
      setStatus("Draw");
    } else {
      const currentPlayer = xIsNext ? "Player 1 (X)" : "Player 2 (O)";
      setStatus("Next Player: " + currentPlayer);
    }
  }, [xIsNext]);

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    if (!userLocal) navigate("/");

    setUser(userLocal);
    const starCountRef = ref(db, `rooms/${userLocal.room}`);
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setData(data);
        setSquares(data.squares);

        setPlayer1(data.player1);
        if (data.player2) setPlayer2(data.player2);

        setXIsNext(data.xIsNext);
      }
    });

    const randomFirstPlayer = Math.floor(Math.random() * (2 - 1 + 1)) + 1 < 2;
    if (randomFirstPlayer !== xIsNext) {
      update(ref(db, `rooms/${userLocal.room}`), {
        xIsNext: randomFirstPlayer,
      });
      setXIsNext(randomFirstPlayer);
    }
  }, []);

  // console.log(data);

  const handleReset = () => {
    setSquares(Array(9).fill(null));
    setStatus("");
    setXIsNext(true);

    const updateStatus = {
      xIsNext: true,
      squares: {
        9: 10,
      },
    };
    update(ref(db, `rooms/${user.room}`), updateStatus);
  };

  const handleLogout = () => {
    localStorage.clear();
    update(ref(db, `rooms/${user.room}`), {
      isLogin: false,
    });
    update(ref(db, `rooms`), {
      [user.room]: null,
    });
    navigate("/");
  };

  if (data.isLogin === false) {
    localStorage.clear();
    update(ref(db, `rooms`), {
      [user.room]: null,
    });
    navigate("/");
  }

  return (
    <>
      <div
        style={{
          position: "relative",
          height: "100vh",
          backgroundImage: `url(${Image})`,
          backgroundSize: "cover",
          color: "white",
        }}
      >
        <button
          className="btn btn-lg btn-danger"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            margin: "2%",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <h1 className="text-center text-light">
              Multiplayer Tic-Tac-Toe Game
            </h1>
          </div>
          <div>
            <h4>
              <span className="text-warning">Room:</span> {user.room}
            </h4>
          </div>
          <div className="status">
            <h5 className="text-center">{status}</h5>
          </div>
          <div className="container d-flex justify-content-center align-items-center gap-5">
            <div>
              <h5>
                <span className="text-warning">Player 1:</span> {player1?.name}
              </h5>
              <p>
                Win: {player1?.win} | Draw: {player1?.draw} | Lose:{" "}
                {player1?.lose}
              </p>
            </div>
            {data && Object.keys(data).length > 0 && (
              <div
                className="border border-lg border-warning shadow shadow-lg shadow-dark rounded"
                style={{ marginTop: "1.5%" }}
              >
                {[0, 1, 2].map((row) => (
                  <div key={row}>
                    {[0, 1, 2].map((col) => (
                      <Square
                        key={col}
                        value={squares[row * 3 + col]}
                        onSquareClick={() => handleClick(row * 3 + col)}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
            <div>
              <h5>
                <span className="text-warning">Player 2:</span> {player2.name}
              </h5>
              {player2.name === "Waiting..." ? (
                <div className="spinner"></div>
              ) : (
                <p>
                  Win: {player2.win} | Lose: {player2.lose} | Draw:{" "}
                  {player2.draw}
                </p>
              )}
            </div>
          </div>
        </div>
        <div
          className="reset-button mt-5"
          style={{
            position: "absolute",
            bottom: "2px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <button
            className="btn btn-lg btn-warning mb-10 px-3"
            onClick={handleReset}
          >
            Reset Game
          </button>
        </div> 
      </div>
    </>
  );
}
