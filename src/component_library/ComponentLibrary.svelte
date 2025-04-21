<script lang="ts">
  import HabitGoalProgressBar from "src/habit_overview/HabitGoalProgressBar.svelte";
</script>

<div class="flex flex-col">
  <h2>Goal progress bars</h2>
  <h3>60 minute goal over a week</h3>
  {#each [...new Array(60 / 5 + 1)] as _, i}
    <HabitGoalProgressBar
      goal={60}
      goalUnit="m"
      interval={7}
      intervalTimeUnit="d"
      goalProgress={i * 5}
    />
  {/each}
</div>
