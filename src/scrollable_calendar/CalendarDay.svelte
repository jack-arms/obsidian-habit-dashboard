<script lang="ts">
  interface Props {
    day: Date;
  }

  let { day }: Props = $props();
</script>

<div class="w-10 p-2 shrink-0 border-1 border-gray-200">{day.getDate()}</div>
