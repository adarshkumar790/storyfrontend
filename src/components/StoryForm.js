import React, { useState } from 'react';

const StoryForm = ({ onSubmit, initialData = {} }) => {
    const [title, setTitle] = useState(initialData.title || '');
    const [category, setCategory] = useState(initialData.category || 'food');
    const [slides, setSlides] = useState(initialData.slides || [{ image: '', text: '' }]);

    const handleSlideChange = (index, field, value) => {
        const updatedSlides = [...slides];
        updatedSlides[index][field] = value;
        setSlides(updatedSlides);
    };

    const handleAddSlide = () => {
        if (slides.length < 6) {
            setSlides([...slides, { image: '', text: '' }]);
        }
    };

    const handleRemoveSlide = (index) => {
        const updatedSlides = slides.filter((_, i) => i !== index);
        setSlides(updatedSlides);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (slides.length >= 3) {
            onSubmit({ title, category, slides });
        } else {
            alert('Minimum 3 slides are required');
        }
    };

    return (
        <form className="story-form" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label">Title:</label>
                <input 
                    className="form-input"
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
            </div>

            <div className="form-group">
                <label className="form-label">Category:</label>
                <select 
                    className="form-select"
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="food">Food</option>
                    <option value="health and fitness">Health & Fitness</option>
                    <option value="travel">Travel</option>
                    <option value="movie">Movie</option>
                    <option value="education">Education</option>
                </select>
            </div>

            <div className="slides-container">
                {slides.map((slide, index) => (
                    <div key={index} className="slide-item">
                        <label className="form-label">Image URL:</label>
                        <input 
                            className="form-input"
                            type="text" 
                            value={slide.image} 
                            onChange={(e) => handleSlideChange(index, 'image', e.target.value)} 
                            required 
                        />

                        <label className="form-label">Text:</label>
                        <input 
                            className="form-input"
                            type="text" 
                            value={slide.text} 
                            onChange={(e) => handleSlideChange(index, 'text', e.target.value)} 
                            required 
                        />

                        {slides.length > 3 && (
                            <button 
                                type="button" 
                                className="remove-slide-btn" 
                                onClick={() => handleRemoveSlide(index)}
                            >
                                Remove
                            </button>
                        )}
                    </div>
                ))}

                {slides.length < 6 && (
                    <button 
                        type="button" 
                        className="add-slide-btn" 
                        onClick={handleAddSlide}
                    >
                        Add Slide
                    </button>
                )}
            </div>

            <button type="submit" className="submit-btn">Submit</button>
        </form>
    );
};

export default StoryForm;
