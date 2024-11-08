// 날짜 관리 훅

import { useState, useEffect } from 'react';
import {
  getCurrentYearAndWeek,
  getWeekAndFirstSundayDate,
} from '../utils/dateUtil';

export const useWeeklyDate = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [year, setYear] = useState(getCurrentYearAndWeek(new Date()).year);
  const [week, setWeek] = useState(getCurrentYearAndWeek(new Date()).week);
  const [currentMonth, setCurrentMonth] = useState('');
  const [weekNumber, setWeekNumber] = useState(0);
  const [firstSundayDateString, setFirstSundayDateString] = useState('');
  const [isCurrentWeek, setIsCurrentWeek] = useState(true); // 현재 주차 여부

  // 현재 주차와 비교하
  const updateCurrentWeek = (newDate) => {
    const current = getCurrentYearAndWeek(new Date());
    const { year: newYear, week: newWeek } = getCurrentYearAndWeek(newDate);
    setIsCurrentWeek(current.year === newYear && current.week === newWeek);
  };

  // 날짜, 월, 주차 업데이트
  useEffect(() => {
    const { week, firstSundayDate } = getWeekAndFirstSundayDate(currentDate);
    setWeekNumber(week);
    setFirstSundayDateString(firstSundayDate.toLocaleDateString());

    const monthNames = [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ];
    setCurrentMonth(monthNames[firstSundayDate.getMonth()]);
  }, [currentDate]);

  // 주차 변경 함수
  const handleWeekChange = (delta) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + delta * 7);
    updateCurrentWeek(newDate);
    const { year: newYear, week: newWeek } = getCurrentYearAndWeek(newDate);
    setCurrentDate(newDate);
    setYear(newYear);
    setWeek(newWeek);
  };

  const handleDecreaseWeek = () => handleWeekChange(-1);
  const handleIncreaseWeek = () => {
    if (!isCurrentWeek) handleWeekChange(1);
  };

  return {
    year,
    week,
    currentMonth,
    currentDate,
    weekNumber,
    firstSundayDateString,
    handleDecreaseWeek,
    handleIncreaseWeek,
    isCurrentWeek,
  };
};
