import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/Auth/AuthContext';

const ProtectedRoute = ({ element, isAdmin = false }) => {
  const { state } = useAuth(); // 인증 상태와 사용자 정보를 가져옴
  const { isAuthenticated, user } = state; // 인증 여부와 사용자 정보를 구조 분해 할당

  console.log(isAuthenticated);
  console.log(user);

  // 관리자 전용 라우트인 경우, 사용자가 인증되지 않았거나 관리자가 아닐 때
  if (isAdmin && (!isAuthenticated || user.role !== 'ROLE_ADMIN')) {
    return <Navigate to="/home" />; // 홈 페이지로 리디렉션
  }

  // 인증된 사용자 전용 라우트인 경우, 사용자가 로그인하지 않았을 때
  if (!isAuthenticated) {
    return <Navigate to="/login" />; // 로그인 페이지로 리디렉션
  }

  return element; // 보호된 컴포넌트를 렌더링
};

export default ProtectedRoute;
