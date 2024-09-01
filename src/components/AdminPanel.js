import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ReactStars from 'react-rating-stars-component';

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
    delete updatedSelections[username];
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

  return (
    <div className='container' style={{"height":"80vh"}}>
      <h3  className='concert-one-regular fw-bold t-color text-center '>Admin Panel</h3>
      <div className="list-group">
        {users.map((user, index) => (
          <div key={index} className="list-group-item" >
            <h5 className='t-color'>{user.username}</h5>
            <ul>
              {Object.entries(userSelections[user.username] || {}).map(([dishId, rank]) => (
                <li key={dishId} >
                  Dish ID: {dishId}, Rank: {rank}, Points: {rank === 1 ? 30 : rank === 2 ? 20 : rank === 3 ? 10 : 0}
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
            <button className='admin-del ' onClick={() => handleDeleteUser(user.username)}>Delete User</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;