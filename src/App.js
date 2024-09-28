import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StoryDetails from './pages/StoryDetails';
import AddStory from './pages/AddStory';
import EditStory from './pages/EditStory';
import Bookmark from './pages/Bookmark';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/story/:id" element={<StoryDetails />} />
                <Route path="/add-story" element={<AddStory />} />
                <Route path="/edit-story/:id" element={<EditStory />} />
                <Route path="/bookmark" element={<Bookmark />} />
            </Routes>
        </Router>
    );
};

export default App;
