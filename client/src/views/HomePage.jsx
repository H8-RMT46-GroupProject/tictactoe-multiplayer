import { useNavigate } from "react-router-dom";
import Image from "../images/vecteezy_abstract-geometric-background-of-fluid-liquid-and-dynamic_23514200-1.jpg";

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
          backgroundImage: `url(${Image})`,
          backgroundSize: "cover",
        }}
      >
        <h1 style={{ color: "white", marginBottom: "50px" }}>
          Welcome to the Tic-Tac-Toe Game
        </h1>
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
