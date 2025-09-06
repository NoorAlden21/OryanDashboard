import React, { useState } from 'react';

const ArticleForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-2xl font-semibold text-tahiti">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-teal-500 rounded"
            placeholder="Enter article title"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-2xl font-semibold text-tahiti">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-teal-500 rounded"
            rows="10"
            placeholder="Enter article content"
          />
        </div>

        <button type="submit" className="px-4 py-2 text-white bg-teal-500 rounded ">
          Add Article
        </button>
      </form>
    </div>
  );
};

export default ArticleForm;