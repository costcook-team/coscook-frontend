import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Layout from '../components/layout/Layout';
import Carousel from '../components/common/Carousel/Carousel';
import { useLocation, useNavigate } from 'react-router-dom';
import { recommendAPI } from '../services/recommend.api';
import { useAuth } from '../context/Auth/AuthContext';
import { toast } from 'react-toastify';

const RecommendPage = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const budget = location.state.budget;
  const year = location.state.year;
  const week = location.state.week;
  const userId = location.state.userId;
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [remainingBudget, setRemainingBudget] = useState(budget);

  useEffect(() => {
    const fetchRecommendedRecipes = async () => {
      try {
        if (!state?.isAuthenticated) {
          const storedData = sessionStorage.getItem('recommendedRecipeList');
          if (storedData) {
            const parsedData = JSON.parse(storedData);

            // 세션 스토리지에서 가져온 레시피 목록을 상태에 설정
            setSelectedRecipes(parsedData.recipes);
            updateRemainingBudget(parsedData.recipes);
          }
        } else {
          const response = await recommendAPI.getRecommendedRecipes(year, week);
          if (response.data) {
            // 선택된 레시피 목록을 상태에 설정

            setSelectedRecipes(response.data.recipes);
            updateRemainingBudget(response.data.recipes);
          }
        }
      } catch (error) {
        console.error('Error fetching recommended recipes:', error);
      }
    };

    fetchRecommendedRecipes();
  }, [year, week]); // year와 week가 변경될 때마다 호출

  // 선택된 레시피 가격의 합을 계산하여 남은 예산을 업데이트하는 함수
  const updateRemainingBudget = () => {
    const totalSelectedCost = selectedRecipes.reduce(
      (sum, recipe) => sum + recipe.price / recipe.servings,
      0
    );
    setRemainingBudget(budget - totalSelectedCost);
  };

  useEffect(() => {
    updateRemainingBudget(); // selectedRecipes가 변경될 때마다 남은 예산 업데이트
  }, [selectedRecipes]);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipes((prevSelected) => {
      const isSelected = prevSelected.some((item) => item.id === recipe.id);

      if (!isSelected) {
        // 새로 추가하는 경우 예산 초과 여부를 확인
        const newTotalCost =
          prevSelected.reduce(
            (sum, item) => sum + item.price / item.servings,
            0
          ) +
          recipe.price / recipe.servings;

        if (newTotalCost > budget) {
          alert('예산을 초과하여 선택할 수 없습니다.');
          return prevSelected; // 예산을 초과할 경우 아무 것도 변경하지 않음
        }
      }

      // 선택을 해제하거나 새로 추가할 경우
      const newSelectedRecipes = isSelected
        ? prevSelected.filter((item) => item.id !== recipe.id) // 선택 해제
        : [...prevSelected, recipe]; // 새로 추가

      updateRemainingBudget(newSelectedRecipes); // 남은 예산 업데이트
      return newSelectedRecipes;
    });
  };

  const handleRemoveSelectRecipe = (recipe) => {
    setSelectedRecipes((prevSelected) => {
      const newSelectedRecipes = prevSelected.filter((r) => r.id !== recipe.id);
      updateRemainingBudget(newSelectedRecipes); // 남은 예산 업데이트
      return newSelectedRecipes;
    });
  };

  // 선택한 레시피를 DB에 저장하는 함수
  const handleCompleteSelection = async () => {
    const recommendedRecipes = selectedRecipes.map((recipe) => {
      return {
        year,
        weekNumber: week,
        avgRatings: recipe.avgRatings,
        favoriteCount: recipe.favoriteCount,
        recipeId: recipe.id,
        price: recipe.price,
        servings: recipe.servings,
        thumbnailUrl: recipe.thumbnailUrl,
        title: recipe.title,
        used: recipe.used !== undefined ? recipe.used : false,

        // 회원 비회원 구분
        userId: state?.isAuthenticated ? userId : undefined,
      };
    });

    try {
      // 예산 초기화
      setRemainingBudget(budget);

      // 비회원
      if (!state?.isAuthenticated) {
        // 기존 레시피 삭제
        sessionStorage.removeItem('recommendRecipeList');
        // 추천 레시피 저장
        const isSaved = saveToSessionStorage(year, week, recommendedRecipes);
        if (isSaved) {
          toast.info('레시피가 추가되었습니다.');
          navigate('/Home');
        } else {
          toast.info('오류가 발생했습니다.');
        }
      } else {
        // 기존 레시피 삭제
        await recommendAPI.deleteRecommendedRecipes(year, week);
        // 추천 레시피 저장
        const response = await recommendAPI.saveRecommendedRecipes(
          recommendedRecipes
        );
        if (response.status === 201) {
          alert('레시피가 성공적으로 추천 목록에 추가되었습니다.');
          navigate('/Home');
        } else {
          alert('레시피 추가 중 오류가 발생했습니다.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('서버에 연결할 수 없습니다.');
    }
  };

  // 세션 스토리지에 추천 레시피를 저장하는 함수
  const saveToSessionStorage = (year, week, recommendedRecipes) => {
    try {
      // 저장할 객체 생성
      const dataToStore = {
        year,
        week,
        recipes: recommendedRecipes.map((recipe) => ({
          avgRatings: recipe.avgRatings,
          favoriteCount: recipe.favoriteCount,
          id: recipe.recipeId,
          price: recipe.price,
          servings: recipe.servings,
          thumbnailUrl: recipe.thumbnailUrl,
          title: recipe.title,
          used: recipe.used !== undefined ? recipe.used : false,
        })),
      };

      // 세션 스토리지에 저장
      sessionStorage.setItem(
        'recommendedRecipeList',
        JSON.stringify(dataToStore)
      );

      return true; // 성공적으로 저장 시 true 반환
    } catch (error) {
      console.error('세션 스토리지 저장 중 오류:', error);
      return false; // 오류 발생 시 false 반환
    }
  };

  return (
    <Layout>
      <SelectedContainer>
        <SelectedListContainer>
          {selectedRecipes.length === 0 ? (
            <PlaceholderText>선택된 레시피 리스트가 출력됩니다</PlaceholderText> // 선택된 항목이 없을 때 placeholder 표시
          ) : (
            selectedRecipes.map((recipe) => (
              <SelectedList
                key={recipe.id}
                onClick={() =>
                  recipe.used != 1 ? handleRemoveSelectRecipe(recipe) : null
                }
                style={{
                  opacity: recipe.used == 1 ? 0.5 : 1,
                  backgroundColor:
                    recipe.used == 1 ? 'rgba(255, 0, 0, 0.3)' : 'transparent', // 사용된 레시피는 배경색을 빨강으로
                  cursor: recipe.used == 1 ? 'not-allowed' : 'pointer', // 사용된 레시피는 클릭할 수 없도록 커서 설정
                }}
              >
                <SelectedImage
                  src={`${import.meta.env.VITE_BASE_SERVER_URL}${
                    recipe.thumbnailUrl
                  }`}
                  alt={recipe.title}
                />

                <SelectedText>{recipe.title}</SelectedText>
              </SelectedList>
            ))
          )}
        </SelectedListContainer>
      </SelectedContainer>

      <RecommendContainer>
        <h4>▼ 20~40% </h4>
        <RecommendListContainer>
          <Carousel
            budget={budget}
            selectedRecipes={selectedRecipes}
            onSelect={handleSelectRecipe}
            remainingBudget={remainingBudget}
          />
        </RecommendListContainer>
      </RecommendContainer>

      <RecommendContainer>
        <h4>▼ 0~20%</h4>
        <RecommendListContainer>
          <Carousel
            budget={budget * 0.5}
            selectedRecipes={selectedRecipes}
            onSelect={handleSelectRecipe}
            remainingBudget={remainingBudget}
          />
        </RecommendListContainer>
      </RecommendContainer>
      <ShowBasicContainer>
        <ShowContainer>
          <p style={{ borderBottom: '1px solid black' }}>
            남은 금액 : {Math.round(remainingBudget).toLocaleString()}원
          </p>
        </ShowContainer>
        <ShowContainer>
          <Button onClick={handleCompleteSelection}>선택 완료</Button>
        </ShowContainer>
      </ShowBasicContainer>
    </Layout>
  );
};

export default RecommendPage;

const SelectedContainer = styled.div`
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  overflow: hidden; /* 카드 내부 내용이 넘어가는 것 방지 */
  max-height: 160px; /* 고정된 최대 높이 설정 */
  font-family: GmarketSansMedium;
`;

const SelectedListContainer = styled.div`
  width: 100%;
  height: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-x: hidden; /* 수평 스크롤 허용 */
  white-space: nowrap; /* 카드가 줄바꿈되지 않도록 설정 */
`;

const PlaceholderText = styled.div`
  height: 120px; /* SelectedList와 동일한 높이 설정 */
  width: 100px; /* SelectedList와 동일한 너비 설정 */
  display: flex;
  justify-content: center;
  align-items: center;
  color: gray; /* 회색 텍스트 색상 */
  font-style: italic; /* 이탤릭체로 표시 */
  text-align: center;
`;

const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 10px 5px;
  height: 120px;
  width: 100px;
`;
const SelectedImage = styled.img`
  height: 100px;
  width: 100px;
  object-fit: cover;

  min-width: 100px;
`;
const SelectedText = styled.div`
  height: 20px;
  width: 100px;
  /* 긴 텍스트가 잘리도록 설정 */
  white-space: nowrap; /* 줄바꿈 방지 */
  overflow: hidden; /* 넘치는 부분 숨기기 */
  text-overflow: ellipsis; /* 잘릴 때 '...'으로 표시 */
  width: 100%; /* 가로 크기 설정 */
`;

const RecommendContainer = styled.div`
  padding-top: 5px;
  width: 100%;
  /* border: 1px solid black; */
  text-align: left;
  display: flex;
  flex-direction: column;
`;
const RecommendListContainer = styled.div`
  padding-top: 5px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  font-family: GmarketSansMedium;
  /* border: 1px solid black; */
`;

const ShowBasicContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: auto;
  /* border: 1px black solid; */
  font-family: GmarketSansMedium;
`;

const ShowContainer = styled.div`
  height: 60px;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin-top: auto;
  /* border: 1px black solid; */
`;

const Button = styled.button`
  color: #bf4f74;
  width: 200px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #bf4f74;
  border-radius: 3px;
`;
