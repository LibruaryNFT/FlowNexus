import TopShot from 0x0b2a3299cc857e29

pub fun loopFunc(start: UInt32, end: UInt32, func: ((UInt32): AnyStruct)): {UInt32: AnyStruct} {
	var i: UInt32 = start
	var items: {UInt32: AnyStruct} = {}
	while i < end {
		items[i] = func(id: i)
		i = i + 1
	}
	return items
}

pub fun main(): AnyStruct {
	var event = loopFunc(start: 1, end: TopShot.nextPlayID, func: TopShot.getPlayMetaData)

	return {
		"event": event

	}
}