// Home.js

import React, { useState, useEffect, useRef } from 'react';
import { FaHeart, FaBookmark, FaDownload, FaShareAlt, FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [stories, setStories] = useState([]);
  const [category, setCategory] = useState('');
  const [currentSlides, setCurrentSlides] = useState({});
  const [likedSlides, setLikedSlides] = useState({});
  const [bookmarkedStories, setBookmarkedStories] = useState({});
  const [loading, setLoading] = useState(false);
  const videoRefs = useRef([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true); // Start loading
      try {
        const response = await api.get('/stories', { params: { category } });
        setStories(response.data.stories);
      } catch (error) {
        console.error('Error fetching stories:', error);
        alert('Failed to fetch stories. Please try again later.');
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchStories();
  }, [category]);

  const handleLike = async (storyId, slideIndex) => {
    try {
      // Determine if the slide is already liked
      const isLiked = likedSlides[storyId]?.includes(slideIndex);

      // Update the likes count in the stories state
      setStories((prevStories) =>
        prevStories.map((story) => {
          if (story._id === storyId) {
            const updatedSlides = story.slides.map((slide, index) => {
              if (index === slideIndex) {
                return {
                  ...slide,
                  likes: isLiked ? Math.max(slide.likes - 1, 0) : (slide.likes || 0) + 1,
                };
              }
              return slide;
            });
            return { ...story, slides: updatedSlides };
          }
          return story;
        })
      );

      // Update the likedSlides state to reflect the toggle
      setLikedSlides((prev) => {
        const liked = prev[storyId] || [];
        if (isLiked) {
          // If already liked, remove the slideIndex from likedSlides
          return {
            ...prev,
            [storyId]: liked.filter((index) => index !== slideIndex),
          };
        } else {
          // If not liked, add the slideIndex to likedSlides
          return {
            ...prev,
            [storyId]: [...liked, slideIndex],
          };
        }
      });

      // Optionally, send a request to the backend to register the like/unlike
      // await api.post(`/stories/${storyId}/slides/${slideIndex}/like`);
    } catch (error) {
      console.error('Failed to like story:', error);
      alert('Failed to like the story. Please try again.');
    }
  };

  const handleBookmark = async (storyId) => {
    try {
      const isBookmarked = bookmarkedStories[storyId];
      
      if (isBookmarked) {
        // If already bookmarked, send request to remove bookmark
        await api.delete(`/stories/${storyId}/bookmark`);
      } else {
        // If not bookmarked, send request to add bookmark
        await api.post(`/stories/${storyId}/bookmark`);
      }

      // Toggle the bookmark state locally
      setBookmarkedStories((prev) => ({
        ...prev,
        [storyId]: !isBookmarked,
      }));
      
      alert(isBookmarked ? 'Bookmark removed!' : 'Story bookmarked!');
    } catch (error) {
      console.error('Failed to bookmark story:', error.response ? {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
      } : error);
      alert('Error bookmarking story. Please try again later.');
    }
  };

  const handleDownload = (slides) => {
    slides.forEach((slide, index) => {
      if (slide.image) {
        const link = document.createElement('a');
        link.href = slide.image;
        link.download = `slide-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const handleShare = (storyId) => {
    const storyUrl = `${window.location.origin}/story/${storyId}`;
    navigator.clipboard.writeText(storyUrl)
      .then(() => {
        alert('Story link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy:', err);
        alert('Failed to copy the link. Please try manually.');
      });
  };

  const nextSlide = (storyId, slides) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [storyId]: Math.min((prev[storyId] || 0) + 1, slides.length - 1),
    }));
  };

  const prevSlide = (storyId) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [storyId]: Math.max((prev[storyId] || 0) - 1, 0),
    }));
  };

  const isYouTubeLink = (url) => {
    const youtubeRegex = /(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return youtubeRegex.test(url);
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    return videoIdMatch ? `https://www.youtube.com/embed/${videoIdMatch[1]}` : null;
  };

  const handleEdit = (storyId) => {
    navigate(`/edit-story/${storyId}`);
  };

  return (
    <div className="home-container">
      <h1>Stories</h1>
      <div className="filter-category">
        <label htmlFor="category-select">Filter by category:</label>
        <select
          id="category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All</option>
          <option value="food">Food</option>
          <option value="health and fitness">Health & Fitness</option>
          <option value="travel">Travel</option>
          <option value="movie">Movie</option>
          <option value="education">Education</option>
        </select>
      </div>

      <div className="story-list">
        {loading ? (
          <div className="loading-spinner">Loading...</div>
        ) : (
          stories.length > 0 ? (
            stories.map((story) => {
              const currentSlide = currentSlides[story._id] || 0;
              const slide = story.slides[currentSlide];
              const isLiked = likedSlides[story._id]?.includes(currentSlide);
              const isBookmarked = bookmarkedStories[story._id] || false;

              return (
                <div key={story._id} className="story-card">
                  <div className="story-header">
                    <div className="header-left">
                      <p className="user-name-circle">
                        <strong>{(story.author?.username || 'Author').slice(0,15)}</strong>
                      </p>
                    </div>
                    <div className="header-right">
                      <h3>{story.title}</h3>
                    </div>
                  </div>

                  {story.slides && story.slides.length > 0 ? (
                    <div className="story-slide-container">
                      <div className="slide">
                        {slide.image && (
                          <img
                            src={slide.image}
                            alt={`Slide ${currentSlide + 1}`}
                            className="slide-image"
                          />
                        )}

                        {slide.video && isYouTubeLink(slide.video) ? (
                          <iframe
                            src={getYouTubeEmbedUrl(slide.video)}
                            title="YouTube video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        ) : (
                          slide.video && (
                            <video
                              ref={(el) => (videoRefs.current[story._id] = el)}
                              autoPlay
                              muted
                              controls
                              className="slide-video"
                            >
                              <source
                                src={slide.video}
                                type="video/mp4"
                              />
                              <p>Your browser does not support the video tag.</p>
                            </video>
                          )
                        )}

                        {slide.text && (
                          <p className="slide-text">
                            {slide.text}
                          </p>
                        )}

                        {story.slides.length > 1 && (
                          <>
                            <button
                              onClick={() => prevSlide(story._id)}
                              className="nav-button left"
                              aria-label="Previous Slide"
                            >
                              &lt;
                            </button>
                            <button
                              onClick={() => nextSlide(story._id, story.slides)}
                              className="nav-button right"
                              aria-label="Next Slide"
                            >
                              &gt;
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p>No slides available for this story.</p>
                  )}

                  <div className="story-actions">
                    <div className="like-container">
                      <button
                        onClick={() => handleLike(story._id, currentSlide)}
                        className={`like-button ${isLiked ? 'liked' : ''}`}
                        aria-label="Like Slide"
                      >
                        <FaHeart />
                      </button>
                      <span className="like-count">
                        {slide.likes || 0}
                      </span>
                    </div>

                    <button
                      onClick={() => handleBookmark(story._id)}
                      className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
                      aria-label="Bookmark Story"
                    >
                      <FaBookmark />
                    </button>

                    <button
                      onClick={() => handleDownload(story.slides)}
                      className="download-button"
                      aria-label="Download Slides"
                    >
                      <FaDownload />
                    </button>

                    <button
                      onClick={() => handleShare(story._id)}
                      className="share-button"
                      aria-label="Share Story"
                    >
                      <FaShareAlt />
                    </button>

                    <button
                      onClick={() => handleEdit(story._id)}
                      className="edit-button"
                      aria-label="Edit Story"
                    >
                      <FaEdit />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No stories available in this category.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
