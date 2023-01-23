/**
 * 厦门大学计算机专业 | 前华为工程师
 * 专注《零基础学编程系列》  http://lblbc.cn/blog
 * 包含：Java | 安卓 | 前端 | Flutter | iOS | 小程序 | 鸿蒙
 * 公众号：蓝不蓝编程
 */
export class GameDataSource implements IDataSource {
    public dataArray: string[][] = []

    constructor(ele) {
        for (var index = 0;index < ele.length; index++) {
            this.dataArray.push(ele[index])
        }
    }

    public totalCount(): number {
        return this.dataArray.length
    }

    public getData(index: number): any {
        return this.dataArray[index]
    }

    registerDataChangeListener(listener: DataChangeListener): void {
    }

    unregisterDataChangeListener(listener: DataChangeListener): void {
    }
}