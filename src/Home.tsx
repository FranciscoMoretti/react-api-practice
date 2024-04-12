import { useState, useEffect } from "react";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Input from "./components/Input.tsx";
import Button from "./components/Button.tsx";
import CardsList from "./components/CardsList.tsx";
import Error from "./components/Error.tsx";
import { CharacterResult, Result } from "./api-types.tsx";

const Home = () => {
  const [initData, setInitData] = useState<Result[]>();
  const [characters, setCharacters] = useState<Result[]>();
  const [searchTermCharacters, setSearchTermCharacters] = useState<string>();
  const [noResults, setNoResults] = useState(false);
  const [totalResults, setTotalResults] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState(1);

  const searchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermCharacters(event.target.value);
    searchCharacters();
  };

  const searchCharacters = () => {
    if (!initData) {
      console.error("No data yet.");
      return;
    }
    if (searchTermCharacters) {
      const searchResults = initData.filter((character) =>
        character.name
          .toLowerCase()
          .includes(searchTermCharacters.toLowerCase())
      );
      setCharacters(searchResults);
      setNoResults(searchResults.length === 0);
    } else {
      setCharacters(initData);
    }
  };

  const getChatacter = async (page = 1) => {
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
    getChatacter();
  }, []);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    getChatacter(newPage);
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
      {noResults ? (
        <Error searchTermCharacters={searchTermCharacters} />
      ) : (
        <CardsList characters={characters} />
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
