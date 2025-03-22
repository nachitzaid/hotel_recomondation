"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
      }

      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Clear interval on component unmount
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex flex-wrap justify-center gap-4">
      <div className="bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[100px]">
        <div className="text-3xl font-bold">{timeLeft.days}</div>
        <div className="text-sm">Jours</div>
      </div>
      <div className="bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[100px]">
        <div className="text-3xl font-bold">{timeLeft.hours}</div>
        <div className="text-sm">Heures</div>
      </div>
      <div className="bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[100px]">
        <div className="text-3xl font-bold">{timeLeft.minutes}</div>
        <div className="text-sm">Minutes</div>
      </div>
      <div className="bg-white/30 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[100px]">
        <div className="text-3xl font-bold">{timeLeft.seconds}</div>
        <div className="text-sm">Secondes</div>
      </div>
    </div>
  )
}

