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
  let goalAmountInputError = $state(false);
  let goalIntervalInputError = $state(false);
  let goalUnitInputError = $state(false);

  const validateForm = () => {
    habitNameInputError = habit.name == "";
    habitNoteKeyInputError = habit.noteKey == "";
    goalAmountInputError = !goalInfoInputDisabled && goalInfo.goal < 1;
    goalIntervalInputError = !goalInfoInputDisabled && goalInfo.interval < 1;
    goalUnitInputError =
      !goalInfoInputDisabled &&
      isCustomGoalTimeUnit &&
      goalInfo.goalUnit === "";

    return !(
      habitNameInputError ||
      habitNoteKeyInputError ||
      goalAmountInputError ||
      goalIntervalInputError ||
      goalUnitInputError
    );
  };
</script>

<Modal
  class="min-w-s max-w-md"
  title={currentHabit == null ? "New habit" : "Edit habit"}
  open={true}
  outsideclose
  classFooter="flex justify-end"
  on:close={() => {
    habitNameInputError = false;
    habitNoteKeyInputError = false;
    goalIntervalInputError = false;
    goalIntervalInputError = false;
    onClose();
  }}
>
  <div class="flex flex-col justify-evenly habit-modal space-y-4 p-4">
    <div class="flex flex-row space-x-4">
      <div class="flex flex-col flex-grow">
        <Label
          for="name-input"
          color={habitNameInputError ? "red" : undefined}
          class="mb-2"
        >
          Name
        </Label>
        <Input
          id="name-input"
          bind:value={habit.name}
          color={habitNameInputError ? "red" : undefined}
        />
      </div>
      <div class="flex flex-col flex-grow">
        <Label
          for="frontmatter-key-input"
          color={habitNoteKeyInputError ? "red" : undefined}
          class="mb-2"
        >
          Frontmatter key
        </Label>
        <Input
          id="frontmatter-key-input"
          bind:value={habit.name}
          color={habitNoteKeyInputError ? "red" : undefined}
        />
      </div>
    </div>

    <hr class="mt-4!" />

    <div class="flex flex-col space-y-4">
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

      <div class="flex flex-row">
        <div class="flex flex-col">
          <Label
            for="goal-amount-input"
            color={goalAmountInputError ? "red" : undefined}
            class="mb-2 contrast-50 {!goalAmountInputError
              ? goalInfoInputDisabled
                ? 'text-gray-300'
                : 'text-gray-900'
              : ''}"
          >
            Goal amount
          </Label>
          <div class="flex flex-row">
            <Input
              id="goal-amount-input"
              type="number"
              bind:value={goalInfo.goal}
              disabled={goalInfoInputDisabled}
              class="w-10 mr-2 text-center"
            />
            <Button class="flex flex-row" disabled={goalInfoInputDisabled}>
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
          </div>
        </div>
        {#if isCustomGoalTimeUnit && goalInfo.goalUnit != null}
          <div class="flex flex-col ml-4">
            <Label
              for="habit-unit-key-input"
              class="mb-2  contrast-50 {!goalUnitInputError
                ? goalInfoInputDisabled
                  ? 'text-gray-300'
                  : 'text-gray-900'
                : ''}"
              color={goalUnitInputError ? "red" : undefined}
            >
              Frontmatter data unit
            </Label>
            <Input
              id="habit-unit-key-input"
              class="w-20"
              bind:value={goalInfo.goalUnit}
              disabled={goalInfoInputDisabled}
              color={goalUnitInputError ? "red" : undefined}
            />
          </div>
        {/if}
      </div>

      <div class="flex flex-col">
        <Label
          color={goalIntervalInputError ? "red" : undefined}
          class="mb-2 contrast-50 {!goalIntervalInputError
            ? goalInfoInputDisabled
              ? 'text-gray-300'
              : 'text-gray-900'
            : ''}"
        >
          Time span
        </Label>
        <div class="flex flex-row">
          <Input
            type="number"
            disabled={goalInfoInputDisabled}
            bind:value={goalInfo.interval}
            color={goalIntervalInputError ? "red" : undefined}
            class="w-10 mr-2 text-center"
          />
          <Button disabled={goalInfoInputDisabled}>
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
  </div></Modal
>

<style>
  .habit-modal :global input[type="checkbox"] {
    display: none !important;
  }
</style>
