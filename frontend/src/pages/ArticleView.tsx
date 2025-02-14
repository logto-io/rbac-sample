import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/use-api';
import { toast } from 'react-hot-toast';

interface Article {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  ownerId: string;
  createdAt: string;
}

const ArticleView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchArticle = useCallback(async () => {
    try {
      const data = await api(`/api/articles/${id}`);
      setArticle(data);
    } catch (error) {
      console.error('Failed to fetch article:', error);
      toast.error('Failed to load article');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [api, id, navigate]);

  useEffect(() => {
    fetchArticle();
  }, [fetchArticle, id]);

  if (loading || !article) {
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
            article.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {article.isPublished ? 'PUBLISHED' : 'DRAFT'}
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
          
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
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