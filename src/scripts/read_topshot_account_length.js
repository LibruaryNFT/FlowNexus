export const getTopShotLength = `

import TopShot from 0x0b2a3299cc857e29

pub fun main(account: Address): Int {
    let collectionPath = /public/MomentCollection
    let capability = getAccount(account)
        .getCapability<&{TopShot.MomentCollectionPublic}>(collectionPath)

    if let collection = capability.borrow() {
        var returnVals: [&TopShot.NFT] = []
        let ids = collection.getIDs()

        for id in ids {
            returnVals.append(collection.borrowMoment(id: id)!)
        }

        return returnVals.length
    } else {
        return 0
    }
}

`