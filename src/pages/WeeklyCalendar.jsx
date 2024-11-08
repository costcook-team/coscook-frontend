import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // 캘린더 기본 스타일 적용
import styled from 'styled-components';

const WeeklyCalendar = ({ currentDate }) => {
  // props로 currentDate 받기
  const [dates, setDates] = useState([currentDate]);

  useEffect(() => {
    // 시작 요일과 끝 요일
    const startOfWeek = moment(currentDate).startOf('week'); // 일요일 기준
    const endOfWeek = moment(currentDate).endOf('week'); // 토요일 기준
    setDates([startOfWeek.toDate(), endOfWeek.toDate()]); // 날짜 배열 설정
  }, [currentDate]);

  const tileClassName = ({ date }) => {
    return dates.some((selectedDate) =>
      moment(selectedDate).isSame(date, 'day') ? 'selected' : ''
    );
  };

  return (
    <div className="WeeklyCalendar">
      <StyledCalendar
        value={dates} // 기본 선택된 날짜로 currentDate 사용
        // 일요일부터 시작하는 코드
        calendarType="hebrew"
        // 년단위 이동 제거
        nextLabel={null}
        prevLabel={null}
        next2Label={null}
        prev2Label={null}
        formatDay={(locale, datetime) => moment(datetime).format('D')}
        formatMonthYear={(locale, datetime) =>
          moment(datetime).format('YYYY. MM')
        }
        minDetail="year"
        tileClassName={tileClassName} // 날짜 셀 클래스 추가
      />
    </div>
  );
};

export default WeeklyCalendar;

const StyledCalendar = styled(Calendar)`
  border: 1.5px solid gray;
  border-radius: 20px;
  width: 100%;
  height: 300px;
  .react-calendar__month-view__weekdays abbr {
    font-size: 14px;
    font-family: 'GmarketSansMedium';
    text-decoration: none;
    font-weight: 800;
  }

  .react-calendar__navigation {
    justify-content: center;
  }

  .react-calendar__navigation__label {
    font-size: 20px;
    font-family: 'GumiRomanceTTF';
    flex-grow: 0 !important;
  }

  .react-calendar__month-view__weekdays__weekday:nth-of-type(1) abbr {
    color: red;
  }

  .react-calendar__month-view__weekdays__weekday:nth-of-type(6) abbr,
  .react-calendar__month-view__weekdays__weekday:nth-of-type(7) abbr {
    color: inherit;
  }

  .react-calendar__tile {
    font-size: 16px;
    font-family: 'BMJUA';
    color: black !important;
  }

  .react-calendar__tile.selected {
    background-color: rgba(255, 0, 0, 0.3);
    color: black !important;
  }
  .react-calendar__navigation button:active,
  .react-calendar__navigation button:focus,
  .react-calendar__navigation button:hover {
    background-color: transparent;
    color: inherit;
  }

  .react-calendar__tile--now {
    background: none !important;
  }
  .react-calendar__tile--active:enabled:hover,
  .react-calendar__tile--active:enabled:focus,
  .react-calendar__tile--hasActive:enabled:hover,
  .react-calendar__tile--hasActive:enabled:focus,
  .react-calendar__tile--hasActive,
  .react-calendar__tile--active {
    font-weight: bold;
    font-size: 20px;
    background: #006edc !important;
  }

  /* 네비게이션 텍스트 클릭 비활성화 */
  .react-calendar__navigation__label {
    pointer-events: none; /* 클릭 이벤트 비활성화 */
  }

  /* 토요일에 파란 폰트 */
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title='토요일'] {
    color: #2e7af2;
  }

  /* 이전 달과 다음 달의 날짜 숫자들의 색상 변경 */
  .react-calendar__month-view__days__day--neighboringMonth {
    abbr {
      color: #bdbdbd !important;
    }
  }

  /* 호버 이벤트 제거 */
  .react-calendar__tile:hover,
  .react-calendar__tile:focus {
    background-color: inherit;
    cursor: default; /* 마우스 커서도 기본으로 변경 */
  }
  /* 전체 클릭 비활성화 */
  .react-calendar__tile {
    pointer-events: none; /* 클릭 비활성화 */
  }
`;
