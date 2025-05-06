<script lang="ts">
  interface Props {
    goal: number;
    goalProgress: number;
  }

  let { goal, goalProgress }: Props = $props();

  let progressPercent = $derived((goalProgress * 100.0) / goal);

  const percentProgressToIndicatorColor = (progressPercent: number) => {
    if (progressPercent > 75) {
      return "bg-green-500";
    } else if (progressPercent > 40) {
      return "bg-yellow-300";
    } else {
      return "bg-red-500";
    }
  };
</script>

<div
  class="w-2 h-2 rounded {percentProgressToIndicatorColor(progressPercent)}"
></div>
