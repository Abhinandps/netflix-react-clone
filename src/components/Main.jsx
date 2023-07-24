import axios from "axios";
import React, { useEffect, useState } from "react";
import requests from "../Request";
import { FaPlay, FaPlus } from "react-icons/fa";

const Main = () => {
  const [movies, setMovies] = useState([]);

  // pick a random movie each time
  const movie = movies[Math.floor(Math.random() * movies.length)];

  useEffect(() => {
    const getPopularMovies = async () => {
      const res = await axios.get(requests.requestPopular);
      setMovies(res.data.results);
    };
    getPopularMovies();
  }, []);

  const truncateString = (str, num) => {
    if (str?.length > num) {
      return str.slice(0, num) + "...";
    } else {
      return str;
    }
  };

  return (
    <div className="w-full h-[550px] text-white">
      <div className="w-full h-full">
        <div className="absolute w-full h-[550px] bg-gradient-to-t from-black"></div>
        <img
          className="w-full h-full object-cover"
          src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
          alt={movie?.title}
        />
        <div className="absolute w-full top-[25%] p-4 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold">{movie?.title}</h1>
          <div className="my-4 flex">
            <button className="button">
              <FaPlay className="mr-2" size={15} /> {/* Play video icon */}
              <span className="font-bold">Play</span>
            </button>
            <button className="button">
              <FaPlus className="mr-2" size={15} /> {/* Add to My List icon */}
              <span className="font-bold">My List</span>
            </button>
          </div>
          <p className="w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%]">
            {truncateString(movie?.overview, 150)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
