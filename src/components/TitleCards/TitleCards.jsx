import React, { useEffect, useRef, useState } from 'react';
import './TitleCards.css';

const TitleCards = ({ title }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const API_KEY = process.env.REACT_APP_API_KEY;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  };

  const handleWheel = (event) => {
    event.preventDefault();
    if (cardsRef.current) {
      cardsRef.current.scrollLeft += event.deltaY;
    }
  };

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1',
          options
        );
        const data = await response.json();
        setApiData(data.results || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMovies();

    const currentRef = cardsRef.current;
    if (currentRef) {
      currentRef.addEventListener('wheel', handleWheel);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  return (
    <div className='titlecards'>
      <h2>{title || 'Popular on Netflix'}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => (
          <div className="card" key={index}>
            {card.backdrop_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                alt={card.original_title}
              />
            ) : (
              <div className="placeholder">No Image Available</div>
            )}
            <p>{card.original_title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
