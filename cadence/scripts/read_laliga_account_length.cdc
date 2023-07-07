import Golazos from 0x87ca73a41bb50ad5

pub fun main(account: Address): Int {
    let collectionPath = Golazos.CollectionPublicPath
    let capability = getAccount(account)
        .getCapability<&{Golazos.MomentNFTCollectionPublic}>(collectionPath)

    if let collection = capability.borrow() {
        var returnVals: [&Golazos.NFT] = []
        let ids = collection.getIDs()

        for id in ids {
            returnVals.append(collection.borrowMomentNFT(id: id)!)
        }

        return returnVals.length
    } else {
        return 0
    }
}
