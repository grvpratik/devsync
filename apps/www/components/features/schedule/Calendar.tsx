import type React from "react"
import { Calendar as CalendarUI } from "www/components/ui/calendar"

interface CalendarProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

const Calendar: React.FC<CalendarProps> = ({ date, setDate }) => {
  return (
    <CalendarUI
      disabled={{ before: new Date() }}
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md"
    />
  )
}

export default Calendar

