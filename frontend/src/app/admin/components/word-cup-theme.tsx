import { Button, type ButtonProps } from "@/components/ui/button"
import { Card, type CardProps } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import React from "react"

export const WorldCupButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          variant === "default" &&
            "bg-gradient-to-r from-red-700 via-amber-600 to-green-700 hover:from-red-800 hover:via-amber-700 hover:to-green-800 text-white border-0",
          variant === "destructive" &&
            "bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white border-0",
          variant === "outline" && "bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 hover:text-gray-900",
          className,
        )}
        {...props}
      />
    )
  },
)
WorldCupButton.displayName = "WorldCupButton"

export const WorldCupCard = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => {
  return (
    <Card
      ref={ref}
      className={cn("border-0 shadow-md bg-gradient-to-br from-white to-gray-50", className)}
      {...props}
    />
  )
})
WorldCupCard.displayName = "WorldCupCard"

