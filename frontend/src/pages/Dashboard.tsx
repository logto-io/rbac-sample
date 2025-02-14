import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLogto } from "@logto/react";
import { useApi } from "../hooks/use-api";
import { toast } from "react-hot-toast";
import { useUserData } from "../hooks/use-user-data";

interface Article {
  id: string;
  title: string;
  isPublished: boolean;
  ownerId: string;
  createdAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useLogto();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const { userScopes, userId } = useUserData();
  const api = useApi();

  const fetchArticles = useCallback(async () => {
    try {
      const data = await api("/api/articles");
      setArticles(data);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handlePublishToggle = async (article: Article) => {
    try {
      await api(`/api/articles/${article.id}/published`, {
        method: "PATCH",
      });
      await fetchArticles();
      toast.success(
        `Article ${
          article.isPublished ? "unpublished" : "published"
        } successfully`
      );
    } catch (error) {
      console.error("Failed to toggle publish status:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    try {
      await api(`/api/articles/${id}`, {
        method: "DELETE",
      });
      await fetchArticles();
      toast.success("Article deleted successfully");
    } catch (error) {
      console.error("Failed to delete article:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-gray-600">Loading articles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Articles Dashboard
          </h1>
          <button
            onClick={() => signOut("http://localhost:5173")}
            className="text-gray-600 hover:text-gray-900 px-4 py-2 rounded-md border border-gray-300 text-sm transition-colors hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>

        {userScopes.includes("create:articles") && (
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => navigate("/articles/new")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              + Create article
            </button>
          </div>
        )}

        {articles.length === 0 && (
          <div className="text-gray-600">No articles found</div>
        )}

        {articles.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
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
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          article.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {article.isPublished ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {(userScopes.includes("update:articles") ||
                        article.ownerId === userId) && (
                        <button
                          onClick={() =>
                            navigate(`/articles/${article.id}/edit`)
                          }
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                      )}
                      {userScopes.includes("publish:articles") && (
                        <button
                          onClick={() => handlePublishToggle(article)}
                          className={`${
                            article.isPublished
                              ? "text-yellow-600 hover:text-yellow-900"
                              : "text-green-600 hover:text-green-900"
                          } mr-4`}
                        >
                          {article.isPublished ? "Unpublish" : "Publish"}
                        </button>
                      )}
                      {(userScopes.includes("delete:articles") ||
                        article.ownerId === userId) && (
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
