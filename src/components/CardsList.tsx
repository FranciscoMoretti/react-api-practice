import { Character } from "../api-types";
import Card from "../components/Card";

const CardsList = ({ characters }: { characters: Character[] }) => {
  const createCard = () => {
    return characters.map((character, id) => {
      return <Card key={id} character={character} />;
    });
  };

  return (
    <ul className="flex flex-wrap gap-4 justify-center mt-4 ">
      {characters && createCard()}
    </ul>
  );
};

export default CardsList;
