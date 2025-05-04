<script lang="ts">
  import { getCalendarRow, getWeekRowsByMonth } from "./CalendarUtils";
  import type { Snippet } from "svelte";
  import { moment } from "obsidian";

  interface Props {
    endDate: moment.Moment;
    dayComponent: Snippet<
      [date: moment.Moment, isLastDayOfMonth: boolean, isLastWeek: boolean]
    >;
    numWeeks: number;
    calendarElement?: HTMLElement;
  }

  let {
    endDate,
    dayComponent,
    numWeeks,
    calendarElement = $bindable(),
  }: Props = $props();

  let weeksByMonth = $derived(
    (() => {
      const rows = [...new Array(numWeeks)]
        .map((_, i) => {
          let day = moment(endDate).subtract(i, "week");
          return getCalendarRow(day);
        })
        .reverse();
      return getWeekRowsByMonth(rows);
    })(),
  );
</script>

<div class="flex flex-col w-150 max-w-full h-70 border-r border-b">
  <div class="flex flex-row bg-gray-100 font-bold border-b-2 h-10">
    <div class="p-2 w-8 border-r bg-white"></div>
    <div class="flex flex-row flex-1 border-t">
      {#each ["M", "Tu", "W", "Th", "F", "Sa", "Su"] as day}
        <div
          class="flex flex-1 min-w-2 p-2 [&:not(:last-child)]:border-r z-2 border-gray-600 justify-center"
        >
          {day}
        </div>
      {/each}
    </div>
  </div>
  <div
    class="w-full overflow-y-scroll relative r-0 flex flex-col items-stretch"
    bind:this={calendarElement}
  >
    {#each weeksByMonth.entries() as [month, weeks]}
      {@const skipLabel =
        (month === [...weeksByMonth.keys()][0] &&
          [...weeksByMonth.values()][0].length < 2) ||
        (month === [...weeksByMonth.keys()][weeksByMonth.size - 1] &&
          [...weeksByMonth.values()][weeksByMonth.size - 1].length < 2)}
      <div class="flex flex-row">
        <div
          class="flex items-center p-2 w-8 justify-center border-l border-r {month !==
          [...weeksByMonth.keys()][weeksByMonth.size - 1]
            ? 'border-b-2'
            : ''}"
        >
          {#if skipLabel}
            <div class="p-2"></div>
          {:else}
            <div class="month-label border-gray-400 font-bold">
              {moment().month(month).format("MMMM")}
            </div>
          {/if}
        </div>
        <div class="flex flex-col flex-1">
          {#each weeks as week}
            <div class="flex flex-row h-15">
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
