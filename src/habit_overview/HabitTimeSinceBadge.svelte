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

<Badge color="purple" class="text-sm p-2 rounded-lg relative">
  <Hourglass class="h-4 w-auto" />
  {daysSince == null ? "–" : daysSince + " days"}
</Badge>
<Tooltip placement="bottom" class="transform-none!">
  {moment(date).format("dddd, MMMM D, YYYY")}
</Tooltip>
