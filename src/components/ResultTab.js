import React, { useState, useEffect } from 'react';
import ReactStars from 'react-rating-stars-component';
import { useAuth } from '../context/AuthContext';

const ResultsTab = ({setActiveTab}) => {
  const { userSelections, setUserSelections } = useAuth();
  const [rankedDishes, setRankedDishes] = useState([]);

  useEffect(() => {
 
    const calculateRankings = () => {
      const dishes = Object.entries(userSelections).map(([dishId, rank ]) => ({
        id: dishId,
        rank,
        points: rank === 1 ? 30 : rank === 2 ? 20 : rank === 3 ? 10 : 0,
      }));
      dishes.sort((a, b) => b.points - a.points);
      setRankedDishes(dishes);
    };

    calculateRankings();
  }, [userSelections]);

  

  const handleUpdateRank = (dishId, newRank) => {
    setUserSelections((prevSelections) => {
      const updatedSelections = { ...prevSelections };

      for (const key in updatedSelections) {
        if (updatedSelections[key] === newRank) {
          delete updatedSelections[key];
        }
      }

      if (newRank === 0) {
        delete updatedSelections[dishId];
      } else {
        updatedSelections[dishId] = newRank;
      }

      return updatedSelections;
    });
  };

  return (
    <div className='container' style={{"height":"80vh"}}>
      <h3 className='concert-one-regular fw-bold t-color text-center mb-4'>Dish Rankings</h3>
      {rankedDishes.length > 0 ?
        <div className="list-group shadow">
          {rankedDishes.map((dish, index) => (
            <div key={dish.id} className="list-group-item">
              <h5 className='mb-0 d-flex align-items-center'>{index + 1}. Dish ID: {dish.id} - {dish.points} Points</h5>
              <p>
                <small>{dish.desp}</small>
              </p>
              <ReactStars
                count={3}
                value={dish.rank}
                onChange={(newRank) => handleUpdateRank(dish.id, newRank === 0 ? 0 : newRank)}
                size={30}
                activeColor="#ffd700"
                isHalf={false}
                emptyIcon={<i className="fa fa-star-o" />}
                halfIcon={<i className="fa fa-star-half-o" />}
                fullIcon={<i className="fa fa-star" />}
              />
            </div>
          ))}
        </div> :

        <div className='d-flex flex-column justify-content-center align-items-center mt-5'>

          <p className='text-center'>No Dish ranked yet</p>

          <div onClick={() => setActiveTab(0)} className='h-50 p-3 w-3 shadow bg-danger text-center text-white cp concert-one-regular rounded-3'>
            Start Ranking Your dish
          </div>
        </div>

      }
    </div>
  );
};

export default ResultsTab;