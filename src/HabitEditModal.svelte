<script lang="ts">
  import { ChevronDown, Flag } from "lucide-svelte";
  import {
    Button,
    Modal,
    Label,
    Input,
    Toggle,
    DropdownItem,
    Dropdown,
    FloatingLabelInput,
  } from "flowbite-svelte";
  import {
    goalIntervalTimeUnitToString,
    goalUnitToString,
  } from "./utils/utils";
  import type {
    Habit,
    GoalIntervalTimeUnit,
    HabitTimeProgressUnit,
  } from "./types";
  import moment from "moment";
  export type HabitEditModalState =
    | {
        isOpen: true;
        currentHabit: Habit | null;
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

  let habit = $state(
    currentHabit == null
      ? {
          name: "",
          noteKey: "",
          createDate: moment().format("Y-MM-DD"),
        }
      : (JSON.parse(JSON.stringify(currentHabit)) as Habit),
  );
  let goalInfo = $state(
    currentHabit?.goalInfo == null
      ? {
          goal: 1,
          goalUnit: null,
          interval: 1,
          intervalTimeUnit: "w" as GoalIntervalTimeUnit,
        }
      : { ...currentHabit.goalInfo },
  );
  let goalInfoInputDisabled = $state(currentHabit?.goalInfo == null);

  let goalTimeUnitDropDownOpen = $state(false);
  let isCustomGoalTimeUnit = $state(false);
  let goalIntervalUnitDropDownOpen = $state(false);

  let habitNameInputError = $state(false);
  let habitNoteKeyInputError = $state(false);
  let goalTimeInputError = $state(false);
  let goalIntervalInputError = $state(false);
  let goalUnitInputError = $state(false);

  const validateForm = () => {
    habitNameInputError = habit.name == "";
    habitNoteKeyInputError = habit.noteKey == "";
    goalTimeInputError = !goalInfoInputDisabled && goalInfo.goal < 1;
    goalIntervalInputError = !goalInfoInputDisabled && goalInfo.interval < 1;
    goalUnitInputError =
      !goalInfoInputDisabled &&
      isCustomGoalTimeUnit &&
      goalInfo.goalUnit === "";

    return !(
      habitNameInputError ||
      habitNoteKeyInputError ||
      goalTimeInputError ||
      goalIntervalInputError ||
      goalUnitInputError
    );
  };
</script>

<Modal
  class="min-w-m max-w-lg"
  open={true}
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
  <h3 class="text-center w-full absolute" slot="header">
    {currentHabit == null ? "New habit" : "Edit habit"}
  </h3>
  <div class="flex flex-col justify-evenly habit-modal space-y-4 px-12">
    <FloatingLabelInput
      bind:value={habit.name}
      color={habitNameInputError ? "red" : undefined}
      style="filled"
      id="name-input"
      name="name-input"
      type="text"
      classInput="px-2.5! pb-2.5! pt-5!"
      classLabel="cursor-text"
    >
      Name
    </FloatingLabelInput>
    <FloatingLabelInput
      bind:value={habit.noteKey}
      color={habitNoteKeyInputError ? "red" : undefined}
      style="filled"
      id="frontmatter-key-input"
      name="frontmatter-key-input"
      type="text"
      classInput="px-2.5! pb-2.5! pt-5!"
      classLabel="cursor-text"
    >
      Frontmatter key
    </FloatingLabelInput>

    <hr />

    <div class="flex flex-row">
      <div class="flex flex-row items-center">
        <Label for="goal-toggle" class="pr-2 flex flex-row">
          <Flag class="w-5 h-5 mr-2" />
          Goal
        </Label>
        <Toggle
          id="goal-toggle"
          checked={!goalInfoInputDisabled}
          on:change={() => (goalInfoInputDisabled = !goalInfoInputDisabled)}
        />
      </div>
      
      <div class="flex flex-col space-y-4 p-2">
        <div class="flex flex-row items-center h-12">
          <Input
            type="number"
            bind:value={goalInfo.goal}
            disabled={goalInfoInputDisabled}
            class="{goalTimeInputError
              ? 'border-red-500!'
              : ''} w-10 mr-4 h-full! text-center"
          />
          <Button
            class="flex flex-row h-full!"
            disabled={goalInfoInputDisabled}
          >
            {goalUnitToString(
              isCustomGoalTimeUnit ? "custom" : goalInfo.goalUnit,
            )}
            <ChevronDown class="ml-1" />
          </Button>
          <Dropdown bind:open={goalTimeUnitDropDownOpen}>
            {#each [null, "m", "h", "custom"] as (HabitTimeProgressUnit | "custom")[] as goalTimeUnit}
              <DropdownItem
                on:click={() => {
                  if (goalTimeUnit === "custom") {
                    isCustomGoalTimeUnit = true;
                    goalInfo.goalUnit = "";
                  } else {
                    isCustomGoalTimeUnit = false;
                    goalInfo.goalUnit = goalTimeUnit;
                  }
                  goalTimeUnitDropDownOpen = false;
                }}>{goalUnitToString(goalTimeUnit)}</DropdownItem
              >
            {/each}
          </Dropdown>
          {#if isCustomGoalTimeUnit && !goalInfoInputDisabled && goalInfo.goalUnit != null}
            <FloatingLabelInput
              bind:value={goalInfo.goalUnit}
              color={goalUnitInputError ? "red" : undefined}
              style="filled"
              id="habit-unit-key-input"
              name="habit-unit-key-input"
              type="text"
              classInput="px-2.5! pb-2.5! pt-5!"
              classLabel="cursor-text"
              classDiv="ml-4"
            >
              Unit
            </FloatingLabelInput>
          {/if}
        </div>

        <span
          class="text-base font-bold {goalInfoInputDisabled
            ? 'text-gray-300'
            : ''}"
          >every:
        </span>

        <div class="flex flex-row items-center space-x-2 h-12">
          <Input
            type="number"
            disabled={goalInfoInputDisabled}
            bind:value={goalInfo.interval}
            class="{goalIntervalInputError
              ? 'border-red-500!'
              : ''} w-10 mr-4 h-full! text-center"
          />
          <Button disabled={goalInfoInputDisabled} class="h-full!">
            {goalIntervalTimeUnitToString(goalInfo.intervalTimeUnit)}
            <ChevronDown class="ml-1" />
          </Button>
          <Dropdown bind:open={goalIntervalUnitDropDownOpen}>
            {#each ["d", "w", "m"] as Array<GoalIntervalTimeUnit> as intervalTimeUnit}
              <DropdownItem
                on:click={() => {
                  goalInfo.intervalTimeUnit = intervalTimeUnit;
                  goalIntervalUnitDropDownOpen = false;
                }}
              >
                {goalIntervalTimeUnitToString(intervalTimeUnit)}
              </DropdownItem>
            {/each}
          </Dropdown>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      {#if currentHabit != null}
        <Button
          outline={false}
          class="flex justfiy-end bg-red-500! hover:bg-red-600! active:bg-red-700! text-white! m-1"
          on:click={() => onDelete(currentHabit)}
        >
          Delete
        </Button>
      {/if}
      <Button
        outline={false}
        class="flex justfiy-end m-1"
        on:click={() => {
          if (validateForm()) {
            const savedGoalInfo = goalInfoInputDisabled
              ? undefined
              : { ...goalInfo, goalCreateDate: moment().format("Y-MM-DD") };

            onSave({ ...habit, goalInfo: savedGoalInfo }, currentHabit);
          }
        }}
      >
        Save
      </Button>
    </div>
  </div>
</Modal>

<style>
  .habit-modal :global input[type="checkbox"] {
    display: none !important;
  }
</style>
