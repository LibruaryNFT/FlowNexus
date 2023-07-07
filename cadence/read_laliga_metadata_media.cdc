import Golazos from 0x87ca73a41bb50ad5
import MetadataViews from 0x1d7e57aa55817448

/// This script gets all the view-based metadata associated with the specified NFT
/// and returns it as a single struct

pub struct NFT {

		pub let medias: MetadataViews.Medias?

    init(
       
				medias:MetadataViews.Medias?,
	
    ) {
        
				self.medias=medias
	
    }
}

pub fun main(address: Address, id: UInt64): NFT {
    let account = getAccount(address)

    let collection = account
        .getCapability(/public/GolazosNFTCollection)
        .borrow<&{Golazos.MomentNFTCollectionPublic}>()
        ?? panic("Could not borrow a reference to the collection")

    let nft = collection.borrowMomentNFT(id: id)!

    
    let owner: Address = nft.owner!.address!
    let nftType = nft.getType()

		let medias=MetadataViews.getMedias(nft)
	

    return NFT(
				medias:medias,
	
    )
}