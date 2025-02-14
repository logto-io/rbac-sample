import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogto } from '@logto/react';

interface Article {
  id: number;
  title: string;
  status: 'DRAFT' | 'PUBLISHED';
  author: string;
  createdAt: string;
}

const mockArticles: Article[] = [
  {
    id: 1,
    title: "Getting Started with RBAC",
    status: "PUBLISHED",
    author: "John Doe",
    createdAt: "2024-03-20"
  },
  {
    id: 2,
    title: "Understanding Content Management",
    status: "DRAFT",
    author: "Jane Smith",
    createdAt: "2024-03-21"
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useLogto();
  const [articles] = useState<Article[]>(mockArticles);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Articles Dashboard</h1>
          <button
            onClick={() => signOut('http://localhost:5173')}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-300 text-sm transition-colors hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => navigate('/articles/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            + Create article
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => navigate(`/articles/${article.id}`)}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors text-left"
                    >
                      {article.title}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      article.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.author}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{article.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => navigate(`/articles/${article.id}/edit`)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                    {article.status === 'DRAFT' && (
                      <button className="text-green-600 hover:text-green-900 mr-4">
                        Publish
                      </button>
                    )}
                    <button className="text-red-600 hover:text-red-900">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 