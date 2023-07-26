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
import MovieInfoPopup from "./MovieInfoPop";

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



export default Row;
