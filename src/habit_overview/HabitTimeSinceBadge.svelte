<script lang="ts">
  import { Badge, Tooltip } from "flowbite-svelte";
  import { Hourglass } from "lucide-svelte";
  import { moment } from "obsidian";

  interface Props {
    daysSince: number;
    date: string;
  }

  let { daysSince, date } = $props();
</script>

<Badge
  class="text-sm p-2 rounded-lg relative bg-(--background-modifier-active-hover) text-(--text-accent)"
>
  <Hourglass class="h-4 w-auto" />
  {daysSince == null ? "–" : daysSince + " days"}
</Badge>
<Tooltip placement="bottom" class="transform-none!">
  {moment(date).format("dddd, MMMM D, YYYY")}
</Tooltip>
