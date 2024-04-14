import { useState, useEffect } from "react";
import Header from "./components/Header.tsx";
import Footer from "./components/Footer.tsx";
import Input from "./components/Input.tsx";
import Button from "./components/Button.tsx";
import CardsList from "./components/CardsList.tsx";
import Error from "./components/Error.tsx";
import { Character, CharactersResult } from "./api-types.tsx";
import CryptoJS from "crypto-js";
import { useNavigate, useLocation } from "react-router";

export const CHARS_PER_PAGE = 60;

const Home = () => {
  const [initData, setInitData] = useState<Character[]>();
  const [characters, setCharacters] = useState<Character[]>();
  const [searchTermCharacters, setSearchTermCharacters] = useState<string>();
  const [totalResults, setTotalResults] = useState<number>();
  const [totalPages, setTotalPages] = useState<number>();

  const navigate = useNavigate();
  const location = useLocation();

  const pageNumber = new URLSearchParams(location.search).get("page");
  const [currentPage, setCurrentPage] = useState(
    pageNumber ? parseInt(pageNumber, 10) : 1
  );

  useEffect(() => {
    navigate(`?page=${currentPage}`);
    getCharacter(currentPage);
  }, [currentPage]);

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
    const timestamp = Date.now().toString();
    const hash = CryptoJS.MD5(
      timestamp +
        import.meta.env.VITE_MARVEL_API_PRIVATE_KEY +
        import.meta.env.VITE_MARVEL_API_PUBLIC_KEY
    ).toString();
    try {
      const url = new URL(
        "https://gateway.marvel.com:443/v1/public/characters"
      );
      url.searchParams.append("limit", CHARS_PER_PAGE.toString());
      url.searchParams.append(
        "offset",
        ((page - 1) * CHARS_PER_PAGE).toString()
      );
      url.searchParams.append(
        "apikey",
        import.meta.env.VITE_MARVEL_API_PUBLIC_KEY
      );
      url.searchParams.append("ts", timestamp);
      url.searchParams.append("hash", hash);

      const data = await fetch(url.toString());

      const response = (await data.json()) as CharactersResult;
      setCharacters(response.data.results);
      setInitData(response.data.results);
      setTotalResults(response.data.total);
      setTotalPages(Math.ceil(response.data.total / CHARS_PER_PAGE));
    } catch (err) {
      console.log(err);
    }
  };

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
