import TopShot from 0x0b2a3299cc857e29
import NonFungibleToken from 0x1d7e57aa55817448

pub fun main(account: Address): [&TopShot.NFT] {
    let collection = getAccount(account).getCapability(/public/MomentCollection)
        .borrow<&{TopShot.MomentCollectionPublic}>()
        ?? panic("Can't get the user's collection.")

    var returnVals: [&TopShot.NFT] = []
    let ids = collection.getIDs()

    for id in ids {
        returnVals.append(collection.borrowMoment(id: id)!)
    }

    return returnVals
}