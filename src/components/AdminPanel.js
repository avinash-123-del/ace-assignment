import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ReactStars from 'react-rating-stars-component';
import { Button, Typography } from '@mui/material';

const AdminPanel = () => {
  const { userSelections, setUserSelections } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users'));
    setUsers(storedUsers || []);
  }, []);

  const handleDeleteUser = (username) => {
    const updatedUsers = users.filter(user => user.username !== username);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const updatedSelections = { ...userSelections };
    Object.keys(updatedSelections).forEach(dishId => {
      if (updatedSelections[dishId] && updatedSelections[dishId][username]) {
        delete updatedSelections[dishId][username];
      }
    });
    setUserSelections(updatedSelections);
  };

  const handleEditUser = (username, dishId, newRank) => {
    setUserSelections((prevSelections) => {
      const updatedSelections = { ...prevSelections };
      if (!updatedSelections[username]) {
        updatedSelections[username] = {};
      }
      updatedSelections[username][dishId] = newRank;
      return updatedSelections;
    });
  };

  const calculatePoints = (rank) => {
    switch(rank) {
      case 1: return 30;
      case 2: return 20;
      case 3: return 10;
      default: return 0;
    }
  };

  return (
    <div className='container' style={{ height: "80vh" }}>
      <Typography variant="h4" className='concert-one-regular fw-bold t-color text-center'>Admin Panel</Typography>
      <div className="list-group">
        {users.map((user, index) => (
          <div key={index} className="list-group-item">
            <Typography variant="h5" className='t-color'>
              {user.username} {user.isAdmin && "(Admin)"}
            </Typography>
            <ul>
              {Object.entries(userSelections[user.username] || {}).map(([dishId, rank]) => (
                <li key={dishId}>
                  <Typography>
                    Dish ID: {dishId}, Rank: {rank}, Points: {calculatePoints(rank)}
                  </Typography>
                  <ReactStars
                    count={3}
                    value={rank}
                    onChange={(newRank) => handleEditUser(user.username, dishId, newRank)}
                    size={30}
                    activeColor="#ffd700"
                    isHalf={false}
                    emptyIcon={<i className="fa fa-star-o" />}
                    halfIcon={<i className="fa fa-star-half-o" />}
                    fullIcon={<i className="fa fa-star" />}
                  />
                </li>
              ))}
            </ul>
            {!user.isAdmin && (
              <Button variant="contained" color="secondary" onClick={() => handleDeleteUser(user.username)}>Delete User</Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;