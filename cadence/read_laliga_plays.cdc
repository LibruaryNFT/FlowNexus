import Golazos from 0x87ca73a41bb50ad5

pub fun main(): [AnyStruct] {
    
    let start: UInt64 = 1
    let end: UInt64 = Golazos.nextPlayID - UInt64(1)
    var data: [AnyStruct] = []

    var id: UInt64 = start
    while id <= end {
        let playData = Golazos.getPlayData(id: id)
        data.append(playData)
        id = id + UInt64(1)
    }
    
    return data
}
