import { cn } from "@/lib/utils";

interface Props{
    children : React.ReactNode;
    className?: string;
}

const Container = ({children, className}: Props) => {
  return (
    <div className={cn("max-w-5xl m-auto px-2", className)}>
      {children}
    </div>
  )
}

export default Container