<script lang="ts">
  import { Hourglass } from "lucide-svelte";

  interface Props {
    daysSince: number;
  }

  let { daysSince } = $props();
</script>

<div class="flex items-center">
  <div class="inline-flex items-center">
    <Hourglass class="h-4 w-auto" />
    {daysSince ?? "–"}
  </div>
</div>
