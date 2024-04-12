import { useState, useEffect } from "react";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Input from "./components/Input.tsx";
import Button from "./components/Button.tsx";
import CardsList from "./components/CardsList.tsx";
import Error from "./components/Error.tsx";
import { CharacterResult, Character } from "./api-types.tsx";

const Home = () => {
  const [initData, setInitData] = useState<Character[]>();
  const [characters, setCharacters] = useState<Character[]>();
  const [searchTermCharacters, setSearchTermCharacters] = useState<string>();
  const [totalResults, setTotalResults] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);

  const searchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermCharacters(event.target.value || "");
    searchCharacters(event.target.value);
  };

  const searchCharacters = (searchTerm: string) => {
    if (!initData) {
      console.error("No data yet.");
      return;
    }
    if (searchTerm) {
      const searchResults = initData.filter((character) =>
        character.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setCharacters(searchResults);
    } else {
      setCharacters(initData);
    }
  };

  const getCharacter = async (page = 1) => {
    try {
      const data = await fetch(
        `https://rickandmortyapi.com/api/character?page=${page}`
      );
      const response = (await data.json()) as CharacterResult;
      setCharacters(response.results);
      setInitData(response.results);
      setTotalResults(response.info.count);
      setTotalPages(response.info.pages);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getCharacter();
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    getCharacter(newPage);
  };

  return (
    <section className="container mx-auto">
      <Header />
      <Input
        type="search"
        placeholder="type your character..."
        changeHandler={searchTerm}
      />
      {totalResults && (
        <p className="mt-4 ">
          Total characters are:{" "}
          <span className=" font-black">{totalResults}</span>
        </p>
      )}
      {characters && characters.length == 0 ? (
        <Error searchTermCharacters={searchTermCharacters || ""} />
      ) : (
        <CardsList characters={characters!} />
      )}
      {totalPages && (
        <div className="flex gap-2 my-4 justify-center items-baseline">
          <Button
            classes={
              currentPage === 1
                ? "bg-gray-400 p-2 rounded-md text-white"
                : "bg-black text-white p-2 rounded-md"
            }
            clickHandler={() => handlePageChange(currentPage - 1)}
            buttonLabel="prev"
            disabled={currentPage === 1}
          />
          <p>
            Page {currentPage} of {totalPages}{" "}
          </p>
          <Button
            clickHandler={() => handlePageChange(currentPage + 1)}
            buttonLabel="next"
            classes={
              currentPage === totalPages
                ? "bg-gray-400 p-2 rounded-md text-white"
                : "bg-black text-white p-2 rounded-md"
            }
            disabled={currentPage === totalPages}
          />
        </div>
      )}
      <Footer />
    </section>
  );
};
export default Home;
