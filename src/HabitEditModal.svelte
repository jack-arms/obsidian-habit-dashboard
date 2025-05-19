<script lang="ts">
  import { Flag } from "lucide-svelte";
  import { Button, Modal, Label, Input, Toggle } from "flowbite-svelte";
  import {
    goalIntervalTimeUnitToString,
    goalUnitToString,
  } from "./utils/utils";
  import type {
    Habit,
    GoalIntervalTimeUnit,
    HabitTimeProgressUnit,
  } from "./types";
  import { moment } from "obsidian";
  export type HabitEditModalState =
    | {
        open: true;
        currentHabit: Habit | null;
      }
    | {
        open: false;
      };

  interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (habit: Habit, currentHabit: Habit | null) => void;
    onDelete: (habit: Habit) => void;
    currentHabit: Habit | null;
  }

  const getEmptyHabitInput = () => ({
    name: "",
    noteKey: "",
    createDate: moment().format("Y-MM-DD"),
  });

  const getEmptyGoalInfo = () => ({
    goal: 1,
    goalUnit: null,
    interval: 1,
    intervalTimeUnit: "w" as GoalIntervalTimeUnit,
    goalCreateDate: moment().format("Y-MM-DD"),
  });

  let {
    open = $bindable(),
    onSave,
    onDelete,
    onClose,
    currentHabit,
  }: Props = $props();

  let habit = $state<Habit>(getEmptyHabitInput());

  let goalInfo = $state<NonNullable<Habit["goalInfo"]>>(getEmptyGoalInfo());
  $effect(() => {
    if (open) {
      habit =
        currentHabit == null
          ? getEmptyHabitInput()
          : (JSON.parse(JSON.stringify(currentHabit)) as Habit);

      goalInfo =
        currentHabit?.goalInfo == null
          ? getEmptyGoalInfo()
          : { ...currentHabit.goalInfo };
    }
  });

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
  class="min-w-s max-w-md bg-(--background-primary) text-(--text-normal)"
  classHeader="bg-(--background-secondary)"
  title={currentHabit == null ? "New habit" : "Edit habit"}
  bind:open
  outsideclose
  transition={() => ({})}
  classFooter="flex justify-end"
  onclose={() => {
    habitNameInputError = false;
    habitNoteKeyInputError = false;
    goalIntervalInputError = false;
    goalIntervalInputError = false;
    onClose();
  }}
