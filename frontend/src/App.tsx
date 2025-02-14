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

import { LogtoProvider } from "@logto/react";

const logtoConfig = {
  appId: "i4y1dfprocho4wry453o2",
  endpoint: "https://wwgsyp.logto.app/",
};

function App() {
  return (
    <LogtoProvider config={logtoConfig}>
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
