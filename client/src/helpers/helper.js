export const deserialize = (arr) => {
    let ans = [[], [], []]

    arr.forEach((element, index) => {
        let loc = Math.floor(index / 3)
        ans[loc].push(element)
    })

    return ans
}

export const serialize = (arr) => {
    let ans = []

    arr.forEach(row => {
        row.forEach(col => {
            ans.push(col)
        })
    })

    return ans
}

export const checkWinner = (arr, row, col) => {
    let symbol = arr[row][col]
    let size = arr.length
    let count = 0
    for (let i = 0; i < size; i++) {
        if (arr[i][i] === symbol)
            count++
    }

    if (count === size)
        return true

    count = 0
    for (let i = 0; i < size; i++) {
        if (arr[i][size - i - 1] === symbol)
            count++
    }

    if (count === size)
        return true

    // veritcal
    count = 0
    for (let i = 0; i < size; i++) {
        if (arr[row][i] === symbol)
            count++;
    }

    if (count === size)
        return true

    count = 0
    for (let i = 0; i < size; i++) {
        if (arr[i][col] === symbol)
            count++
    }

    if (count === size)
        return true
}

export const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c]
        ) {
            return squares[a];
        }
    }
    return null;
};

export const calculatedraw = (squares) => {
    if (Object.keys(squares).length <= 9) return false
    for (let i = 0; i < 9; i++) {
        if (squares[i] === null) return false
    }
    return true
}