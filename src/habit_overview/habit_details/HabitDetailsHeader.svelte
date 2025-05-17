<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { latestHabitProgress } from "src/utils/utils";
  import { Pencil } from "lucide-svelte";
  import type { Habit, HabitDayProgress } from "src/types";
  import { moment } from "obsidian";
  import HabitTimeSinceBadge from "../HabitTimeSinceBadge.svelte";

  interface Props {
    habit: Habit;
    habitProgress: {
      [date: string]: HabitDayProgress;
    };
    onEdit: (habit: Habit | null) => void;
  }

  let { habit, habitProgress, onEdit }: Props = $props();
  let latestDay = $derived(latestHabitProgress(Object.values(habitProgress)));
  let daysSince = $derived(
    latestDay != null ? moment().diff(moment(latestDay.date), "days") : null,
  );
</script>

<div class="flex flex-row space-x-4 items-center">
  <h2>{habit.name}</h2>
  <HabitTimeSinceBadge date={latestDay.date} {daysSince} />
  <Button
    class="h-9! p-2! text-sm! font-medium text-white! bg-(--color-accent)! flex flex-row items-center space-x-1"
    outline={true}
    on:click={() => onEdit(null)}
  >
    <Pencil strokeWidth={1} class="fill-white me-2 h-5 w-5" />
    <span>Edit</span>
  </Button>
</div>
