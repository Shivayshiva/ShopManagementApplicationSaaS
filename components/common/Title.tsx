import React from "react"

interface TitleProps {
  title: string
  subtitle?: string
  className?: string
}

const Title: React.FC<TitleProps> = ({ title, subtitle, className = "", subClassName="" }) => {
  return (
    <div className={`mb-4 ${className}`}>
      <h1 className=" font-bold text-3xl">{title}</h1>
      {subtitle && <p className={`text-muted-foreground ${subClassName}`}>{subtitle}</p>}
    </div>
  )
}

export default Title 