import { Loader2 } from "lucide-react"


export const LoadingContent = ({ message }: { message: string }) => {
  return (
          <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
  )
}
