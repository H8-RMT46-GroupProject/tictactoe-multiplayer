import { useContext, useEffect, useState } from "react";
import Square from "../components/Square";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../helpers/firebaseConfig.js";
import { get, getDatabase, ref, update } from "firebase/database";
import { UserContext } from "../UserContext";
import { calculateWinner } from "../helpers/helper";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [status, setStatus] = useState("");
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  const { user, setUser } = useContext(UserContext);
  const [data, setData] = useState({});
  const navigate = useNavigate();

  // const starCountRef = ref(db, `rooms/${user.room}`);
  // onValue(starCountRef, (snapshot) => {
  //   setData(snapshot.val());
  //   console.log(snapshot.val());
  //   console.log(data);
  // });

  const handleClick = (i) => {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    const updateStatus = {
      xIsNext: !xIsNext,
      squares: {
        ...squares,
        [i]: nextSquares[i],
      },
    };
    // console.log(squares);
    console.log(updateStatus);
    update(ref(db, `rooms/${user.room}`), updateStatus);
  };

  useEffect(() => {
    const winner = calculateWinner(squares);
    winner
      ? setStatus("Pemenang: " + winner)
      : setStatus("Pemain selanjutnya: " + (xIsNext ? "X" : "O"));
  }, [xIsNext, squares]);

  useEffect(() => {
    const userLocal = JSON.parse(localStorage.getItem("user"));
    console.log(userLocal);

    if (!userLocal) {
      navigate("/");
    }

    setUser(userLocal);
    get(ref(db, `rooms/${userLocal.room}`)).then((snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
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
  return (
    <>
      <div className="status">{status}</div>
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
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
              <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
              <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div>
              <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
              <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
              <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div>
              <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
              <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
              <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
          </>
        )}
      </div>
      <button
        className="btn btn-lg btn-primary"
        onClick={() => {
          localStorage.clear();
          navigate("/");
        }}
      >
        Logout
      </button>
    </>
  );
}
