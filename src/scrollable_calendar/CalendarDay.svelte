<script lang="ts">
  interface Props {
    date: Date;
    isLastWeek: boolean;
    isLastDayOfMonth: boolean;
  }

  let { date, isLastWeek, isLastDayOfMonth }: Props = $props();
</script>

<div
  class="w-12 p-2 text-center text-xs [&:not(:last-child)]:border-r border-b border-gray-200 day-cell {isLastWeek
    ? 'day-last-week'
    : ''} {isLastDayOfMonth ? 'day-last-of-month' : ''} order-{date.getDay() ===
  0
    ? 7
    : date.getDay()}"
>
  {date.getDate()}
</div>

<style>
  .day-last-week {
    border-bottom-color: var(--color-gray-400);
    border-bottom-width: 2px;
    z-index: 1;
  }

  .day-last-of-month {
    border-right-color: var(--color-gray-400);
    border-right-width: 2px;
  }
</style>
