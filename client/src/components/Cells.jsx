import {useState} from "react"

export default function Cells({value, row, column, isDisabled, onCellClick}) {
    const [isNotMyTurn, setIsNotMyTurn] = useState(false);
    const isDisabled = value === "O" || value === "X"

    const handleClick = () => {
        if(!value && !isDisabled) {
            onCellClick(row, column)
        }
    }

    return (
        <>
        <button className="cell"
        disabled={value || isDisabled || isNotMyTurn}
        onClick={handleClick}>
            {value}
        </button>
        </>
    )
}