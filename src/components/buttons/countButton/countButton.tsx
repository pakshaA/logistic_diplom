import { Button } from "@/components/templates";

interface IProps {
    onClick: () => void;
}

export const CountButton = ({onClick}: IProps) => {
    return (
        <Button text="Рассчитать" type="colored" onClick={onClick} className="w-[200px] text-center"/>
    )
}