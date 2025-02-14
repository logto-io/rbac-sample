import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Article {
  id: number;
  title: string;
  content: string;
  status: 'DRAFT' | 'PUBLISHED';
  author: string;
  createdAt: string;
}

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    // Mock data - In real app, fetch article data here
    setArticle({
      id: Number(id),
      title: 'Getting Started with RBAC',
      content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
      status: 'PUBLISHED',
      author: 'John Doe',
      createdAt: '2024-03-20'
    });
  }, [id]);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-600 hover:text-gray-900 text-sm flex items-center"
          >
            ← Back to Dashboard
          </button>
          <span className={`px-2 text-xs leading-5 font-semibold rounded-full ${
            article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {article.status}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <span className="mr-4">By {article.author}</span>
            <span>{article.createdAt}</span>
          </div>

          <div className="prose max-w-none">
            {article.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleView; 