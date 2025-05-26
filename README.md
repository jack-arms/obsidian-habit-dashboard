# Obsidian Habit Dashboard

<img width="600" src="https://raw.githubusercontent.com/jack-arms/obsidian-habit-dashboard/refs/heads/main/public/dark_demo.png" alt="Screenshot of the plugin in dark mode, showing user-added habits and charts/details of the progress on each of them."  />
<img width="600" src="https://raw.githubusercontent.com/jack-arms/obsidian-habit-dashboard/refs/heads/main/public/light_demo.png" alt="Screenshot of the plugin in light mode, showing user-added habits and charts/details of the progress on each of them." />

## Intro

A simple full-view plugin opened from the left nav/ribbon in Obsidian to visualize different habits, tasks, or anything you want to keep track of over time. Use it for anything: track time spent on your hobbies or practicing new skills, or just see at a glance when you last did some household chore.

For each habit, see when you last did it, a progress calendar, and optionally how on track you are with a set goal.

The plugin takes data from [properties/frontmatter](https://help.obsidian.md/properties) on daily notes so it's fully compatible with any other plugins, Dataview queries, or any other tool that interacts with your Obsidian vault. The only data stored is the habits you want to track and settings specific to using the plugin.

## How to use

Habit data is pulled any daily note (e.g. `2025-05-26.md`) with [properties/frontmatter](https://help.obsidian.md/properties) data, with each habit corresponding a specific property name. Because of this, this plugin works best in combination with the [Daily notes](https://help.obsidian.md/plugins) core plugin, but any way of creating notes with a name resembling a date will do.

> [!NOTE]
>
> If using the Daily notes plugin, be sure that the date format is the same for both plugins. You can change the date format for both plugins within Obsidian's settings.

For example, if you create a new habit with settings like this:

<img width="250" src="https://raw.githubusercontent.com/jack-arms/obsidian-habit-dashboard/refs/heads/main/public/creating_new_habit.png" alt="Screenshot of the plugin's add new habit modal" />

and then add a daily note with properties filled out like this:

<img width="250" src="https://raw.githubusercontent.com/jack-arms/obsidian-habit-dashboard/refs/heads/main/public/adding_note_property.png" alt="Screenshot of adding properties to a daily note in Obsidian" />

then that will count as a day when you did that habit. You can optionally set a goal for the amount of time (or any other unit) you want to log for that habit every week, 2 weeks, 3 months, etc.

### Property units

- `m`/`h` after a value is interpreted as minutes and hours respectively. You can mix data with both minutes and hours and the plugin will aggregate all the data for you.
- Any other unit is a custom unit and can't be aggregated (e.g. using both `mi` and `km` for miles and kilometers respectively will show be aggregated and displayed separately)
- Any value without a unit is interpreted as a yes/no for if you did that habit and the actual value doesn't matter.

> [!NOTE]
>
> Any property/frontmatter entry with an empty value is ignored. If you just want to mark whether you did a habit, try out the [Checkbox property type](https://help.obsidian.md/properties#Property%20types) or just enter in any number or text.

### Goal progress calculation

Goal progress is determined on a rolling basis. For instance, if you have a weekly habit, all progress for that habit in the past 7 days is counted toward the goal, rather than just the progress since the beginning of the week.

## Feedback

If this plugin doesn't work as you expected, you wish it did something differently, or you wish it did something additional, even if it's something really minor, please consier opening an Issue on the [GitHub repository](https://github.com/jack-arms/obsidian-habit-dashboard/issues) to let me know about it and thank you for trying out the plugin!
