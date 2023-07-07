import UFC_NFT from 0x329feb3ab062d289

pub fun main(account: Address): Int {
    let collectionPath = UFC_NFT.CollectionPublicPath
    let capability = getAccount(account)
        .getCapability<&{UFC_NFT.UFC_NFTCollectionPublic}>(collectionPath)

    if let collection = capability.borrow() {
        var returnVals: [&UFC_NFT.NFT] = []
        let ids = collection.getIDs()

        for id in ids {
            returnVals.append(collection.borrowUFC_NFT(id: id)!)
        }

        return returnVals.length
    } else {
        return 0
    }
}