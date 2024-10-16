import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid2, Radio, RadioGroup, Slide, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

import Layout from '../components/layout/Layout';

const RecipePage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]); // DB 레시피 불러오기
  const [displayedRecipes, setDisplayedRecipes] = useState([]); // 화면에 보여줄 레시피
  const [itemsToShow, setItemsToShow] = useState(9); // 처음 보여줄 레시피 개수 (3*3)
  const [loading, setLoading] = useState(true); // 로딩 상태 초기화

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/recipe/');
        setRecipes(res.data); // 백엔드에서 가져온 데이터를 상태에 저장
        setDisplayedRecipes(res.data.slice(0, itemsToShow)); // 처음 9개의 레시피 설정
      } catch (error) {
        console.error("페이지를 찾을 수 없습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 추가 레시피 로드
  const loadMoreRecipes = () => {
    if (itemsToShow < recipes.length) {
      const newItemsToShow = itemsToShow + 3; // 추가 3개
      setItemsToShow(newItemsToShow); // 아이템 개수 업데이트
      setDisplayedRecipes(recipes.slice(0, newItemsToShow)); // 추가 레시피 업데이트
    }
  };

  // 스크롤 이벤트 핸들러
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5) { // 스크롤 바닥에 도달시
      loadMoreRecipes(); // 추가 레시피 로드
    }
  };

  // 필터 모달 상태 관리
  const [filterOpen, setfilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('조회순');
  const [starOrder, setStarOrder] = useState('별점순');
  const [starRating, setStarRating] = useState('0');

  // 필터 모달 열기
  const handleOpenFilter = () => {
    setfilterOpen(true);
  };

  // 필터 모달 닫기
  const handleCloseFilter = () => {
    setfilterOpen(false);
  };

  // 모달 영역 밖 클릭 시 모달 닫기
  const handleModalClose = (e) => {
    if (e.target.id === "modal-background") {
      handleCloseFilter();
    }
  };

  return (
    <Layout>
      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {/* 뒤로가기 : 일단 홈으로 이동 */}
          <Button variant="outlined" onClick={() => navigate('/')}>
            뒤로가기
          </Button>
          <Typography variant="h5" sx={{ mx: 2 }}>
            레시피 전체 목록
          </Typography>
          <Button variant="outlined" sx={{ marginLeft: 'auto' }} onClick={handleOpenFilter}>
            필터링
          </Button>
        </Box>

        <Box onScroll={handleScroll} sx={{ overflowY: 'auto', maxHeight: '80vh', border: '1px solid #ccc', padding: 1 }}>
          {/* 레시피 리스트를 3 x 3 그리드로 나누기 */}
          <Grid2 container spacing={2}>
            {displayedRecipes.map((recipe) => ( // 변경: displayedRecipes로 매핑
              <Grid2 size={{ xs: 6, sm: 4, md: 4 }} key={recipe.id}>
                <Box
                  sx={{
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    padding: 2,
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6">{recipe.id}</Typography>
                  <Typography variant="body2">{recipe.title}</Typography>
                </Box>
              </Grid2>
            ))}
          </Grid2>

          {/* 스크롤 로딩중인 경우 */}
          {loading && <Typography align='center'>로딩 중...</Typography>}

          <Box sx={{ textAlign: 'center', marginTop: 4 }}>
            <Typography variant="body1">아래로 스크롤 하세요</Typography>
          </Box>
        </Box>

        {/* 필터 모달 */}
        {filterOpen && (
          <Box
            id="modal-background"
            onClick={handleModalClose}  // 모달 바깥 클릭 시 닫기
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 반투명 배경
              zIndex: 1000,  // 다른 요소들 위에 위치
            }}
          >
            <Slide direction="up" in={filterOpen} mountOnEnter unmountOnExit onClick={(e) => e.stopPropagation()}>
              <Box
                sx={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'white',
                  boxShadow: '0 -2px 10px rgba(0, 0, 0, 0.2)',
                  p: 2,
                  borderTopLeftRadius: '8px',
                  borderTopRightRadius: '8px',
                }}
              >
                <Typography variant="h6" align="center">검색필터</Typography>
                <Typography variant="subtitle1">조회 순서</Typography>
                <RadioGroup value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} row>
                  <FormControlLabel value="조회순" control={<Radio />} label="조회순" />
                  <FormControlLabel value="평점순" control={<Radio />} label="평점순" />
                </RadioGroup>

                <Typography variant="subtitle1" sx={{ mt: 2 }}>별점 필터</Typography>
                <RadioGroup value={starRating} onChange={(e) => setStarRating(e.target.value)} row>
                  <FormControlLabel value="0" control={<Radio />} label="0개" />
                  <FormControlLabel value="1" control={<Radio />} label="1개" />
                </RadioGroup>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Button onClick={handleCloseFilter}>취소</Button>

                  {/* 필터링 백엔드 아직 미구현 */}
                  <Button>적용</Button>
                </Box>
              </Box>
            </Slide>
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default RecipePage;
