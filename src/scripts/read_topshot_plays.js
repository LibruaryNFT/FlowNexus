export const getTopShotPlays = `

import TopShot from 0x0b2a3299cc857e29

pub struct MetaData {
    pub let fullName: AnyStruct
    pub let playType: AnyStruct
    pub let playCategory: AnyStruct
    pub let teamAtMoment: AnyStruct
    pub let jerseyNumber: AnyStruct

    init(fullName: AnyStruct, playType: AnyStruct, playCategory: AnyStruct, teamAtMoment: AnyStruct, jerseyNumber: AnyStruct) {
        self.fullName = fullName
        self.playType = playType
        self.playCategory = playCategory
        self.teamAtMoment = teamAtMoment
        self.jerseyNumber = jerseyNumber
    }
}

pub fun loopFunc(fields: [String], start: UInt32, end: UInt32, func: ((UInt32): MetaData)): {UInt32: MetaData} {
    var i: UInt32 = start
    var items: {UInt32: MetaData} = {}
    while i < end {
        items[i] = func(id: i)
        i = i + 1
    }
    return items
}

pub fun main(): {UInt32: MetaData} {
    let fields = ["FullName", "PlayType", "PlayCategory", "TeamAtMoment", "JerseyNumber"]
    var event = loopFunc(fields: fields, start: 1, end: TopShot.nextPlayID, 
                         func: fun(id: UInt32): MetaData { 
                             let fullName = TopShot.getPlayMetaDataByField(playID: id, field: fields[0]) as AnyStruct
                             let playType = TopShot.getPlayMetaDataByField(playID: id, field: fields[1]) as AnyStruct
                             let playCategory = TopShot.getPlayMetaDataByField(playID: id, field: fields[2]) as AnyStruct
                             let teamAtMoment = TopShot.getPlayMetaDataByField(playID: id, field: fields[3]) as AnyStruct
                             let jerseyNumber = TopShot.getPlayMetaDataByField(playID: id, field: fields[4]) as AnyStruct
                             return MetaData(fullName: fullName, playType: playType, playCategory: playCategory, 
                                             teamAtMoment: teamAtMoment, jerseyNumber: jerseyNumber)
                         })

    return event
}


`