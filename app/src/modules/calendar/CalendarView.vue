<script lang="ts" setup>
import { range } from 'lodash';
import moment from 'moment';

const today = +moment().format('D');
const calendar = createCalendarMonth();

function createCalendarMonth() {
  const startOfMonth = () => moment().startOf('month');
  const endOfMonth = () => moment().endOf('month');
  const startOfWeekOfLastMonth = () => startOfMonth().startOf('week');
  const endOfLastMonth = () => startOfWeekOfLastMonth().endOf('month');
  const endOfCalendar = () => endOfMonth().endOf('week');
  const lastMonthDays = range(+startOfWeekOfLastMonth().format("D"), +endOfLastMonth().format("D")+1);
  const monthDays = range(+startOfMonth().format("D"), +endOfMonth().format("D")+1);
  const nextMonthDays = range(1, +endOfCalendar().format("D")+1);
  const weekdays = moment.weekdaysShort();
  return {
    weekdays,
    lastMonthDays,
    monthDays,
    nextMonthDays,
  };
}
</script>

<template>
  <div class="calendar-view">
    <div>Today: {{ moment().format("ddd, MMM DD, YYYY") }}</div>
    <div class="days-grid">
      <div v-for="day of calendar.weekdays" :key="day" class="day">{{ day }}</div>
      <div v-for="day of calendar.lastMonthDays" :key="day" class="day last-month">{{ day }}</div>
      <div v-for="day of calendar.monthDays" :key="day" class="day" :class="{today: day === today}">{{ day }}</div>
      <div v-for="day of calendar.nextMonthDays" :key="day" class="day next-month">{{ day }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.days-grid {
  display: flex;
  flex-wrap: wrap;
  width: 700px;
}

.day {
  width: 100px;
  height: 100px;
  padding: 10px;
  background-color: white;
  border: 1px solid #ccc;
}

.today {
  color: var(--light-purple-font);
  background-color: var(--light-purple-bg);
}

.last-month, .next-month {
  background-color: #eee;
}
</style>
