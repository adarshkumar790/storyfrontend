import React from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StoryForm from '../components/StoryForm';
import './AddStory.css'; // Import CSS

const AddStory = () => {
    const navigate = useNavigate();

    const handleSubmit = async (storyData) => {
        try {
            // Make the API call to add the new story
            const response = await api.post('/stories', storyData);

            // If successful, navigate to the homepage or success page
            if (response.status === 201) {
                alert('Story added successfully!');
                navigate('/');
            } else {
                alert('Failed to add story. Please try again.');
            }
        } catch (error) {
            // Handle the error and provide feedback
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
            {/* Render the StoryForm component and pass the handleSubmit function */}
            <StoryForm onSubmit={handleSubmit} />
        </div>
    );
};

export default AddStory;
