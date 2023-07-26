import React, { useEffect, useState } from "react";
import Youtube from "react-youtube";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { AiOutlineClose } from "react-icons/ai";

import { UserAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { updateDoc, doc, onSnapshot } from "firebase/firestore";

import axios from "axios";
import { key } from "../Request";

import MovieInfoPopup from "./MovieInfoPop";

const SavedShows = () => {
  const [movies, setMovies] = useState([]);
  const [movieInfo, setMovieInfo] = useState({});
  const [urlId, setUrlId] = useState("");
  const { user } = UserAuth();

  const opts = {
    height: "390",
    width: "768",
    playerVars: {
      autoplay: 1,
    },
  };

  useEffect(() => {
    onSnapshot(doc(db, "users", user?.email), (snapshot) => {
      setMovies(snapshot.data()?.saveShows);
    });
  }, [user?.email]);

  const movieRef = doc(db, "users", `${user?.email}`);

  const deleteShow = async (passedID) => {
    try {
      const result = movies.filter((item) => item.id !== passedID);
      await updateDoc(movieRef, {
        saveShows: result,
      });
    } catch (error) {
      console.log(error);
    }
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
    const slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft - 500;
  };

  const sliderRight = () => {
    const slider = document.getElementById("slider");
    slider.scrollLeft = slider.scrollLeft + 500;
  };

  return (
    <div className="absolute z-[100] w-full">
      <h2 className="text-stone-500 font-bold md:text-xl p-4 ">My Shows</h2>
      <div className="relative flex items-center p-2 group">
        <MdChevronLeft
          onClick={sliderLeft}
          className="bg-black bg-opacity-40 text-white h-full  absolute  opacity-100 cursor-pointer z-[100]  group-hover:block hidden"
          size={40}
        />
        <div
          id={"slider"}
          className="w-full left-15 h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide"
        >
          {movies.map((item, id) => (
            <div
              key={id}
              className="w-[190px] h-[270px] inline-block cursor-pointer relative p-2"
            >
              {console.log(item)}
              <div className="w-full h-full">
                <img
                  className="w-full h-full object-cover object-center rounded-sm"
                  src={`https://image.tmdb.org/t/p/w500/${item?.img}`}
                  alt={item?.title}
                />
              </div>
              <div
                onClick={() => handleMovieClick(item.id)}
                className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white"
              >
                <p className="white-space-normal text-xs md:text-sm font-bold flex justify-center items-center h-full w-full text-center">
                  {item?.title}
                </p>
                <p
                  onClick={(e) => {
                    e.stopPropagation(); // This prevents the event from bubbling up
                    deleteShow(item.id);
                  }}
                  className="absolute text-gray-50 top-4 right-4"
                >
                  <AiOutlineClose />
                </p>
              </div>
            </div>
          ))}
        </div>
        <MdChevronRight
          onClick={sliderRight}
          className="bg-black right-0 bg-opacity-40 text-white h-full  absolute  opacity-100 cursor-pointer z-[100]  group-hover:block hidden"
          size={40}
        />
      </div>
      {urlId && (
        <MovieInfoPopup onHandleClose={handleClose} movieInfo={movieInfo} account={true}>
          <Youtube opts={opts} videoId={urlId.key} />
        </MovieInfoPopup>
      )}
    </div>
  );
};

export default SavedShows;
