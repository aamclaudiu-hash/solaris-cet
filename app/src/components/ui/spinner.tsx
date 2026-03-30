import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/hooks/useLanguage"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const { t } = useLanguage()
  return (
    <Loader2Icon
      role="status"
      aria-label={t.common.loadingAria}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
