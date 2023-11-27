import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"


interface HintProps {
    children: React.ReactNode
    description: string;
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
}

export const Hint = ({ children, description, side = "bottom", sideOffset = 0 }: HintProps) => (
    <TooltipProvider>
        <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
                {children}
            </TooltipTrigger>
            <TooltipContent side={side} sideOffset={sideOffset}>
                {description}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)