import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/use-api';
import { toast } from 'react-hot-toast';

interface ArticleForm {
  title: string;
  content: string;
}

const ArticleEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const api = useApi();

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<ArticleForm>({
    title: '',
    content: ''
  });

  const fetchArticle = useCallback( async () => {
    try {
      const article = await api(`/api/articles/${id}`);
      setFormData({
        title: article.title,
        content: article.content
      });
    } catch (error) {
      console.error('Failed to fetch article:', error);
      toast.error('Failed to load article');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [api, id, navigate]);

  useEffect(() => {
    if (isEditing) {
      fetchArticle();
    } else {
      setLoading(false);
    }
  }, [fetchArticle, isEditing]);

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await api(`/api/articles/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData)
        });
        toast.success('Article updated successfully');
      } else {
        await api('/api/articles', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        toast.success('Article created successfully');
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save article:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} article`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-600">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Edit Article' : 'Create New Article'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                id="content"
                rows={10}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {isEditing ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleEdit; 