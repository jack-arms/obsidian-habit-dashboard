<script lang="ts">
  import {
    ArrowDown,
    ArrowUp,
    Calendar,
    Notebook,
    Pencil,
  } from "lucide-svelte";
  import { AccordionItem, Button } from "flowbite-svelte";
  import { latestHabitProgress, getDateKey } from "../utils/utils";
  import ScrollableCalendar from "src/scrollable_calendar/ScrollableCalendar.svelte";
  import CalendarStreakDay, {
    type StreakType,
  } from "src/scrollable_calendar/CalendarDayWithNoteData.svelte";
  import HabitHeader from "./HabitTimeSinceBadge.svelte";
  import type { Habit, HabitDayProgress } from "src/types";
  import { moment } from "obsidian";

  interface Props {
    habit: Habit;
    habitProgress: {
      [date: string]: HabitDayProgress;
    };
    streakData: {
      [date: string]: StreakType;
    };
    onEdit: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    open: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }

  let {
    habitProgress,
    streakData,
    onEdit,
    onMoveDown,
    onMoveUp,
    open,
    setIsOpen,
  }: Props = $props();
  let daysSince = $derived(
    moment().diff(
      moment(latestHabitProgress(Object.values(habitProgress)).date),
      "days",
    ),
  );
  let calendarElement = $state<HTMLElement | undefined>(undefined);
  $effect(() => {
    if (open && calendarElement != null) {
      calendarElement.scroll({
        top: calendarElement.scrollHeight,
        behavior: "instant",
      });
    }
  });

  const fourWeeksAgo = moment().subtract(4, "weeks");
  const hasDataInLast4Weeks = $derived(
    Object.keys(habitProgress).some((h) =>
      moment(h).isSameOrAfter(fourWeeksAgo),
    ),
  );
</script>

<AccordionItem
  tag="div"
  defaultClass="
    flex items-center w-full font-medium text-left group-first:rounded-t-xl border-gray-200 dark:border-gray-700
    shadow-none! justify-between! h-auto! pr-5! pl-0! text-gray-900! relative
  "
  activeClass="bg-gray-100! dark:bg-gray-800!"
  borderClass="border-s! border-e! group-first:border-t!"
  borderBottomClass="border-b!"
  borderSharedClass="border-gray-200! dark:border-gray-700!"
  bind:open={() => open, (isOpen) => setIsOpen(isOpen)}
>
  <div
    slot="header"
    class="flex flex-grow items-center pl-5 pt-5 pb-5 space-x-2!"
  >
    <HabitHeader {daysSince} />
  </div>
  <div class="flex flex-col space-y-3 relative">
    <div class="flex items-center space-x-2 absolute right-0">
      <Button
        class="p-2! h-auto! hover:text-primary-700!"
        on:click={(e) => {
          e.stopPropagation();
          onMoveUp();
        }}
      >
        <ArrowUp class="h-5 stroke-current" />
      </Button>
      <Button
        class="p-2! h-auto! hover:text-primary-700!"
        on:click={(e) => {
          e.stopPropagation();
          onMoveDown();
        }}
      >
        <ArrowDown class="h-5 stroke-current" />
      </Button>
      <Button
        class="p-2! h-auto! hover:text-primary-700!"
        on:click={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <Pencil class="h-5 stroke-current" />
      </Button>
    </div>
    <div class="flex flex-col space-y-2">
      <div class="flex flex-row items-center">
        <div class="flex flex-row items-center space-x-2">
          <Notebook />
          <h3 class="m-0!">Progress</h3>
        </div>
      </div>
      <div>
        <p>Last done on X</p>
        <p>Twice in last 30 days</p>
      </div>
    </div>
    {#if hasDataInLast4Weeks}
      <div class="flex flex-col space-y-3">
        <div class="flex flex-row items-center">
          <div class="flex flex-row items-center space-x-2">
            <Calendar />
            <h3 class="m-0!">Last 4 Weeks</h3>
          </div>
        </div>
        <ScrollableCalendar
          endDate={moment()}
          numWeeks={4}
          bind:calendarElement
        >
          {#snippet dayComponent(
            date: moment.Moment,
            isLastWeek: boolean,
            isLastDayOfMonth: boolean,
          )}
            {@const dateKey = getDateKey(date)}
            <CalendarStreakDay
              {date}
              {isLastWeek}
              {isLastDayOfMonth}
              habitProgress={habitProgress[dateKey]}
              streakType={streakData[dateKey]}
            />
          {/snippet}
        </ScrollableCalendar>
      </div>
    {/if}
  </div>
</AccordionItem>
