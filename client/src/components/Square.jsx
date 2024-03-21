export default function Square({ value, onSquareClick }) {
  return (
    <button
      className="btn btn-lg rounded-0 border border-neon shadow shadow-lg shadow-warning"
      style={{
        width: "100px",
        height: "100px",
        fontSize: "2em",
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.8)", 
        textShadow: "0px 0px 10px neon", 
        boxShadow: "0px 0px 20px 10px neon",
      }}
      onClick={onSquareClick}
    >
      {value === "X" ? (
        <span className="text-success">X</span>
      ) : value === "O" ? (
        <span className="text-danger">O</span>
      ) : null}
    </button>
  );
}
