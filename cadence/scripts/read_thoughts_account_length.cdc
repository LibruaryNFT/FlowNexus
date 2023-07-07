import FindThoughts from 0x097bafa4e0b48eef

pub fun main(account: Address): Int {
    let collectionPath = FindThoughts.CollectionPublicPath
    let capability = getAccount(account)
        .getCapability<&{FindThoughts.CollectionPublic}>(collectionPath)

    if let collection = capability.borrow() {
        var returnVals: [&FindThoughts.Thought{FindThoughts.ThoughtPublic}] = []
        let ids = collection.getIDs()

        for id in ids {
            returnVals.append(collection.borrowThoughtPublic(id)!)
        }

        return returnVals.length
    } else {
        return 0
    }
}
