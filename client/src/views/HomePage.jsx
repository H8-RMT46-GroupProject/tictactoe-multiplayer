import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <h1 style={{ marginBottom: "100px" }}>Welcome to the Tic-Tac-Toe Game</h1>
        <div style={{ display: "flex" }}>
          <button
            className="btn btn-lg btn-primary"
            style={{ marginRight: "10px" }}
            onClick={() => {
              navigate("/create");
            }}
          >
            Create Room
          </button>
          <button
            className="btn btn-lg btn-primary"
            style={{ marginLeft: "10px" }}
            onClick={() => navigate("/join")}
          >
            Join Room
          </button>
        </div>
      </div>
    </>
  );
}
