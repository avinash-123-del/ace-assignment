import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactStars from 'react-rating-stars-component';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const VotingTab = () => {
  const [dishes, setDishes] = useState([]);
  const { userSelections, setUserSelections } = useAuth();
  const [loader, setLoader] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dishesPerPage] = useState(6); // Adjust the number of dishes per page as needed

  useEffect(() => {
    const fetchDishes = async () => {
      setLoader(true);
      try {
        const response = await axios.get('https://raw.githubusercontent.com/dctacademy/react-task/main/db.json');
        setDishes(response.data);
        setLoader(false);
      } catch (error) {
        setLoader(false);
        console.error('Error fetching dishes:', error);
      }
    };

    fetchDishes();
  }, []);

  const handleSelectDish = (dishId, rank) => {
    setUserSelections((prevSelections) => {
      const updatedSelections = { ...prevSelections };
      const selectedCount = Object.keys(updatedSelections).length;

      if (rank > 0 && selectedCount >= 3 && !updatedSelections[dishId]) {
        toast.warn('You can only select up to 3 dishes.');
        return prevSelections;
      }

      for (const key in updatedSelections) {
        if (updatedSelections[key] === rank) {
          delete updatedSelections[key];
        }
      }

      if (rank === 0) {
        delete updatedSelections[dishId];
      } else {
        updatedSelections[dishId] = rank;
      }

      handleSubmitVotes(updatedSelections);

      return updatedSelections;
    });
  };

  const handleSubmitVotes = (updatedSelections) => {
    const points = Object.keys(updatedSelections).reduce((acc, dishId) => {
      const rank = updatedSelections[dishId];
      let points = 0;

      if (rank === 1) points = 30;
      if (rank === 2) points = 20;
      if (rank === 3) points = 10;

      acc[dishId] = points;
      return acc;
    }, {});

    console.log('User Selections with Points:', points);
  };

  const handleDescription = (desp) => {
    if (desp.length > 100) {
      return desp.substr(0, 100) + "...";
    } else {
      return desp;
    }
  };

  // Get current dishes
  const indexOfLastDish = currentPage * dishesPerPage;
  const indexOfFirstDish = indexOfLastDish - dishesPerPage;
  const currentDishes = dishes.slice(indexOfFirstDish, indexOfLastDish);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h3 className='concert-one-regular fw-bold t-color text-center'>Rate Your Top 3 Dishes</h3>

      {loader ? (
        <div className='m-auto d-flex align-items-center' style={{height:"75vh"}}>
          <div className="loader m-auto"></div>
        </div>
      ) : (
        <>
          <div className="row voting_tab mt-2" style={{ maxWidth: '1400px' }}>
            {currentDishes.map((dish) => (
              <div key={dish.id} className="col-md-4 mb-3">
                <div className="card shadow">
                  <img src={dish.image} className="card-img-top" alt={dish.dishName} />
                  <div className="card-body">
                    <h5 className="card-title">{dish.dishName}</h5>
                    <small className="card-text fs-12">{handleDescription(dish.description)}</small>
                    <ReactStars
                      count={3}
                      value={userSelections[dish.id] || 0}
                      onChange={(rank) => handleSelectDish(dish.id, rank === 0 ? 0 : rank)}
                      size={30}
                      activeColor="#ffd700"
                      isHalf={false}
                      emptyIcon={<i className="fa fa-star-o" />}
                      halfIcon={<i className="fa fa-star-half-o" />}
                      fullIcon={<i className="fa fa-star" />}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Stack spacing={2} className="mt-3">
            <Pagination
              count={Math.ceil(dishes.length / dishesPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </>
      )}
    </div>
  );
};

export default VotingTab;
