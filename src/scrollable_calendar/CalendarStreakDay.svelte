<script lang="ts">
  interface Props {
    date: Date;
    isLastWeek: boolean;
    isLastDayOfMonth: boolean;
    streakType: StreakType | null;
  }
  export type StreakType = "start" | "middle" | "end" | "isolated";

  let { date, isLastWeek, isLastDayOfMonth, streakType }: Props = $props();
</script>

<div
  class="flex flex-1 items-center justify-center min-w-2 text-xs [&:not(:last-child)]:border-r border-b border-gray-200 relative
  {isLastWeek ? 'day-last-week' : ''}
  {isLastDayOfMonth ? 'day-last-of-month' : ''}"
>
  <div
    class="bg-primary-600 opacity-20 w-auto h-1/2 absolute
      {streakType === 'start'
      ? 'rounded-tl-full rounded-bl-full left-1/3 right-0'
      : ''}
      {streakType === 'middle' ? 'left-0 right-0' : ''}
      {streakType === 'end'
      ? 'rounded-tr-full rounded-br-full left-0 right-1/3'
      : ''}
      {streakType === 'isolated' ? 'w-2/3 rounded-full left-1/3 right-1/3' : ''}
      "
  ></div>
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
