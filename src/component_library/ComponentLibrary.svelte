<script lang="ts">
  import HabitGoalProgressCircle from "src/habit_overview/HabitGoalProgressCircle.svelte";
</script>

<div class="flex flex-col p-4">
  <h2>Goal progress bars</h2>
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
</div>
