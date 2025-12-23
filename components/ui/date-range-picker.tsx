"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format, parse, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  onChange?: () => void;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
  onChange,
}: DatePickerProps) {
  // Estados para controlar o texto digitado nos inputs
  const [fromValue, setFromValue] = React.useState("")
  const [toValue, setToValue] = React.useState("")

  // Atualiza os inputs quando a data muda via calendário
  React.useEffect(() => {
    setFromValue(date?.from ? format(date.from, "dd/MM/yyyy") : "")
    setToValue(date?.to ? format(date.to, "dd/MM/yyyy") : "")
  }, [date])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'from' | 'to') => {
    const inputValue = e.target.value
    if (field === 'from') setFromValue(inputValue)
    else setToValue(inputValue)

    // Tenta converter o texto digitado (DD/MM/YYYY) para objeto Date
    const parsedDate = parse(inputValue, "dd/MM/yyyy", new Date())

    if (isValid(parsedDate) && inputValue.length === 10) {
      const newRange = field === 'from' 
        ? { from: parsedDate, to: date?.to } 
        : { from: date?.from, to: parsedDate }
      
      setDate(newRange)
      if (onChange) onChange()
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Selecione um período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          {/* Seção de Inputs para Digitação Manual */}
          <div className="flex gap-2 mb-4">
            <div className="grid gap-1">
              <Label htmlFor="from" className="text-xs">Início</Label>
              <Input
                id="from"
                placeholder="00/00/0000"
                value={fromValue}
                className="h-8 w-[120px]"
                onChange={(e) => handleInputChange(e, 'from')}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="to" className="text-xs">Fim</Label>
              <Input
                id="to"
                placeholder="00/00/0000"
                value={toValue}
                className="h-8 w-[120px]"
                onChange={(e) => handleInputChange(e, 'to')}
              />
            </div>
          </div>

          {/* Calendário de Seleção Visual */}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate)
              if (onChange) onChange()
            }}
            numberOfMonths={2}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}