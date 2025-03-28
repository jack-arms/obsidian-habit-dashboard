<script lang="ts">
  import type { Habit } from "../main";
  import { ArrowDown, ArrowUp, Hourglass, Pencil } from "lucide-svelte";
  import { AccordionItem, Button } from "flowbite-svelte";
  import { daysBetween } from "../utils";
  interface Props {
    habit: Habit;
    habitProgress: Array<{
      date: string;
      value: string;
    }>;
    onEdit: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    open: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }

  let {
    habit,
    habitProgress,
    onEdit,
    onMoveDown,
    onMoveUp,
    open,
    setIsOpen,
  }: Props = $props();
  let daysSince = $derived(
    daysBetween(
      new Date(),
      new Date(habitProgress[habitProgress.length - 1].date),
    ),
  );

  /* card content:
    - last done date
    - scrollable calendar
    - goal info
    - summary of progress in last 2 weeks, if there's data
*/
</script>

<AccordionItem
  tag="div"
  defaultClass="
    flex items-center w-full font-medium text-left group-first:rounded-t-xl border-gray-200 dark:border-gray-700
    shadow-none! justify-between! h-auto! pr-5! pl-0! text-gray-900!
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
    <div class="flex flex-grow items-center">
      <span>{habit.name}</span>
      <div class="flex items-center">
        <div
          class="inline-flex items-center text-base text-gray-900 dark:text-white"
        >
          <Hourglass class="h-4" />
          {daysSince}
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-row items-center relative min-h-5">
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
  </div>
</AccordionItem>
