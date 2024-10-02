// src/components/Bookmark.js
import React, { useEffect, useState } from 'react';
import api from '../services/api'; 

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    
    const fetchBookmarks = async () => {
      try {
        const token = localStorage.getItem('authToken'); 
        if (!token) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        
        const userResponse = await api.get('/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

    
        console.log('User Response:', userResponse.data);

        const user = userResponse.data;
        const bookmarkIds = user.bookmarks || []; 

        
        console.log('Bookmark IDs:', bookmarkIds);

        if (bookmarkIds.length === 0) {
          setLoading(false);
          setError('No bookmarks found');
          return;
        }

        
        const bookmarkDetailsPromises = bookmarkIds.map((id) =>
          api.get(`/stories/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, 
            },
          })
        );

        const bookmarkResponses = await Promise.all(bookmarkDetailsPromises);
        console.log('Bookmark Responses:', bookmarkResponses); 

        const bookmarkDetails = bookmarkResponses.map((response) => response.data);
        console.log('Bookmark Details:', bookmarkDetails); 

        setBookmarks(bookmarkDetails); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookmarks:', error.response ? error.response.data : error.message);
        setError('Error fetching bookmarks');
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  
  if (loading) {
    return <p>Loading...</p>;
  }

  
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
