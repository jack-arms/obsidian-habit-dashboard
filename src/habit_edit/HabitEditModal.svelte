<script lang="ts">
  import { Flag } from "lucide-svelte";
  import { Button, Modal, Label, Input, Toggle } from "flowbite-svelte";
  import {
    goalIntervalTimeUnitToString,
    goalUnitToString,
  } from "../utils/utils";
  import type {
    Habit,
    GoalIntervalTimeUnit,
    HabitTimeProgressUnit,
    Nullable,
  } from "../types";
  import { moment } from "obsidian";
  import {
    validateForm,
    type FormHabit,
    type FormHabitGoalInfo,
  } from "./editUtils";
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
    onSaveHabit: (habit: Habit, currentHabit: Habit | null) => void;
    onDelete: (habit: Habit) => void;
    currentHabit: Habit | null;
    currentHabits: Habit[];
  }

  const getEmptyHabitInput = () => ({
    name: null,
    noteKey: null,
  });

  const getEmptyGoalInfo = () => ({
    goal: null,
    goalUnit: null,
    interval: null,
    intervalTimeUnit: null,
  });

  let {
    open = $bindable(),
    onSaveHabit,
    onDelete,
    onClose,
    currentHabit,
    currentHabits,
  }: Props = $props();

  let habit = $state<Nullable<FormHabit>>(getEmptyHabitInput());
  let goalInfo = $state<Nullable<FormHabitGoalInfo>>(getEmptyGoalInfo());
  let goalInfoInputDisabled = $state(currentHabit?.goalInfo == null);

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

      goalInfoInputDisabled = currentHabit?.goalInfo == null;
    }
  });

  let goalTimeUnitDropDownOpen = $state(false);
  let isCustomGoalTimeUnit = $state(false);
  let goalIntervalUnitDropDownOpen = $state(false);

  let habitNameInputError = $state(false);
  let habitNoteKeyInputError = $state(false);
  let goalAmountInputError = $state(false);
  let goalIntervalInputError = $state(false);
  let goalUnitInputError = $state(false);
  let habitNameDuplicateError = $state(false);
  let habitNoteKeyDuplicateError = $state(false);

  const onSave = () => {
    const {
      validatedName,
      validatedNoteKey,
      validatedGoalAmountInput,
      validatedGoalIntervalInput,
      validatedGoalUnitInput,
    } = validateForm(
      habit,
      goalInfo,
      goalInfoInputDisabled,
      isCustomGoalTimeUnit,
    );

    habitNameInputError = validatedName === undefined;
    habitNoteKeyInputError = validatedNoteKey === undefined;
    goalAmountInputError = validatedGoalAmountInput === undefined;
    goalIntervalInputError = validatedGoalIntervalInput === undefined;
    goalUnitInputError = validatedGoalUnitInput === undefined;
    habitNameDuplicateError =
      currentHabit == null &&
      validatedName != null &&
      currentHabits.find((h) => h.name === validatedName) != null;
    habitNoteKeyDuplicateError =
      currentHabit == null &&
      validatedNoteKey != null &&
      currentHabits.find((h) => h.noteKey === validatedNoteKey) != null;

    let formHabit: FormHabit | null =
      validatedName != null && validatedNoteKey != null
        ? { name: validatedName, noteKey: validatedNoteKey }
        : null;

    let formGoalInfo: FormHabitGoalInfo | null =
      validatedGoalAmountInput != null &&
      validatedGoalIntervalInput != null &&
      validatedGoalUnitInput !== undefined
        ? {
            goal: validatedGoalAmountInput,
            goalUnit: goalInfo.goalUnit,
            interval: validatedGoalIntervalInput,
            intervalTimeUnit: goalInfo.intervalTimeUnit ?? "w",
          }
        : null;

    if (
      !(
        habitNameInputError ||
        habitNoteKeyInputError ||
        goalAmountInputError ||
        goalIntervalInputError ||
        goalUnitInputError ||
        habitNameDuplicateError ||
        habitNoteKeyDuplicateError
      ) &&
      formHabit != null
    ) {
      onSaveHabit(
        {
          ...formHabit,
          createDate: currentHabit?.createDate ?? moment().format("Y-MM-DD"),
          goalInfo:
            goalInfoInputDisabled || formGoalInfo == null
              ? undefined
              : {
                  ...formGoalInfo,
                  goalCreateDate:
                    currentHabit?.goalInfo?.goalCreateDate ??
                    moment().format("Y-MM-DD"),
                },
        },
        currentHabit,
      );
    }
  };
</script>

