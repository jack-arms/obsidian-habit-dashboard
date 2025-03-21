<script lang="ts">
  import { getCalendarRow, getWeekRowsByMonth } from "./CalendarUtils";
  import CalendarDay from "./CalendarDay.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    centerDate: Date;
    dayComponent: Snippet<
      [date: Date, isLastDayOfMonth: boolean, isLastWeek: boolean]
    >;
  }

  let { centerDate, dayComponent }: Props = $props();

  let weeksByMonth = $derived(
    (() => {
      let day = new Date(centerDate.valueOf());
      let rows = [getCalendarRow(day)];
      for (let i = 1; i < 12; i++) {
        day.setDate(day.getDate() - 7);
        rows = [getCalendarRow(day), ...rows];
      }
      return getWeekRowsByMonth(rows);
    })(),
  );
</script>

<div class="flex flex-col m-2 w-150 h-72 border-r border-b">
  <div class="flex flex-row bg-gray-100 font-bold border-b-2">
    <div class="p-2 w-8 border-r bg-white"></div>
    <div class="flex flex-row flex-1 border-t">
      {#each ["M", "Tu", "W", "Th", "F", "Sa", "Su"] as day}
        <div
          class="flex flex-1 min-w-2 p-2 [&:not(:last-child)]:border-r z-2 border-gray-600 justify-center day-label"
        >
          {day}
        </div>
      {/each}
    </div>
  </div>
  <div
    class="w-full overflow-y-scroll relative r-0 flex flex-col items-stretch"
  >
    {#each weeksByMonth.entries() as [month, weeks]}
      <div class="flex flex-row">
        {#if month !== [...weeksByMonth.entries()][0][0]}
          <div
            class="month-label flex items-center justify-center p-2 w-8 border-l border-r border-b-2 border-gray-400"
          >
            {new Date(month).toLocaleString("default", { month: "long" })}
          </div>
        {:else}
          <div class="p-2 w-8 border-l border-r"></div>
        {/if}
        <div class="flex flex-col flex-1">
          {#each weeks as week}
            <div class="flex flex-row">
              {#each week as { date, isLastWeek, isLastDayOfMonth }}
                {@render dayComponent(date, isLastWeek, isLastDayOfMonth)}
              {/each}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .month-label {
    writing-mode: tb-rl;
    transform: rotate(-180deg);
    margin-top: -2px;
  }
</style>
