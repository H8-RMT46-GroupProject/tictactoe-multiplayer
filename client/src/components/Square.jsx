export default function Square({ value, onSquareClick }) {
  return (
    <button
      className="btn btn-lg rounded-0 border border-warning shadow shadow-lg shadow-warning"
      style={{
        width: "100px",
        height: "100px",
        fontSize: "2em",
        color: "white",
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
