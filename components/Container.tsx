import { cn } from "@/lib/utils";

interface Props{
    children : React.ReactNode;
    className?: string;
}

const Container = ({children, className}: Props) => {
  return (
    <div className={cn("max-w-5xl mx-auto px-4 ")}>{children}</div>
  )
}

export default Container