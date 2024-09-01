import React, {  useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Tabs, Tab, Box, Tooltip, IconButton, Avatar } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import VotingTab from './VotingTab';
import AdminPanel from './AdminPanel'; // Add this import
import { useNavigate } from 'react-router-dom';
// import Slider from "react-slick";
import ResultsTab from './ResultTab';

const HomePage = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleChangeTab = (event, newValue) => {
    console.log("newVa" , newValue);
    
    setActiveTab(newValue);
  };

  //slick slider
  // const settings = {
  //   dots: true,
  //   infinite: true,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   speed: 3000,
  //   autoplaySpeed: 3000,
  // };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, [setCurrentUser]);

  return (
    <>
      <AppBar position="static" >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <img className='col-10 col-md-4 col-lg-1' src='/assets/logo.png' width={200} alt="Logo" />
          </Typography>
          <Tooltip title="Open settings">
            <IconButton sx={{ p: 0, margin:1 }}>
              <Avatar alt="User Avatar" src="/assets/avatar.jpg" />
            </IconButton>
          </Tooltip>
          <Typography variant="subtitle1" className='d-none d-md-block' sx={{ marginRight: 2 }}>
            {currentUser?.username}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      {/* <div className="slider-container">
        <Slider {...settings}>
          <div>
            <img src="/assets/bg1.jpg" alt="Slider Image 1" />
          </div>
          <div>
            <img src="/assets/bg2.jpg" alt="Slider Image 2" />
          </div>
          <div>
            <img src="/assets/bg3.jpg" alt="Slider Image 3" />
          </div>
        </Slider>
      </div> */}
      <Box sx={{ width: '100%', mt: 2 }} className='home_bg' >
        <Tabs
          value={activeTab}
          onChange={handleChangeTab}
          centered
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Vote" />
          <Tab label="Results" />
          {currentUser?.isAdmin && <Tab label="Admin Panel" />}
        </Tabs>
        <Box sx={{ p: 3 }}  className="position-relative">
          {activeTab === 0 && <VotingTab />}
          {activeTab === 1 && <ResultsTab setActiveTab={setActiveTab}/>}
          {activeTab === 2 && currentUser?.isAdmin && <AdminPanel />}

          <img src='/assets/home-bg.jpg' className='home-bg' alt=''/>
        </Box>
      </Box>
    </>
  );
};

export default HomePage;