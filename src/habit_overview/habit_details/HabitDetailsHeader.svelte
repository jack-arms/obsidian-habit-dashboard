<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { latestHabitProgress } from "src/utils/utils";
  import { Pencil } from "lucide-svelte";
  import type { Habit, HabitDayProgress } from "src/types";
  import { moment } from "obsidian";
  import HabitTimeSinceBadge from "../HabitTimeSinceBadge.svelte";
  import { getContext } from "svelte";

  interface Props {
    habit: Habit;
    habitProgress: {
      [date: string]: HabitDayProgress;
    };
    onEdit: (habit: Habit | null) => void;
  }

  let { habit, habitProgress, onEdit }: Props = $props();
  const dateFormat = getContext<string>("date-format");
  let latestDay = $derived(latestHabitProgress(Object.values(habitProgress)));
  let daysSince = $derived(
    latestDay != null
      ? moment().diff(moment(latestDay.date, dateFormat), "days")
      : null,
  );
</script>

<div class="flex flex-row space-x-4 items-center">
  <h2 class="my-0!">{habit.name}</h2>
  <HabitTimeSinceBadge
    variant={habit.goalInfo != null ? "goal" : "neutral"}
    date={latestDay.date}
    {daysSince}
  />
  <Button
    class="h-9! p-2! text-sm! font-medium text-white! bg-(--color-accent)! hover:bg-(--interactive-accent-hover)! flex flex-row items-center space-x-1"
    outline={true}
    onclick={() => onEdit(null)}
  >
    <Pencil strokeWidth={1} class="fill-white me-2 h-5 w-5" />
    <span>Edit</span>
  </Button>
</div>
