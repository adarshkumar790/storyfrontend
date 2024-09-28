import React, { useState } from 'react';

const StoryForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [slides, setSlides] = useState([]);
    const [category, setCategory] = useState('');
    const [file, setFile] = useState(null);
    const [isVideo, setIsVideo] = useState(false); // Track if the file is a video

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type.split('/')[0]; // Get the file type (image or video)
            if (fileType === 'image') {
                setIsVideo(false);
            } else if (fileType === 'video') {
                setIsVideo(true);
            } else {
                alert('Please select an image or a video.');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (slides.length < 3 || slides.length > 6) {
            alert('You must have between 3 and 6 slides.');
            return;
        }

        const newStory = {
            title,
            slides: [{ 
                ...slides[0], 
                ...(file ? { [isVideo ? 'video' : 'image']: URL.createObjectURL(file) } : {}) 
            }],
            category,
        };

        onSubmit(newStory);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Title:</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
            </div>
            <div>
                <label>Category:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="">Select a category</option>
                    <option value="food">Food</option>
                    <option value="health and fitness">Health and Fitness</option>
                    <option value="travel">Travel</option>
                    <option value="movie">Movie</option>
                    <option value="education">Education</option>
                </select>
            </div>
            <div>
                <label>Upload Image or Video:</label>
                <input 
                    type="file" 
                    accept="image/*, video/*" 
                    onChange={handleFileChange} 
                    required 
                />
            </div>
            <button type="submit">Add Story</button>
        </form>
    );
};

export default StoryForm;
