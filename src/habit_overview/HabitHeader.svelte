<script lang="ts">
  import { Hourglass } from "lucide-svelte";

  interface Props {
    habitName: string;
    daysSince: number;
  }

  let { habitName, daysSince } = $props();
</script>

<div class="flex flex-grow items-center">
  <span>{habitName}</span>
  <div class="flex items-center">
    <div
      class="inline-flex items-center text-base text-gray-900 dark:text-white"
    >
      <Hourglass class="h-4" />
      {daysSince}
    </div>
  </div>
</div>
