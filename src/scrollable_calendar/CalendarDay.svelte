<script lang="ts">
  interface Props {
    date: Date;
    isLastWeek: boolean;
    isLastDayOfMonth: boolean;
  }

  let { date, isLastWeek, isLastDayOfMonth }: Props = $props();
</script>

<div
  class="w-8 p-2 text-center border-r border-b border-gray-200 day-cell {isLastWeek
    ? 'day-last-week'
    : ''} {isLastDayOfMonth ? 'day-last-of-month' : ''} order-{date.getDay() ===
  0
    ? 7
    : date.getDay()}"
>
  {date.getDate()}
</div>

<style>
  .day-cell {
    margin-right: -1px;
    margin-bottom: -1px;
  }

  .day-cell:first-child {
    border-left-width: 1px;
  }

  .day-cell:first-child {
    border-left-width: 1px;
  }

  .day-last-week {
    border-bottom-color: var(--color-gray-400);
    border-bottom-width: 2px;
    z-index: 1;
  }

  .day-last-of-month {
    border-right-color: var(--color-gray-400);
    border-right-width: 2px;
  }

  .day-last-of-month + :global(.day-cell) {
    margin-left: -1px !important;
  }
</style>
