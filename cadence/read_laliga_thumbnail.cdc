import Golazos from 0x87ca73a41bb50ad5
import MetadataViews from 0x1d7e57aa55817448

/// This script gets all the view-based metadata associated with the specified NFT
/// and returns it as a single struct

pub struct NFT {

		pub let thumbnail: String

    init(
       
				thumbnail: String,
	
    ) {
        
				self.thumbnail = thumbnail
	
    }
}

pub fun main(address: Address, id: UInt64): NFT {
    let account = getAccount(address)

    let collection = account
        .getCapability(/public/GolazosNFTCollection)
        .borrow<&{Golazos.MomentNFTCollectionPublic}>()
        ?? panic("Could not borrow a reference to the collection")

    let nft = collection.borrowMomentNFT(id: id)!

    // Get the basic display information for this NFT
    let display = MetadataViews.getDisplay(nft)!
	

    return NFT(
				thumbnail: display.thumbnail.uri(),
	
    )
}