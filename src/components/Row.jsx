import axios from "axios";
import React, { useEffect, useState } from "react";
import Youtube from "react-youtube";

import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { MdClose } from "react-icons/md";

import { FaPlus, FaCheck } from "react-icons/fa";
import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";

import Movie from "./Movie";
import { key } from "../Request";

const Row = ({ title, fetchURL, rowId }) => {
  const [movies, setMovie] = useState([]);
  const [urlId, setUrlId] = useState("");
  const [movieInfo, setMovieInfo] = useState({});

  useEffect(() => {
    const getMovies = async () => {
      const res = await axios.get(fetchURL);
      setMovie(res.data.results);
    };
    getMovies();
  }, [fetchURL]);

  const opts = {
    height: "390",
    width: "768",
    playerVars: {
      autoplay: 1,
    },
  };

  const handleMovieClick = async (id) => {
    const movie = movies.find((movie) => movie.id === id);
    setMovieInfo(movie);

    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${key}&language=en-US`
    );

    if (res.data.results.length === 0) {
      return alert("Trailer Not Available");
    }

    if (res.data.results.length !== 0) {
      setUrlId(res.data.results[0]);
    }
  };

  const handleClose = () => {
    setUrlId("");
  };

  const sliderLeft = () => {
    const slider = document.getElementById("slider" + rowId);
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const sliderRight = () => {
    const slider = document.getElementById("slider" + rowId);
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  return (
    <>
      <h2 className="text-white font-bold md:text-xl p-4 ">{title}</h2>
      <div className="relative flex items-center p-2 group">
        <MdChevronLeft
          onClick={sliderLeft}
          className="bg-black bg-opacity-40 text-white h-full  absolute  opacity-100 cursor-pointer z-[100]  group-hover:block hidden"
          size={40}
        />
        <div
          id={"slider" + rowId}
          className="w-full left-15 h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide"
        >
          {movies.map((item, id) => (
            <Movie key={id} item={item} onMovieClick={handleMovieClick} />
          ))}
        </div>
        <MdChevronRight
          onClick={sliderRight}
          className="bg-black right-0 bg-opacity-40 text-white h-full  absolute  opacity-100 cursor-pointer z-[100]  group-hover:block hidden"
          size={40}
        />
      </div>

      {urlId && (
        <MovieInfoPopup onHandleClose={handleClose} movieInfo={movieInfo}>
          <Youtube opts={opts} videoId={urlId.key} />
        </MovieInfoPopup>
      )}
    </>
  );
};

function MovieInfoPopup({ children, movieInfo, onHandleClose }) {
  const [watched, setWatched] = useState(false);
  const [list, setList] = useState(false);
  const { user } = UserAuth();

  const movieID = doc(db, "users", `${user?.email}`);

  console.log(movieInfo);

  const saveShow = async () => {
    if (user?.email) {
      setWatched(!watched);
      setList(true);
      await updateDoc(movieID, {
        saveShows: arrayUnion({
          id: movieInfo.id,
          title: movieInfo.title,
          img: movieInfo.backdrop_path,
        }),
      });
    } else {
      alert("Please Log in to save a movie");
    }
  };

  return (
    <>
      <div className="bg-black opacity-95 fixed top-0 left-0 w-full h-full z-[130]"></div>
      <div className="bg-transparent fixed top-0 left-0 w-full z-[150]">
        <div className="bg-neutral-900 rounded-sm mx-auto max-w-3xl h-screen w-full shadow-lg">
          <div className="w-full flex justify-center mt-3  relative">
            <div className="absolute top-0 left-0 w-full h-[390px] bg-gradient-to-b from-transparent to-black"></div>
            <button
              className="absolute top-0 right-0 text-white"
              onClick={onHandleClose}
            >
              <MdClose size={45} />
            </button>
            {children}
          </div>
          <div className="px-14 bg-gradient-to-t from-transparent to-black ">
            <h2 className="text-white font-bold text-3xl py-3">
              {movieInfo.title}
            </h2>
            <div className="font-bold text-stone-600 text-lg flex justify-start gap-10 mb-3">
              <span className="text-green-500">98% match</span>
              <p>{new Date(movieInfo.release_date).getFullYear()}</p>
              <p>⭐ {movieInfo.vote_average}</p>
            </div>
            <p className="text-sm text-stone-300">{movieInfo.overview}</p>

            <p onClick={saveShow}>
              {watched ? (
                <FaCheck size={30} className="mt-2 text-white cursor-pointer" />
              ) : (
                <FaPlus size={30} className="mt-2  text-white cursor-pointer" />
              )}
            </p>
            <p className="text-white mt-2">My List</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Row;
