<script lang="ts">
  import { Badge, Tooltip } from "flowbite-svelte";
  import { Hourglass } from "lucide-svelte";
  import { moment } from "obsidian";

  interface Props {
    daysSince: number;
    date: string;
    variant: "goal" | "neutral";
  }

  let { daysSince, date, variant = "goal" } = $props();
</script>

<Badge
  class="text-sm p-2 rounded-lg relative {variant === 'goal'
    ? 'bg-(--background-modifier-active-hover) text-(--text-accent)'
    : 'bg-(--background-modifier-hover) text-(--text-normal)'}
  "
>
  <Hourglass class="h-4 w-auto" />
  {daysSince == null ? "–" : daysSince + " days"}
</Badge>
<Tooltip
  placement="bottom"
  class="transform-none! bg-(--background-secondary) border-(--background-modifier-border)"
>
  {moment(date).format("dddd, MMMM D, YYYY")}
</Tooltip>
