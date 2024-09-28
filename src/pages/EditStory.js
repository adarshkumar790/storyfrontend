import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; // Assuming this handles the axios setup
import './EditStory.css'; // Import your CSS styles

const EditStory = () => {
    const { id } = useParams(); // To get the story ID from the URL
    const navigate = useNavigate(); // For redirecting after updating the story
    const [story, setStory] = useState({
        title: '',
        slides: [],
        category: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(''); // To handle success messages

    // Fetch story details when component mounts
    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await api.get(`/stories/${id}`);
                setStory({
                    title: response.data.title,
                    slides: response.data.slides,
                    category: response.data.category,
                });
            } catch (err) {
                console.error(err);
                setError('.'); // Display error if fetching fails
            }
        };

        fetchStory();
    }, [id]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'slides') {
            setStory((prevState) => ({
                ...prevState,
                slides: value.split(',').map((slide) => slide.trim()), // Split slides by comma
            }));
        } else {
            setStory((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    // Handle form submission for updating the story
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation to match backend rules before submitting
        if (story.slides.length < 3 || story.slides.length > 6) {
            setError('Slides must be between 3 and 6.');
            return;
        }

        try {
            const response = await api.put(`/stories/${id}`, story); // Update the story via API
            setSuccess('Story updated successfully!');
            navigate(`/stories/${response.data._id}`); // Redirect to updated story's page
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                setError('You are not authorized to edit this story.');
            } else {
                setError('Error updating story.'); // Display error if update fails
            }
        }
    };

    return (
        <div className="edit-story-container">
            <h1>Edit Story</h1>
            {error && <p className="error-message">{error}</p>} {/* Display error if exists */}
            {success && <p className="success-message">{success}</p>} {/* Display success message */}
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        name="title"
                        value={story.title}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="slides">Slides (comma-separated):</label>
                    <input
                        type="text"
                        name="slides"
                        value={story.slides.join(', ')} // Convert slides array to a string
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        name="category"
                        value={story.category}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn-submit">Update Story</button>
            </form>
        </div>
    );
};

export default EditStory;
