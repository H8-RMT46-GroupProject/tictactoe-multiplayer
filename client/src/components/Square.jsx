export default function Square({ value, onSquareClick }) {
  return (
    <button
      className="btn btn-lg rounded-0 border border-dark"
      style={{ width: "100px", height: "100px", fontSize: "2em" }}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
