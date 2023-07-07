export const getLaLigaAccountID = `

import Golazos from 0x87ca73a41bb50ad5
import NonFungibleToken from 0x1d7e57aa55817448

pub fun main(account: Address, id: UInt64): &Golazos.NFT {
    let collection = getAccount(account).getCapability(Golazos.CollectionPublicPath)
        .borrow<&{Golazos.MomentNFTCollectionPublic}>()
        ?? panic("Can't get the user's collection.")

    let nft = collection.borrowMomentNFT(id: id)!
	return nft
}

`