>
  <div class="flex flex-col justify-evenly habit-modal space-y-4 p-4">
    <div class="flex flex-row space-x-4">
      <div class="flex flex-col flex-grow space-y-2">
        <Label
          for="name-input"
          color={habitNameInputError ? "red" : undefined}
          class="font-bold {!habitNameInputError ? 'text-(--text-normal)' : ''}"
        >
          Name
        </Label>
        <Input
          id="name-input"
          bind:value={habit.name}
          class="h-(--input-height) bg-(--background-modifier-form-field) text-(--text-normal)"
        />
      </div>
      <div class="flex flex-col flex-grow space-y-2">
        <Label
          for="frontmatter-key-input"
          color={habitNoteKeyInputError ? "red" : "grey"}
          class="font-bold {!habitNameInputError ? 'text-(--text-normal)' : ''}"
        >
          Frontmatter key
        </Label>
        <Input
          id="frontmatter-key-input"
          bind:value={habit.noteKey}
          class="h-(--input-height) bg-(--background-modifier-form-field) text-(--text-normal)"
        />
      </div>
    </div>

    <hr class="mt-4!" />

    <div class="flex flex-col space-y-4">
      <div class="flex flex-row items-center">
        <Label
          for="goal-toggle"
          class="pr-2 flex flex-row items-center text-(--text-normal) font-bold text-md"
        >
          <Flag class="w-5 h-5 mr-2" />
          Goal
        </Label>
        <Toggle
          id="goal-toggle"
          checked={!goalInfoInputDisabled}
          onchange={() => (goalInfoInputDisabled = !goalInfoInputDisabled)}
          spanClass={goalInfoInputDisabled
            ? "bg-(--background-modifier-border-hover)"
            : "bg-(--color-accent)!"}
        />
      </div>

      <div class="flex flex-row">
        <div class="flex flex-col space-y-2">
          <Label
            for="goal-amount-input"
            color={goalAmountInputError ? "red" : undefined}
            class="{!goalAmountInputError
              ? goalInfoInputDisabled
                ? 'text-(--text-muted) contrast-50'
                : 'text-(--text-normal) contrast-100'
              : ''} font-bold"
          >
            Goal amount
          </Label>
          <div class="flex flex-row">
            <Input
              id="goal-amount-input"
              bind:value={goalInfo.goal}
              disabled={goalInfoInputDisabled}
              class="w-10 h-(--input-height) mr-2 text-center bg-(--background-modifier-form-field)"
            />
            <select
              value={goalInfo.goalUnit}
              onchange={(e) => {
                if (e.currentTarget.value === "custom") {
                  isCustomGoalTimeUnit = true;
                  goalInfo.goalUnit = "";
                } else {
                  isCustomGoalTimeUnit = false;
                  goalInfo.goalUnit = e.currentTarget.value;
                }
              }}
              disabled={goalInfoInputDisabled}
              class={goalInfoInputDisabled
                ? "hover:bg-(--background-primary)! pointer-events-none text-(--text-muted)! opacity-70!"
                : ""}
            >
              {#each [null, "m", "h", "custom"] as (HabitTimeProgressUnit | "custom")[] as goalTimeUnit}
                <option value={goalTimeUnit}>
                  {goalUnitToString(goalTimeUnit)}
                </option>
              {/each}
            </select>
          </div>
        </div>
        {#if isCustomGoalTimeUnit && goalInfo.goalUnit != null}
          <div class="flex flex-col ml-4 space-y-2">
            <Label
              for="habit-unit-key-input"
              class="font-bold {!goalUnitInputError
                ? goalInfoInputDisabled
                  ? 'text-(--text-muted) contrast-50'
                  : 'text-(--text-normal) contrast-100'
                : ''}"
              color={goalUnitInputError ? "red" : undefined}
            >
              Frontmatter data unit
            </Label>
            <Input
              id="habit-unit-key-input"
              class="w-20 h-(--input-height) bg-(--background-modifier-form-field) text-(--text-normal)"
              bind:value={goalInfo.goalUnit}
              disabled={goalInfoInputDisabled}
              color={goalUnitInputError ? "red" : undefined}
            />
          </div>
        {/if}
      </div>

      <div class="flex flex-col space-y-2">
        <Label
          for="goal-time-span-input"
          color={goalIntervalInputError ? "red" : undefined}
          class="{!goalIntervalInputError
            ? goalInfoInputDisabled
              ? 'text-(--text-muted) contrast-50'
              : 'text-(--text-normal) contrast-100'
            : ''} font-bold"
        >
          Time span
        </Label>
        <div class="flex flex-row">
          <Input
            id="goal-time-span-input"
            disabled={goalInfoInputDisabled}
            bind:value={goalInfo.interval}
            color={goalIntervalInputError ? "red" : undefined}
            class="w-10 h-(--input-height) bg-(--background-modifier-form-field) mr-2 text-center"
          />
          <select
            value={goalInfo.intervalTimeUnit}
            onchange={(e) => {
              goalInfo.intervalTimeUnit = e.currentTarget
                .value as GoalIntervalTimeUnit;
            }}
            disabled={goalInfoInputDisabled}
            class={goalInfoInputDisabled
              ? "hover:bg-(--background-primary)! pointer-events-none text-(--text-muted)! opacity-70!"
              : ""}
          >
            {#each ["d", "w", "m"] as Array<GoalIntervalTimeUnit> as intervalTimeUnit}
              <option value={intervalTimeUnit}>
                {goalIntervalTimeUnitToString(intervalTimeUnit)}
              </option>
            {/each}
          </select>
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      {#if currentHabit != null}
        <Button
          outline={false}
          class="flex justfiy-end bg-(--text-error)! text-white! m-1"
          onclick={() => onDelete(currentHabit)}
        >
          Delete
        </Button>
      {/if}
      <Button
        outline={false}
        class="flex justfiy-end m-1"
        onclick={() => {
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
