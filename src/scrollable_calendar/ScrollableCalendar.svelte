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

<div class="m-2 overflow-y-scroll h-50 pl-12 pr-12">
  {#each weeksByMonth.entries() as [month, weeks]}
    <div class="month flex flex-row">
      <div class="month-label">
        {new Date(month).toLocaleString("default", { month: "long" })}
      </div>
      <div>
        {#each weeks as week}
          {#if Array.isArray(week)}
            <div class="flex flex-row relative">
              <div class="week-row border-b border-r">
                {#each week[0].days as day}
                  <CalendarDay {day} />
                {/each}
              </div>
              <div class="week-row border-t">
                {#each week[1].days as day}
                  <CalendarDay {day} />
                {/each}
              </div>
            </div>
          {:else}
            <div class="week-row">
              {#each week.days as day}
                <CalendarDay {day} />
              {/each}
            </div>
          {/if}
        {/each}
      </div>
    </div>
  {/each}
</div>

<style>
  .week-row {
    display: flex;
    flex-direction: row;
    text-align: center;
  }

  .month-label {
    writing-mode: tb-rl;
    transform: rotate(-180deg);
    margin-right: 8px;
    text-align: center;
  }
</style>
