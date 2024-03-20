import { useEffect, useState } from "react";
import Square from "../components/Square";
import { calculateWinner } from "../helpers/helper";
import clickSoundAsset from "../sounds/click.wav";
import gameOverSoundAsset from "../sounds/game_over.wav";

export default function Dashboard() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [status, setStatus] = useState("");

  const clickSound = new Audio(clickSoundAsset);
  const gameOverSound = new Audio(gameOverSoundAsset);

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
    clickSound.play();
  };

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      const winningPlayer = xIsNext ? "Player 1 (X)" : "Player 2 (O)";
      setStatus("Winner: " + winningPlayer);
      gameOverSound.play();
    } else {
      if (squares.every(square => square === null)) {
        setStatus("Player 1 Start");
      } else {
        const currentPlayer = xIsNext ? "X" : "O";
        setStatus("Next Player: " + currentPlayer);
      }
    }
  }, [xIsNext, squares]);

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}>
        <div style={{marginBottom: "20px"}}>
          <h1>Multiplayer Tic-Tac-Toe Game</h1>
        </div>
        <div>
          <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
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
        <div className="status" style={{marginTop: "20px"}}><h5>{status}</h5></div>
      </div>
    </>
  );
}
