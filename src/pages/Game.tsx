import { useParams } from "react-router-dom";

const Game = () => {
  const { id } = useParams();
  return <div>{id}</div>;
};

export default Game;
