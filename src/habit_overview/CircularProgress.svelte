<script lang="ts">
  import { type Snippet } from "svelte";

  interface Props {
    progress: number;
    stroke: number;
    children: Snippet | null;
    circleClass: string | null;
  }
  let { progress, stroke, children = null, circleClass = null } = $props();

  const SIZE = 100;

  let radius = $derived((SIZE - stroke) / 2);
  let circumference = $derived(2 * Math.PI * radius);
  let offset = $derived(circumference * (1 - Math.min(progress, 100) / 100.0));
</script>

<div class="flex flex-row relative items-center justify-center">
  <svg viewBox={`0 0 ${SIZE} ${SIZE}`} class="text-gray-200 dark:text-gray-700">
    <circle
      class="stroke-current"
      stroke-width={stroke}
      fill="transparent"
      r={radius}
      cx={SIZE / 2}
      cy={SIZE / 2}
    />
    <circle
      class={circleClass}
      stroke-width={stroke}
      fill="transparent"
      r={radius}
      cx={SIZE / 2}
      cy={SIZE / 2}
      stroke-dasharray={circumference}
      stroke-dashoffset={offset}
      stroke-linecap="round"
      transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
    />
  </svg>
  <div class="absolute">
    {@render children()}
  </div>
</div>
