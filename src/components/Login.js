import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import usersData from '../users.json';

const LoginPage = () => {
  const { setCurrentUser } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    const user = usersData.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Box className="login-background">
      <div className="d-flex justify-content-center row p-0 col-lg-5 shadow-login scale-in-center">
        <Box className='d-none d-lg-block col-lg-6 p-0'>
          <img src="/assets/burger.jpg" alt="" className='d-none d-lg-block w-100' />
        </Box>
        <Box
          component={Paper}
          elevation={3}
          className="login-content col-12 col-lg-6"
          sx={{
            maxWidth: 400,
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" gutterBottom>
            <h3>
              <span className='fw-bold text-danger concert-one-regular'>Welcome</span> to the world of <span className='text-warning concert-one-regular'>Tasty</span> and <span className='text-warning concert-one-regular'>Fresh</span> foods
            </h3>
          </Typography>
          <Box component="form" noValidate autoComplete="off" className='input_form'>
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
            <Button
              variant="contained"
              className='login_btn'
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Box>

          <Box className='d-flex justify-content-between align-items-center row mt-2'>
            <h3 className='col-8 concert-one-regular'>For the love of 
             <h1 style={{ color: "#d55959" }}>Delicious Food.</h1> </h3>
            <img src='/assets/chef.png' className='col-4 wobble-hor-bottom' alt='' style={{ right: "10px", zIndex: 10 }} />
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default LoginPage;