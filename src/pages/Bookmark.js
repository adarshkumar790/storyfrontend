// src/components/Bookmark.js
import React, { useEffect, useState } from 'react';
import api from '../services/api'; // Import your axios instance

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Function to fetch user's bookmark details
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('authToken'); // Get the token from local storage
        if (!token) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Fetch user profile to get bookmark IDs
        const userResponse = await api.get('/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Log the user response to check if the structure is correct
        console.log('User Response:', userResponse.data);

        const user = userResponse.data;
        const bookmarkIds = user.bookmarks || []; // Ensure bookmarkIds is an array

        // Log the bookmark IDs to verify if they exist
        console.log('Bookmark IDs:', bookmarkIds);

        if (bookmarkIds.length === 0) {
          setLoading(false);
          setError('No bookmarks found');
          return;
        }

        // Fetch each bookmark's details by its _id
        const bookmarkDetailsPromises = bookmarkIds.map((id) =>
          api.get(`/stories/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include token for each bookmark request
            },
          })
        );

        const bookmarkResponses = await Promise.all(bookmarkDetailsPromises);
        console.log('Bookmark Responses:', bookmarkResponses); // Log all bookmark responses

        const bookmarkDetails = bookmarkResponses.map((response) => response.data);
        console.log('Bookmark Details:', bookmarkDetails); // Log the final details

        setBookmarks(bookmarkDetails); // Update state with the bookmark details
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookmarks:', error.response ? error.response.data : error.message);
        setError('Error fetching bookmarks');
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  // Display a loading state while fetching
  if (loading) {
    return <p>Loading...</p>;
  }

  // Display an error if there's any issue fetching the bookmarks
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Bookmarked Stories</h2>
      {bookmarks.length === 0 ? (
        <p>No bookmarks available</p>
      ) : (
        <ul>
          {bookmarks.map((story) => (
            <li key={story._id}>
              <h3>{story.title}</h3>
              <p>Author: {story.author?.username}</p>
              <p>Category: {story.category}</p>
              <p>Created on: {new Date(story.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Bookmark;
