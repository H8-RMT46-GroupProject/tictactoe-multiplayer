export default function Square({ value, onSquareClick }) {
  return (
    <button
      className="btn btn-lg rounded-0 border border-dark"
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}