<Modal
  class="min-w-s max-w-md bg-(--background-primary) text-(--text-normal)"
  headerClass="text-(--text-normal) bg-(--background-secondary)"
  title={currentHabit == null ? "New habit" : "Edit habit"}
  bind:open
  outsideclose
  transition={() => ({})}
  footerClass="flex justify-end"
  onclose={() => {
    habitNameInputError = false;
    habitNoteKeyInputError = false;
    goalIntervalInputError = false;
    goalIntervalInputError = false;
    goalUnitInputError = false;
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
          bind:value={() => habit.name ?? "", (v) => (habit.name = v)}
          class="h-(--input-height) bg-(--background-modifier-form-field) text-(--text-normal) border-(--background-modifier-border-focus)! focus:shadow-obsidian-input"
        />
      </div>
      <div class="flex flex-col flex-grow space-y-2">
        <Label
          for="frontmatter-key-input"
          color={habitNoteKeyInputError ? "red" : undefined}
          class="font-bold {!habitNameInputError ? 'text-(--text-normal)' : ''}"
        >
          Frontmatter key
        </Label>
        <Input
          id="frontmatter-key-input"
          bind:value={() => habit.noteKey ?? "", (v) => (habit.noteKey = v)}
          class="h-(--input-height) bg-(--background-modifier-form-field) text-(--text-normal) border-(--background-modifier-border-focus)! focus:shadow-obsidian-input"
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
              bind:value={
                () => (goalInfo.goal ?? "") + "",
                (v) => {
                  if (v === "") {
                    goalInfo.goal = null;
                  } else if (v.length <= 2) {
                    const parsed = Number.parseInt(v);
                    if (!Number.isNaN(parsed)) {
                      goalInfo.goal = parsed;
                    }
                  }
                }
              }
              disabled={goalInfoInputDisabled}
              class="w-10 h-(--input-height) mr-2 text-center bg-(--background-modifier-form-field) text-(--text-normal)! border-(--background-modifier-border-focus)!  focus:shadow-obsidian-input"
            />
            <select
              value={isCustomGoalTimeUnit
                ? "custom"
                : (goalInfo.goalUnit ?? "")}
              onchange={(e) => {
                if (e.currentTarget.value === "custom") {
                  isCustomGoalTimeUnit = true;
                  goalInfo.goalUnit = "";
                } else {
                  isCustomGoalTimeUnit = false;
                  goalInfo.goalUnit =
                    e.currentTarget.value === "" ? null : e.currentTarget.value;
                }
              }}
              disabled={goalInfoInputDisabled}
              class="dropdown {goalInfoInputDisabled
                ? 'hover:bg-(--background-primary)! pointer-events-none text-(--text-muted)! opacity-70!'
                : ''}"
            >
              {#each ["", "m", "h", "custom"] as (HabitTimeProgressUnit | "" | "custom")[] as goalTimeUnit}
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
              color={goalUnitInputError ? "red" : undefined}
              class="font-bold {!goalUnitInputError
                ? goalInfoInputDisabled
                  ? 'text-(--text-muted) contrast-50'
                  : 'text-(--text-normal) contrast-100'
                : ''}"
            >
              Frontmatter data unit
            </Label>
            <Input
              id="habit-unit-key-input"
              bind:value={goalInfo.goalUnit}
              disabled={goalInfoInputDisabled}
              class="w-20 h-(--input-height) bg-(--background-modifier-form-field) text-(--text-normal) border-(--background-modifier-border-focus)! focus:shadow-obsidian-input"
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
            bind:value={
              () => (goalInfo.interval ?? "") + "",
              (v) => {
                if (v === "") {
                  goalInfo.interval = null;
                } else if (v.length <= 2) {
                  const parsed = Number.parseInt(v);
                  if (!Number.isNaN(parsed)) {
                    goalInfo.interval = parsed;
                  }
                }
              }
            }
            disabled={goalInfoInputDisabled}
            class="w-10 h-(--input-height) bg-(--background-modifier-form-field) mr-2 text-center border-(--background-modifier-border-focus)! text-(--text-normal) focus:shadow-obsidian-input"
          />
          <select
            value={goalInfo.intervalTimeUnit ?? "w"}
            onchange={(e) => {
              goalInfo.intervalTimeUnit = e.currentTarget
                .value as GoalIntervalTimeUnit;
            }}
            disabled={goalInfoInputDisabled}
            class="dropdown {goalInfoInputDisabled
              ? 'hover:bg-(--background-primary)! pointer-events-none text-(--text-muted)! opacity-70!'
              : ''}"
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
    {#if habitNameDuplicateError || habitNoteKeyDuplicateError}
      <span class="text-(--text-error)">
        A habit with this name or note key already exists.
      </span>
    {/if}
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
        onclick={() => onSave()}
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
