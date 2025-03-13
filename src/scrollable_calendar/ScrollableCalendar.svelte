<script lang="ts">
  import { getCalendarRow, getWeekRowsByMonth } from "./CalendarUtils";
  import CalendarDay from "./CalendarDay.svelte";

  interface Props {
    centerDate: Date;
  }

  let { centerDate }: Props = $props();

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

<div class="flex flex-col m-2 h-50 self-start">
  <div class="flex flex-row border-l -ml-px bg-gray-100 font-bold ml-8">
    {#each ["M", "Tu", "W", "Th", "F", "Sa", "Su"] as day}
      <div
        class="w-8 p-2 border-r border-t border-b z-2 border-gray-600 text-center day-label"
      >
        {day}
      </div>
    {/each}
  </div>
  <div
    class="w-full overflow-y-scroll h-50 relative r-0 flex flex-col items-start border -ml-px"
  >
    {#each weeksByMonth.entries() as [month, weeks]}
      <div class="flex flex-row">
        <div
          class="month-label pr-2 pl-2 w-4 border-b-2 border-gray-400 {month ===
          [...weeksByMonth.entries()][0][0]
            ? '-mt-6'
            : '-mt-px'}"
        >
          {new Date(month).toLocaleString("default", { month: "long" })}
        </div>
        <div class="">
          {#each weeks as week}
            <div class="flex flex-row">
              {#each week as { date, isLastWeek, isLastDayOfMonth }}
                <CalendarDay {date} {isLastWeek} {isLastDayOfMonth} />
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
    /* margin-right: 8px; */
    text-align: center;
  }

  .day-label {
    margin-right: -1px;
    margin-bottom: -1px;
  }
</style>
