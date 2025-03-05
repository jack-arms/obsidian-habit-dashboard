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
  interface Props {
    open: boolean;
    habit: Habit | null;
    onClose: (habit: Habit) => void;
  }

  let { open, habit, onClose }: Props = $props();

  let habitState = $state<Habit>(
    habit ?? {
      name: "",
      noteKey: "",
    },
  );

  let goalTimeUnitDropDownOpen = $state(false);
  let goalIntervalUnitDropDownOpen = $state(false);

  let habitNameInputError = $state(false);
  let habitNoteKeyInputError = $state(false);
  let goalTimeInputError = $state(false);
  let goalIntervalInputError = $state(false);

  const validateForm = () => {
    habitNameInputError = habitState.name == "";
    habitNoteKeyInputError = habitState.noteKey == "";
    goalTimeInputError =
      habitState.goalInfo != null && habitState.goalInfo.goal < 1;
    goalIntervalInputError =
      habitState.goalInfo != null && habitState.goalInfo.interval < 1;
    return !(
      habitNameInputError ||
      habitNoteKeyInputError ||
      goalTimeInputError ||
      goalIntervalInputError
    );
  };
</script>

<Modal
  title={habit == null ? "Add habit" : "Edit habit"}
  bind:open
  outsideclose
  classFooter="flex justify-end"
  on:close={() => {
    habitNameInputError = false;
    habitNoteKeyInputError = false;
    goalTimeInputError = false;
    goalIntervalInputError = false;
  }}
>
  <div class="flex flex-col justify-evenly habit-modal">
    <div class="p-1 mb-2">
      <Label for="large-input" class="block mb-2">Name</Label>
      <Input
        id="large-input"
        size="lg"
        placeholder=""
        bind:value={habitState.name}
        class={habitNameInputError ? "border-red-500!" : ""}
      />
    </div>

    <div class="p-1 mb-2">
      <Label for="large-input" class="block">Notebook key</Label>
      <Input
        id="large-input"
        size="lg"
        placeholder=""
        bind:value={habitState.noteKey}
        class={habitNoteKeyInputError ? "border-red-500!" : ""}
      />
    </div>

    <div class="flex flex-row items-center">
      <Label for="goal-toggle" class="pr-2 flex flex-row p-2">
        <Flag class="w-5 h-5 mr-2" />
        Goal
      </Label>
      <Toggle
        id="goal-toggle"
        checked={habitState.goalInfo != null}
        on:change={(e) => {
          if (habitState.goalInfo == null) {
            habitState.goalInfo = {
              goal: 1,
              goalTimeUnit: null,
              interval: 1,
              intervalTimeUnit: "d",
            };
          } else {
            habitState.goalInfo = undefined;
          }
          habitState;
        }}
      />
      {#if habitState.goalInfo != null}
        <div class="flex flex-row items-center space-x-4">
          <Input
            type="number"
            bind:value={habitState.goalInfo.goal}
            class="{goalTimeInputError ? 'border-red-500!' : ''} w-10"
          />
          <Button
            >{goalTimeUnitToString(habitState.goalInfo.goalTimeUnit)}</Button
          >
          <Dropdown bind:open={goalTimeUnitDropDownOpen}>
            {#each [null, "m", "h"] as Array<GoalTimeUnit> as goalTimeUnit}
              <DropdownItem
                on:click={() => {
                  if (habitState.goalInfo == null) {
                    return;
                  }
                  habitState.goalInfo.goalTimeUnit = goalTimeUnit;
                  goalTimeUnitDropDownOpen = false;
                }}>{goalTimeUnitToString(goalTimeUnit)}</DropdownItem
              >
            {/each}
          </Dropdown>

          <span class="text-base">every</span>

          <Input
            type="number"
            bind:value={habitState.goalInfo.interval}
            class="{goalIntervalInputError ? 'border-red-500!' : ''} w-10"
          />
          <Button
            >{goalIntervalTimeUnitToString(
              habitState.goalInfo.intervalTimeUnit,
            )}</Button
          >
          <Dropdown bind:open={goalIntervalUnitDropDownOpen}>
            {#each ["d", "w", "m"] as Array<GoalIntervalTimeUnit> as intervalTimeUnit}
              <DropdownItem
                on:click={() => {
                  if (!habitState.goalInfo) {
                    return;
                  }
                  habitState.goalInfo.intervalTimeUnit = intervalTimeUnit;
                  goalIntervalUnitDropDownOpen = false;
                }}
                >{goalIntervalTimeUnitToString(intervalTimeUnit)}</DropdownItem
              >{/each}
          </Dropdown>
        </div>
      {/if}
    </div>
  </div>
  <svelte:fragment slot="footer">
    <div>
      <Button
        outline={false}
        class="flex justfiy-end"
        on:click={() => {
          if (validateForm()) {
            onClose(habitState);
          }
        }}>Save</Button
      >
    </div>
  </svelte:fragment>
</Modal>

<style>
  .habit-modal :global input[type="checkbox"] {
    display: none !important;
  }
</style>
