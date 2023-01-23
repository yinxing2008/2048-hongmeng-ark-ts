/**
 * 厦门大学计算机专业 | 前华为工程师
 * 专注《零基础学编程系列》  http://lblbc.cn/blog
 * 包含：Java | 安卓 | 前端 | Flutter | iOS | 小程序 | 鸿蒙
 * 公众号：蓝不蓝编程
 */
export class GameController {
    cellArr: number[][] = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    isGameOver: boolean = false
    init(cellArr: number[]) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                this.cellArr[i][j] = cellArr[i * 4+j]
            }
        }
        this.isGameOver = false
        this.fillOneEmptyCell()
        this.fillOneEmptyCell()
    }

    //找到可以用于生成新数字的单元格，并生成新的数字进行填充
    fillOneEmptyCell() {
        let cellIndex = this.findOneEmptyCell()
        if (cellIndex != -1) {
            let row = Math.floor(cellIndex / 4)
            let col = cellIndex % 4
            this.cellArr[row][col] = this.getRandomValue()
        }
    }

    //找到可以用于生成新数字的单元格
    findOneEmptyCell() {
        let cells = []
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (!this.cellArr[i][j]) {
                    cells.push(i * 4 + j)
                }
            }
        }

        if (cells.length) {
            return cells[this.randomVal(cells.length)]
        } else {
            return -1
        }
    }

    //生成新的数字，90%几率生成2，10%几率生成4
    getRandomValue() {
        let rand = this.randomVal(10);
        var value = 2;
        if (rand >= 9) {
            value = 4;
        }
        return value;
    }

    randomVal(max: number) {
        return Math.floor(Math.random() * max)
    }
    /*
     判断是否还可以移动。
     1、当前单元格是否为0；
     2、当前单元格和右侧单元格是否相等；
     3、当前单元格和下方单元格是否相等。
     */
    canMove() {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let cell = this.cellArr[i][j]
                if (cell) {
                    //和右侧单元格比较，是否相等
                    if (j < 3 && this.cellArr[i][j] == this.cellArr[i][j + 1]) {
                        return true
                    }
                    //和下方单元格比较，是否相等
                    if (i < 3 && this.cellArr[i][j] == this.cellArr[i + 1][j]) {
                        return true
                    }
                } else {
                    return true
                }
            }
        }
        return false
    }

    /**
     * 将单元格数向左或向右移动，移除0并对相邻相同数进行叠加
     * toLeft表示是否是向左
     */
    horizontalMoveCells(toLeft: boolean) {
        for (let i = 0; i < 4; i++) {
            let newArr = Array(4).fill(0)
            for (let j = 0; j < 4; j++) {
                newArr[j] = this.cellArr[i][j]
            }
            let resultArr = this.removeZerosAndAdd(newArr, toLeft)
            for (let j = 0; j < 4; j++) {
                this.cellArr[i][j] = resultArr[j]
            }
        }
    }
    /**
     * 将单元格数向下或向上移动，移除0并对相邻相同数进行叠加
     * toUp表示是否是向上
     */
    verticalMoveCells(toUp: boolean) {
        for (let i = 0; i < 4; i++) {
            let newArr = Array(4).fill(0)
            for (let j = 0; j < 4; j++) {
                newArr[j] = this.cellArr[j][i]
            }
            let resultArr = this.removeZerosAndAdd(newArr, toUp)
            for (let j = 0; j < 4; j++) {
                this.cellArr[j][i] = resultArr[j]
            }
        }
    }
    /**
     * 1、去掉数组中的0，向头或向尾压缩数组。
     * 0,4,0,4向左压缩变成：4,4,0,0. 向右压缩变成：0,0,4,4
     * 2、相邻的数如果相同，则进行相加运算。
     * 4,4,0,0向左叠加变成：8,0,0,0. 向右叠加变成：0,0,0,8
     * toHead表示是否是头压缩
     */
    removeZerosAndAdd(arr: number[], toHead: boolean) {
        let newArr = Array(4).fill(0)
        let arrWithoutZero = arr.filter((x) => x !== 0) //去掉所有的0
        if (arrWithoutZero.length == 0) {
            return newArr
        }
        if (toHead) {
            for (let i = 0; i < arrWithoutZero.length; i++) {
                newArr[i] = arrWithoutZero[i]
            }
            //对相邻相同的数进行叠加
            for (let i = 0; i < newArr.length - 1; i++) {
                if (newArr[3 - i] === newArr[2 - i] && newArr[3 - i] !== 0) {
                    newArr[3 - i] = 0
                    newArr[2 - i] *= 2
                }
            }
        } else {
            for (let i = 0; i < arrWithoutZero.length; i++) {
                newArr[newArr.length - i - 1] =
                arrWithoutZero[arrWithoutZero.length - i - 1]
            }

            //对相邻相同的数进行叠加
            for (let i = 0; i < newArr.length - 1; i++) {
                if (newArr[i] === newArr[i + 1] && newArr[i] !== 0) {
                    newArr[i] = 0
                    newArr[i + 1] *= 2
                }
            }
        }

        return newArr
    }

    moveUp() {
        this.verticalMoveCells(true)
        this.checkGameOverOrContinue()
    }

    moveDown() {
        this.verticalMoveCells(false)
        this.checkGameOverOrContinue()
    }

    moveLeft() {
        this.horizontalMoveCells(true)
        this.checkGameOverOrContinue()
    }

    moveRight() {
        this.horizontalMoveCells(false)
        this.checkGameOverOrContinue()
    }

    checkGameOverOrContinue() {
        if (this.canMove()) {
            this.fillOneEmptyCell()
        } else {
            this.isGameOver = true
        }
    }

    /**
     * 将二维数组转为一维数据
     */
    getFlatCellArr() {
        var flatCellArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                flatCellArr[i * 4+j] = this.cellArr[i][j]
            }
        }
        return flatCellArr
    }
}