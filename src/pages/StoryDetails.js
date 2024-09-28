import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

const StoryDetails = () => {
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        const fetchStory = async () => {
            try {
                const response = await api.get(`/stories/${id}`);
                const fetchedStory = response.data || {}; // Fetch the story data
                setStory(fetchedStory);
                setLiked(fetchedStory.likedByCurrentUser || false); // Set liked status
            } catch (error) {
                console.error('Failed to fetch story:', error);
                alert('Error loading story details.');
            }
        };
        fetchStory();
    }, [id]);

    const handleLike = async () => {
        try {
            await api.post(`/stories/${id}/like`);
            setLiked(!liked);
            setStory((prevStory) => ({
                ...prevStory,
                likes: liked ? prevStory.likes - 1 : prevStory.likes + 1,
            }));
        } catch (error) {
            console.error('Failed to like story:', error);
        }
    };

    const handleBookmark = async () => {
        try {
            await api.post(`/stories/${id}/bookmark`);
            alert('Story bookmarked!');
        } catch (error) {
            console.error('Failed to bookmark story:', error);
        }
    };

    // Display a loading message while the story is being fetched
    if (!story) return <div>Loading...</div>;

    return (
        <div>
            <h1>{story.title}</h1>
            <p>Category: {story.category}</p>
            <p>Likes: {story.likes?.length || 0}</p> {/* Safe access to likes count */}
            <button onClick={handleLike} style={{ color: liked ? 'red' : 'black' }}>
                {liked ? 'Unlike' : 'Like'}
            </button>
            <button onClick={handleBookmark}>Bookmark</button>

            <div>
                {story.slides && story.slides.length > 0 ? (
                    story.slides.map((slide, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            {slide.image && (
                                <img
                                    src={slide.image}
                                    alt={`Slide ${index + 1}`}
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            )}
                            {slide.text && <p>{slide.text}</p>}
                        </div>
                    ))
                ) : (
                    <p>No slides available for this story.</p>
                )}
            </div>
        </div>
    );
};

export default StoryDetails;
