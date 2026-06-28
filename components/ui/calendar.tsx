"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"]
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      captionLayout={captionLayout}
      formatters={{
        formatWeekdayName: (date) =>
          date.toLocaleString("default", { weekday: "narrow" }),
        ...formatters,
      }}
      className={cn(
        "w-full bg-transparent p-0 [--cell-size:2rem]",
        className
      )}
      classNames={{
        root: cn("w-full", defaultClassNames.root),
        months: cn("relative flex w-full flex-col", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-3", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant, size: "icon-sm" }),
          "size-7 shrink-0 select-none aria-disabled:opacity-40",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant, size: "icon-sm" }),
          "size-7 shrink-0 select-none aria-disabled:opacity-40",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-7 w-full items-center justify-center px-8",
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          "text-xs font-heading font-bold uppercase tracking-widest text-foreground select-none",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full", defaultClassNames.month_grid),
        weekdays: cn("flex w-full", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 text-center text-[10px] font-mono font-medium uppercase text-muted-foreground select-none",
          defaultClassNames.weekday
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        day: cn(
          "relative flex flex-1 items-center justify-center p-0 text-center select-none",
          defaultClassNames.day
        ),
        day_button: cn(
          "flex size-(--cell-size) items-center justify-center rounded-md text-xs font-sans transition-colors select-none",
          "hover:bg-accent/40 hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          defaultClassNames.day_button
        ),
        selected: cn(
          "[&>button]:bg-primary [&>button]:text-primary-foreground",
          "[&>button]:hover:bg-primary [&>button]:hover:text-primary-foreground",
          defaultClassNames.selected
        ),
        today: cn(
          "[&>button]:border [&>button]:border-primary/60 [&>button]:font-bold [&>button]:text-primary",
          defaultClassNames.today
        ),
        outside: cn(
          "[&>button]:text-muted-foreground/35 [&>button]:hover:bg-muted/20",
          defaultClassNames.outside
        ),
        disabled: cn(
          "[&>button]:cursor-not-allowed [&>button]:text-muted-foreground/30 [&>button]:hover:bg-transparent",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        range_start: cn("rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md", defaultClassNames.range_end),
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClassName, ...rest }) => {
          const Icon = orientation === "left" ? ChevronLeft : ChevronRight
          return (
            <Icon className={cn("size-4", chevronClassName)} {...rest} />
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
