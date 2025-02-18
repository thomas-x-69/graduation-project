// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import Designer from "./pages/Designer";
import ARPage from "./pages/ARPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="w-screen h-screen overflow-hidden">
          <Routes>
            <Route path="/" element={<Designer />} />
            <Route path="/ar" element={<ARPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
