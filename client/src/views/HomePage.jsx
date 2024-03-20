import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <button
        className="btn btn-lg btn-primary"
        onClick={() => {
          navigate("/create");
        }}
      >
        Create Room
      </button>
      <button
        className="btn btn-lg btn-primary"
        onClick={() => navigate("/join")}
      >
        Join Room
      </button>
    </>
  );
}
