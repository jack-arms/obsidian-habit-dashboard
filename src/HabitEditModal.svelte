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
    <div class="flex flex-row">
      <div class="p-1 mb-2 w-3/5">
        <Label for="name-input" class="block mb-2">Name</Label>
        <Input
          id="name-input"
          size="lg"
          bind:value={habit.name}
          class={habitNameInputError ? "border-red-500!" : ""}
        />
      </div>

      <div class="p-1 mb-2 w-2/5">
        <Label for="note-key-input" class="block mb-2">Frontmatter key</Label>
        <Input
          id="frontmatter-key-input"
          size="lg"
          bind:value={habit.noteKey}
          class={habitNoteKeyInputError ? "border-red-500!" : ""}
        />
      </div>
    </div>

    <div class="flex flex-row items-center">
      <Label for="goal-toggle" class="pr-2 flex flex-row">
        <Flag class="w-5 h-5 mr-2" />
        Goal
      </Label>
      <Toggle
        id="goal-toggle"
        checked={habit.goalInfo != null}
        on:change={() => (goalInfoInputDisabled = !goalInfoInputDisabled)}
      />
      <div class="flex flex-row items-center space-x-4 overflow-x-scroll p-2">
        <div class="flex flex-row items-center space-x-2">
          <Input
            type="number"
            bind:value={goalInfo.goal}
            disabled={goalInfoInputDisabled}
            class="{goalTimeInputError ? 'border-red-500!' : ''} w-10"
          />
          <Button class="flex flex-row" disabled={goalInfoInputDisabled}>
            {goalUnitToString(goalInfo.goalUnit)}
            <ChevronDown class="ml-1" />
          </Button>
          <Dropdown bind:open={goalTimeUnitDropDownOpen}>
            {#each [null, "m", "h"] as HabitTimeProgressUnit[] as goalTimeUnit}
              <DropdownItem
                on:click={() => {
                  if (habit.goalInfo == null) {
                    return;
                  }
                  habit.goalInfo.goalUnit = goalTimeUnit;
                  goalTimeUnitDropDownOpen = false;
                }}>{goalUnitToString(goalTimeUnit)}</DropdownItem
              >
            {/each}
          </Dropdown>
        </div>

        <span class="text-base {goalInfoInputDisabled ? 'text-gray-300' : ''}"
          >every</span
        >

        <div class="flex flex-row items-center space-x-2">
          <Input
            type="number"
            disabled={goalInfoInputDisabled}
            bind:value={goalInfo.interval}
            class="{goalIntervalInputError ? 'border-red-500!' : ''} w-10"
          />
          <Button disabled={goalInfoInputDisabled}>
            {goalIntervalTimeUnitToString(goalInfo.intervalTimeUnit)}
            <ChevronDown class="ml-1" />
          </Button>
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
