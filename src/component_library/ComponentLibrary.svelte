<script lang="ts">
  import HabitGoalProgressCircle from "src/habit_overview/HabitGoalProgressCircle.svelte";
  import { getAggregatedHabitProgress } from "src/utils/habitDataUtils";
  import { moment } from "obsidian";
  import HabitDetailsProgress from "src/habit_overview/habit_details/HabitDetailsProgress.svelte";

  const yesterday = moment().subtract(1, "days");
  const habit1Progress = getAggregatedHabitProgress({
    [yesterday.format("Y-MM-DD")]: {
      date: yesterday.format("Y-MM-DD"),
      noteHref: "piano",
      unit: "m",
      value: 20,
    },
  });
  const habit2Progress = getAggregatedHabitProgress({
    [yesterday.format("Y-MM-DD")]: {
      date: yesterday.format("Y-MM-DD"),
      noteHref: "guitar",
      unit: "m",
      value: 20,
    },
    [yesterday.subtract(4, "days").format("Y-MM-DD")]: {
      date: yesterday.subtract(4, "days").format("Y-MM-DD"),
      noteHref: "guitar",
      unit: "h",
      value: 1,
    },
  });
</script>

<div class="flex flex-col p-4">
  <h2>Goal progress circle</h2>
  <h3>60 minute goal</h3>
  <div class="flex flex-row flex-wrap w-100">
    {#each [...new Array(60 / 5 + 1)] as _, i}
      <div class="w-20 h-20 p-4">
        <HabitGoalProgressCircle
          goal={60}
          goalUnit="m"
          interval={7}
          intervalTimeUnit="d"
          goalProgress={i * 5}
          stroke={8}
        >
          {#snippet progressComponent(habitProgress: number)}
            {habitProgress}
          {/snippet}
        </HabitGoalProgressCircle>
      </div>
    {/each}
  </div>
  <h2>Goal details: progress</h2>
  <div class="flex flex-row space-x-4">
    <HabitDetailsProgress habitProgress={habit1Progress} />
    <HabitDetailsProgress habitProgress={habit2Progress} />
  </div>
</div>
