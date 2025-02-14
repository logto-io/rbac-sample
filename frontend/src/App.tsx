import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ArticleEdit from "./pages/ArticleEdit";
import ArticleView from "./pages/ArticleView";
import Callback from "./pages/Callback";
import ProtectedRoute from "./components/ProtectedRoute";

import { LogtoProvider, LogtoConfig } from "@logto/react";
import { Toaster } from "react-hot-toast";
import { API_RESOURCE, LOGTO_APP_ID, LOGTO_ENDPOINT } from "./config";

const logtoConfig: LogtoConfig = {
  appId: LOGTO_APP_ID,
  endpoint: LOGTO_ENDPOINT,
  resources: [API_RESOURCE],
  scopes: [
    'list:articles',
    'create:articles',
    'read:articles',
    'update:articles',
    'delete:articles',
    'publish:articles',
  ],
};

function App() {
  return (
    <LogtoProvider config={logtoConfig}>
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/callback" element={<Callback />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/articles/new" element={<ArticleEdit />} />
            <Route path="/articles/:id" element={<ArticleView />} />
            <Route path="/articles/:id/edit" element={<ArticleEdit />} />
          </Route>          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LogtoProvider>
  );
}

export default App;
