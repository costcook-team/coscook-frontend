import { useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import GlobalStyle from './styles/GlobalStyle';
import HomePage from './pages/HomePage';
import RecipePage from './pages/RecipePage';
import BudgetPage from './pages/BudgetPage';
import MyPage from './pages/MyPage';
import FavoritePage from './pages/FavoritePage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import LoginPage from './pages/LoginPage';
import PreLoginPage from './pages/PreLoginPage';
import OAuthVerification from './pages/OAuthVerification';
import { AuthProvider } from './context/Auth/AuthProvider';
import RecommendPage from './pages/RecommendPage';
import RecipeDetail from './pages/RecipeDetail';
import AdminRecipePage from './pages/admin/RecipePage';
import AdminIngredientPage from './pages/admin/IngredientPage';
import PageTransition from './components/common/PageTransition';
import RecipeIngredientPage from './pages/admin/RecipeIngredientPage';
import { useAuth } from './context/Auth/AuthContext';
import UserInfo from './pages/UserInfo';
import ItemList from './pages/ItemList';
import Activities from './pages/Activities';
import ProfileUpdate from './pages/ProfileUpdate';
import Review from './pages/Review';
import SignUpComplete from './pages/SignUpComplete';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const location = useLocation();
  return (
    <AuthProvider>
      <ToastContainer
        position="bottom-center" // 위치 설정
      />
      <GlobalStyle /> {/* 전역 스타일 적용 */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* 공용 라우트 */}
          <Route path="/" element={<PreLoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/oauth/:provider" element={<OAuthVerification />} />
          <Route
            path="/home"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/recipe"
            element={
              <PageTransition>
                <RecipePage />
              </PageTransition>
            }
          />
          <Route
            path="/recipeDetail"
            element={
              <PageTransition>
                <RecipeDetail />
              </PageTransition>
            }
          />
          <Route
            path="/favorite"
            element={
              <PageTransition>
                <FavoritePage />
              </PageTransition>
            }
          />
          <Route
            path="/search"
            element={
              <PageTransition>
                <SearchPage />
              </PageTransition>
            }
          />
          {/* 인증된 사용자 전용 보호된 라우트 */}
          <Route
            path="/budget"
            element={
              <ProtectedRoute
                element={
                  <PageTransition>
                    <BudgetPage />
                  </PageTransition>
                }
              />
            }
          />
          <Route
            path="/my"
            element={
              <ProtectedRoute
                element={
                  <PageTransition>
                    <MyPage />
                  </PageTransition>
                }
              />
            }
          />
          <Route
            path="/my/profile"
            element={<ProtectedRoute element={<UserInfo />} />}
          />
          <Route
            path="/recommend"
            element={
              <ProtectedRoute
                element={
                  <PageTransition>
                    <RecommendPage />
                  </PageTransition>
                }
              />
            }
          />
          <Route
            path="/activities"
            element={
              <ProtectedRoute
                element={
                  <PageTransition>
                    <Activities />
                  </PageTransition>
                }
              />
            }
          />
          <Route
            path="/signup/complete"
            element={<ProtectedRoute element={<SignUpComplete />} />}
          />
          <Route
            path="/profile/update"
            element={<ProtectedRoute element={<ProfileUpdate />} />}
          />
          {/* 관리자 전용 보호된 라우트 */}
          <Route
            path="/admin/ingredient"
            element={
              <ProtectedRoute element={<AdminIngredientPage />} isAdmin />
            }
          />
          <Route
            path="/admin/recipe"
            element={<ProtectedRoute element={<AdminRecipePage />} isAdmin />}
          />
          <Route
            path="/admin/recipeIngredient"
            element={
              <ProtectedRoute element={<RecipeIngredientPage />} isAdmin />
            }
          />
          {/* 추가 공용 라우트 */}
          <Route
            path="/list"
            element={
              <PageTransition>
                <ItemList />
              </PageTransition>
            }
          />
          <Route
            path="/review"
            element={
              <PageTransition>
                <Review />
              </PageTransition>
            }
          />
          {/* 찾을 수 없는 페이지 */}
          <Route path="*" element={<NotFoundPage />} /> {/* 404 페이지 */}
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
