import { useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { MdClose } from "react-icons/md";
import { FaCheck, FaPlus } from "react-icons/fa";

function MovieInfoPopup({ children, movieInfo, onHandleClose, account }) {
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
          release_date: movieInfo.release_date,
          vote_average: movieInfo.vote_average,
          overview: movieInfo.overview,
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

            {!account && (
              <>
                <p onClick={saveShow}>
                  {watched ? (
                    <FaCheck
                      size={30}
                      className="mt-2 text-white cursor-pointer"
                    />
                  ) : (
                    <FaPlus
                      size={30}
                      className="mt-2  text-white cursor-pointer"
                    />
                  )}
                </p>
                <p className="text-white mt-2">My List</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MovieInfoPopup;
