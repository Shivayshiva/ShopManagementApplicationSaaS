import { ReactNode } from "react"
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card"

interface GlobalCardProps {
  header?: ReactNode
  title?: ReactNode
  description?: ReactNode
  content: ReactNode
  footer?: ReactNode
  className?: string
  headerClassName?: string
  contentClassName?: string
  footerClassName?: string
}

export default function GlobalCard({
  header,
  title,
  description,
  content,
  footer,
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
}: GlobalCardProps) {
  return (
    <Card className={className}>
      {(header || title || description) && (
        <CardHeader className={headerClassName}>
          {header}
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className={contentClassName}>{content}</CardContent>
      {footer && <CardFooter className={footerClassName}>{footer}</CardFooter>}
    </Card>
  )
} 