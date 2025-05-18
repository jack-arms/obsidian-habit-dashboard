<script lang="ts">
  import { moment, type App } from "obsidian";
  import type { HabitDayProgress } from "src/types";
  import { getContext } from "svelte";

  interface Props {
    date: moment.Moment;
    isLastWeek: boolean;
    isLastDayOfMonth: boolean;
    habitProgress: HabitDayProgress | null;
    streakType: StreakType | null;
  }
  export type StreakType = "start" | "middle" | "end" | "isolated";
  const app = getContext<App>("obsidian-app");

  let { date, isLastWeek, isLastDayOfMonth, habitProgress, streakType }: Props =
    $props();
  let today = moment();
  let isToday = $derived(date.isSame(today, "day"));
</script>

<div
  class="flex flex-1 items-center justify-center min-w-2 text-xs [&:not(:last-child)]:border-r border-b border-gray-200 relative
  {isLastWeek ? 'day-last-week' : ''}
  {isLastDayOfMonth ? 'day-last-of-month' : ''}
  {isToday ? 'font-bold' : ''}"
>
  {#if streakType != null}
    <div
      class="w-auto h-1/2 absolute bg-(--interactive-accent) opacity-50
      {streakType === 'start'
        ? 'rounded-tl-full rounded-bl-full left-1/3 right-0'
        : ''}
      {streakType === 'middle' ? 'left-0 right-0' : ''}
      {streakType === 'end'
        ? 'rounded-tr-full rounded-br-full left-0 right-1/3'
        : ''}
      {streakType === 'isolated'
        ? 'w-2/3 rounded-full left-1/3 right-1/3'
        : ''}"
    ></div>
  {/if}
  {#if habitProgress != null}
    <a
      class="flex flex-grow self-stretch items-center justify-center z-1 font-bold! text-(--text-accent)"
      href={habitProgress.noteHref}
      onclick={(e) => {
        e.preventDefault();
        app.workspace.openLinkText(
          habitProgress.noteHref,
          habitProgress.noteHref,
          false,
        );
      }}
    >
      {date.date()}
    </a>
  {:else}
    {date.date()}
  {/if}
  {#if isToday}
    <div
      class="w-12 h-12 rounded-full border-2 border-gray-600 border-dashed absolute"
    ></div>
  {/if}
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
