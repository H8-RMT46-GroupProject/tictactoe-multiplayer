import { useContext, useEffect, useState } from "react";
import Square from "../components/Square";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../helpers/firebaseConfig.js";
import { getDatabase, onValue, ref, update } from "firebase/database";
import { UserContext } from "../UserContext";
import { calculateWinner } from "../helpers/helper";
import { useNavigate } from "react-router-dom";
import clickSoundAsset from "../sounds/click.wav";
import gameOverSoundAsset from "../sounds/game_over.wav";

export default function Dashboard() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [status, setStatus] = useState("");
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
    turn: "X",
    win: 0,
    lose: 0,
    draw: 0,
    role: "player2",
    name: "",
  });

  const { user, setUser } = useContext(UserContext);

  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);

  const navigate = useNavigate();

  const clickSound = new Audio(clickSoundAsset);
  const gameOverSound = new Audio(gameOverSoundAsset);

  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) {
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
      gameOverSound.play();
    } else {
      if (Object.keys(squares).length === 1) {
        setStatus("Player 1 Start");
      } else {
        const currentPlayer = xIsNext ? "Player 1 (X)" : "Player 2 (O)";
        setStatus("Next Player: " + currentPlayer);
      }
    }
  }, [xIsNext, squares]);

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    if (!userLocal) navigate("/");

    setUser(userLocal);
    console.log(userLocal);

    const starCountRef = ref(db, `rooms/${userLocal.room}`);
    onValue(starCountRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setData(data);
        setSquares(data.squares);

        setPlayer1(data.player1);
        setPlayer2(data.player2);
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
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          height: "100vh",
        }}
      >
        <button
          className="btn btn-lg btn-danger"
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
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
          <div style={{ marginBottom: "20px" }}>
            <h1>Multiplayer Tic-Tac-Toe Game</h1>
          </div>
          <div className="status" style={{ marginTop: "20px" }}>
            <h5>{status}</h5>
          </div>
          {data && Object.keys(data).length > 0 && (
            <>
              <div>
                <Square
                  value={squares[0]}
                  onSquareClick={() => handleClick(0)}
                  // disabled={
                  //   (data[user.name].turn === "X" && !xIsNext) ||
                  //   (data[user.name].turn === "Y" && xIsNext) ||
                  //   (data[user.name].turn !== "X" && data[user.name].turn !== "Y")
                  // }
                />
                <Square
                  value={squares[1]}
                  onSquareClick={() => handleClick(1)}
                />
                <Square
                  value={squares[2]}
                  onSquareClick={() => handleClick(2)}
                />
              </div>
              <div>
                <Square
                  value={squares[3]}
                  onSquareClick={() => handleClick(3)}
                />
                <Square
                  value={squares[4]}
                  onSquareClick={() => handleClick(4)}
                />
                <Square
                  value={squares[5]}
                  onSquareClick={() => handleClick(5)}
                />
              </div>
              <div>
                <Square
                  value={squares[6]}
                  onSquareClick={() => handleClick(6)}
                />
                <Square
                  value={squares[7]}
                  onSquareClick={() => handleClick(7)}
                />
                <Square
                  value={squares[8]}
                  onSquareClick={() => handleClick(8)}
                />
              </div>
            </>
          )}
        </div>
        <div
        className="reset-button"
        style={{
          position: "absolute",
          bottom: "2px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <button className="btn btn-lg btn-warning" onClick={handleReset}>
          Reset Game
        </button>
      </div>
      </div>
    </>
  );
}
