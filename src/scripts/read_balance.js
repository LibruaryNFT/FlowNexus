export const getBalance = `

import FungibleToken from 0xf233dcee88fe0abe
import FlowToken from 	0x1654653399040a61

pub fun main(address: Address): UFix64 {
    let account = getAccount(address)

    let vaultRef = account.getCapability(/public/flowTokenBalance)!
        .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
        ?? panic("Could not borrow reference to the vault balance")

    return vaultRef.balance
}


`