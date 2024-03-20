export default function Square({ value, onSquareClick }) {
  return (
    <button
      className="btn btn-lg rounded-0 border border-white"
      style={{ width: "100px", height: "100px", fontSize: "2em", color: "white" }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
