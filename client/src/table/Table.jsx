import Cells from "../cells"

export default function Table({board, isDisabled, state}) {
    return (
        <div className="table" style={state ? {pointerEvents: "none"} : {}}>
            {board.map((row, rowIndex) => {
                row.map((element, colIndex) => {
                    return (
                        <Cells key = {`${rowIndex} ${colIndex}`}
                        row = {rowIndex}
                        column = {colIndex}
                        value = {element}
                        isDisabled = {isDisabled}
                        ></Cells>
                    )
                })
            })}

        </div>
    )
}