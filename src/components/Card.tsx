import { Circle } from "react-feather";
import { Character } from "../api-types";

const getCharacterStatus = (availableNum: number) => {
  if (availableNum == 0) {
    return <Circle size={15} color="red" fill="red" className="inline" />;
  } else if (availableNum < 10) {
    return <Circle size={15} color="gray" fill="gray" className="inline" />;
  } else {
    return <Circle size={15} color="green" fill="green" className="inline" />;
  }
};

const Card = ({ character }: { character: Character }) => {
  return (
    <li className="flex flex-col justify-between border-2 border-black p-4 w-64 rounded-md">
      <h1 className=" text-xl font-bold flex gap-2 items-center">
        {getCharacterStatus(character.comics.available)}
        {character.name}
      </h1>
      <img
        src={character.thumbnail.path + "." + character.thumbnail.extension}
        alt={character.name}
        className="my-3 "
      />
      <div>
        {"Comics "}
        <span className="bg-teal-200 p-1 text-sm rounded-md">
          {character.comics.items.length}
        </span>
      </div>
    </li>
  );
};
export default Card;
