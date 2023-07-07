export const getProfile = `

import Profile from 0x097bafa4e0b48eef

pub fun main(address: Address): Profile.UserReport? {
    let profile = Profile.find(address)

    return profile.asReport()
}

`