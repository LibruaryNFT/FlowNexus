import AllDay from 0xe4cf4bdc1751c65d

pub fun main(account: Address): Int {
    let collectionPath = AllDay.CollectionPublicPath
    let capability = getAccount(account)
        .getCapability<&{AllDay.MomentNFTCollectionPublic}>(collectionPath)

    if let collection = capability.borrow() {
        var returnVals: [&AllDay.NFT] = []
        let ids = collection.getIDs()

        for id in ids {
            returnVals.append(collection.borrowMomentNFT(id: id)!)
        }

        return returnVals.length
    } else {
        return 0
    }
}