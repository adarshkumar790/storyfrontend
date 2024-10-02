import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StoryForm from '../components/StoryForm';
import './AddStory.css'; 

const AddStory = () => {
    const navigate = useNavigate();

    const handleSubmit = async (storyData) => {
        try {
            
            const response = await api.post('/stories', storyData);

        
            if (response.status === 201) {
                alert('Story added successfully!');
                navigate('/');
            } else {
                alert('Failed to add story. Please try again.');
            }
        } catch (error) {
            
            console.error('Failed to add story:', error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert('Error adding story. Please try again.');
            }
        }
    };

    return (
        <div className="add-story-container">
            <h1 className="add-story-title">Add a New Story</h1>
        
            <StoryForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddStory;
