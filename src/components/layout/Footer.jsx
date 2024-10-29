import styled from 'styled-components';
import HomeIcon from '@mui/icons-material/Home'; // 홈 아이콘
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalculateIcon from '@mui/icons-material/Calculate'; // 계산기 아이콘
import StarIcon from '@mui/icons-material/Star'; // 별 아이콘
import PersonIcon from '@mui/icons-material/Person'; // 사람 아이콘
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import LoginModal from '../common/LoginModal';
import { useAuth } from '../../context/Auth/AuthContext';

const Footer = () => {
  const { state } = useAuth();
  const { isAuthenticated } = state;
  const navigate = useNavigate(); // 페이지 전환을 위한 navigate 함수
  const location = useLocation(); // 현재 경로 정보를 가져옴
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리

  // 경로를 변경하는 핸들러 함수
  const handleNavigate = (path) => {
    if (path === '/my' || path === '/budget') {
      if (!isAuthenticated) {
        setIsModalOpen(true); // 모달 열기
      } else {
        navigate(path); // 로그인 되어 있으면 이동
      }
    } else {
      navigate(path);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleConfirmLogin = () => {
    navigate('/login'); // 로그인 페이지로 이동
  };

  return (
    <>
      <FooterContainer>
        <IconWrapper
          isActive={location.pathname === '/recipe'}
          onClick={() => handleNavigate('/recipe')}
        >
          <MenuBookIconStyled />
          <Text>전체레시피</Text>
        </IconWrapper>
        <IconWrapper
          isActive={location.pathname === '/budget'}
          onClick={() => handleNavigate('/budget')}
        >
          <CalculateIconStyled />
          <Text>예산관리</Text>
        </IconWrapper>

        <IconWrapper
          isActive={location.pathname === '/home'}
          onClick={() => handleNavigate('/home')}
        >
          <HomeIconStyled />
          <Text>메인</Text>
        </IconWrapper>

        <IconWrapper
          isActive={location.pathname === '/favorite'}
          onClick={() => handleNavigate('/favorite')}
        >
          <StarIconStyled />
          <Text>북마크</Text>
        </IconWrapper>
        <IconWrapper
          isActive={location.pathname === '/my'}
          onClick={() => handleNavigate('/my')}
        >
          <PersonIconStyled />
          <Text>내정보</Text>
        </IconWrapper>
      </FooterContainer>

      <LoginModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogin}
      />
    </>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  height: 73px;
  width: 100%;
  display: flex;
  justify-content: space-between; /* 각 아이콘 사이의 간격을 균등하게 */
  align-items: center;
  background-color: #f8f9fa;
`;

const IconWrapper = styled.div`
  flex: 1; /* 각 아이콘이 동일한 비율을 차지하도록 설정 */
  cursor: pointer;
  font-size: 12px; /* 아이콘 크기 조정 */
  color: #333; /* 아이콘 색상 */
  text-align: center; /* 텍스트 가운데 정렬 */

  /* 현재 경로와 일치하면 색상 변경 */
  color: ${({ isActive }) => (isActive ? '#007bff' : '#333')};

  &:hover {
    color: #007bff; /* 호버 시 색상 변경 */
  }
`;

const HomeIconStyled = styled(HomeIcon)`
  /* 민혁: 아이콘 크기 수정 시, 기본 크기 덮어써야함 (width, height 동작 안함) */
  font-size: 32px !important; /* 아이콘 크기 조정 */
`;

const MenuBookIconStyled = styled(MenuBookIcon)`
  /* 민혁: 아이콘 크기 수정 시, 기본 크기 덮어써야함 (width, height 동작 안함) */
  font-size: 32px !important; /* 아이콘 크기 조정 */
`;

const CalculateIconStyled = styled(CalculateIcon)`
  /* 민혁: 아이콘 크기 수정 시, 기본 크기 덮어써야함 (width, height 동작 안함) */
  font-size: 32px !important; /* 아이콘 크기 조정 */
`;

const StarIconStyled = styled(StarIcon)`
  /* 민혁: 아이콘 크기 수정 시, 기본 크기 덮어써야함 (width, height 동작 안함) */
  font-size: 32px !important; /* 아이콘 크기 조정 */
`;

const PersonIconStyled = styled(PersonIcon)`
  /* 민혁: 아이콘 크기 수정 시, 기본 크기 덮어써야함 (width, height 동작 안함) */
  font-size: 32px !important; /* 아이콘 크기 조정 */
`;

const Text = styled.span`
  display: block; /* 텍스트를 블록으로 설정하여 아이콘 아래에 위치하도록 함 */
  font-size: 10px; /* 텍스트 크기 조정 */
  margin-top: 2px; /* 아이콘과 텍스트 사이의 간격 조정 */
`;
