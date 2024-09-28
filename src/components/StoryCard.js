import React from 'react';
import { Link } from 'react-router-dom';

const StoryCard = ({ story }) => {
    return (
        <div className="story-card">
            <Link to={`/story/${story._id}`}>
                <h3>{story.title}</h3>
            </Link>
            <p>Category: {story.category}</p>
            <p>Likes: {story.likes.length}</p>
        </div>
    );
};

export default StoryCard;
