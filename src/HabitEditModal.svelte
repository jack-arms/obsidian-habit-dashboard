<script lang="ts">
  import type { Habit } from "./main";
  import { Flag } from "lucide-svelte";
  import {
    Button,
    Modal,
    Label,
    Input,
    Toggle,
    DropdownItem,
    Dropdown,
  } from "flowbite-svelte";
  import { goalIntervalTimeUnitToString, goalTimeUnitToString } from "./utils";
  import type { GoalIntervalTimeUnit, GoalTimeUnit } from "./types";
  export type HabitEditModalState =
    | {
        isOpen: true;
        currentHabit: Habit | null;
        habit: Habit;
      }
    | {
        isOpen: false;
      };

  interface Props {
    onClose: () => void;
    onSave: (habit: Habit, currentHabit: Habit | null) => void;
    onDelete: (habit: Habit) => void;
    currentHabit: Habit | null;
  }

  let { onSave, onDelete, onClose, currentHabit }: Props = $props();

  let habit = $state({
    ...(currentHabit ?? {
      name: "",
      noteKey: "",
    }),
  });

  let goalTimeUnitDropDownOpen = $state(false);
  let goalIntervalUnitDropDownOpen = $state(false);

  let habitNameInputError = $state(false);
  let habitNoteKeyInputError = $state(false);
  let goalTimeInputError = $state(false);
  let goalIntervalInputError = $state(false);

  const validateForm = () => {
    habitNameInputError = habit.name == "";
    habitNoteKeyInputError = habit.noteKey == "";
    goalTimeInputError = habit.goalInfo != null && habit.goalInfo.goal < 1;
    goalIntervalInputError =
      habit.goalInfo != null && habit.goalInfo.interval < 1;

    return !(
      habitNameInputError ||
      habitNoteKeyInputError ||
      goalTimeInputError ||
      goalIntervalInputError
    );
  };
</script>

<Modal
  open={true}
  title={currentHabit == null ? "New habit" : "Edit habit"}
  outsideclose
  classFooter="flex justify-end"
  on:close={() => {
    habitNameInputError = false;
    habitNoteKeyInputError = false;
    goalTimeInputError = false;
    goalIntervalInputError = false;
    onClose();
  }}
>
  <div class="flex flex-col justify-evenly habit-modal">
    <div class="p-1 mb-2">
      <Label for="large-input" class="block mb-2">Name</Label>
      <Input
        id="large-input"
        size="lg"
        bind:value={habit.name}
        class={habitNameInputError ? "border-red-500!" : ""}
      />
    </div>

    <div class="p-1 mb-2">
      <Label for="large-input" class="block">Notebook key</Label>
      <Input
        id="large-input"
        size="lg"
        bind:value={habit.noteKey}
        class={habitNoteKeyInputError ? "border-red-500!" : ""}
      />
    </div>

    <div class="flex flex-col space-y-2">
      <div class="flex flex-row items-center">
        <Label for="goal-toggle" class="pr-2 flex flex-row p-2">
          <Flag class="w-5 h-5 mr-2" />
          Goal
        </Label>
        <Toggle
          id="goal-toggle"
          checked={habit.goalInfo != null}
          on:change={() => {
            if (habit.goalInfo == null) {
              habit.goalInfo = {
                goal: 1,
                goalTimeUnit: null,
                interval: 1,
                intervalTimeUnit: "d",
                trackingStartDate: null,
              };
            } else {
              habit.goalInfo = undefined;
            }
          }}
        />
      </div>
      {#if habit.goalInfo != null}
        <div class="ml-8 space-y-2">
          <div class="flex flex-row items-center space-x-4 overflow-x-scroll">
            <Input
              type="number"
              bind:value={habit.goalInfo.goal}
              class="{goalTimeInputError ? 'border-red-500!' : ''} w-10"
            />
            <Button>{goalTimeUnitToString(habit.goalInfo.goalTimeUnit)}</Button>
            <Dropdown bind:open={goalTimeUnitDropDownOpen}>
              {#each [null, "m", "h"] as Array<GoalTimeUnit> as goalTimeUnit}
                <DropdownItem
                  on:click={() => {
                    if (habit.goalInfo == null) {
                      return;
                    }
                    habit.goalInfo.goalTimeUnit = goalTimeUnit;
                    goalTimeUnitDropDownOpen = false;
                  }}>{goalTimeUnitToString(goalTimeUnit)}</DropdownItem
                >
              {/each}
            </Dropdown>

            <span class="text-base">every</span>

            <Input
              type="number"
              bind:value={habit.goalInfo.interval}
              class="{goalIntervalInputError ? 'border-red-500!' : ''} w-10"
            />
            <Button
              >{goalIntervalTimeUnitToString(
                habit.goalInfo.intervalTimeUnit,
              )}</Button
            >
            <Dropdown bind:open={goalIntervalUnitDropDownOpen}>
              {#each ["d", "w", "m"] as Array<GoalIntervalTimeUnit> as intervalTimeUnit}
                <DropdownItem
                  on:click={() => {
                    if (!habit.goalInfo) {
                      return;
                    }
                    habit.goalInfo.intervalTimeUnit = intervalTimeUnit;
                    goalIntervalUnitDropDownOpen = false;
                  }}
                  >{goalIntervalTimeUnitToString(
                    intervalTimeUnit,
                  )}</DropdownItem
                >{/each}
            </Dropdown>
          </div>

          <div class="flex flex-row items-center space-x-2">
            <Label for="tracking-start-date" class="inline"
              >Skip note data before (optional):
            </Label>
            <Input
              id="tracking-start-date"
              type="date"
              bind:value={habit.goalInfo.trackingStartDate}
              class="w-auto"
            />
          </div>
        </div>
      {/if}
    </div>
  </div>
  <div class="flex justify-end mt-4">
    {#if currentHabit != null}
      <Button
        outline={false}
        class="flex justfiy-end bg-red-500! hover:bg-red-600! active:bg-red-700! text-white! m-1"
        on:click={() => onDelete(currentHabit)}>Delete</Button
      >
    {/if}
    <Button
      outline={false}
      class="flex justfiy-end m-1"
      on:click={() => {
        if (validateForm()) {
          onSave(habit, currentHabit);
        }
      }}>Save</Button
    >
  </div>
</Modal>

<style>
  .habit-modal :global input[type="checkbox"] {
    display: none !important;
  }
</style>
