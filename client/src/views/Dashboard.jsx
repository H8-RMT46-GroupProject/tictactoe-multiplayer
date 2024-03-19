import { useState } from "react";
import Square from "../components/Square";

export default function Dashboard() {
  const [value, setValue] = useState("X");

  const handleClick = () => {
    setValue("O");
  };
  return (
    <>
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <div>
          <Square value={value} onSquareClick={handleClick} />
          <Square value={value} onSquareClick={handleClick} />
          <Square value={value} onSquareClick={handleClick} />
        </div>
        <div>
          <Square value={value} onSquareClick={handleClick} />
          <Square value={value} onSquareClick={handleClick} />
          <Square value={value} onSquareClick={handleClick} />
        </div>
        <div>
          <Square value={value} onSquareClick={handleClick} />
          <Square value={value} onSquareClick={handleClick} />
          <Square value={value} onSquareClick={handleClick} />
        </div>
      </div>
    </>
  );
}
