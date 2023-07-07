import Profile from 0x097bafa4e0b48eef

pub fun main(address: Address): String? {
    let profile = Profile.find(address)

    let userReport: Profile.UserReport? = profile.asReport()

    if let report = userReport {
        return report.avatar
    }

    return nil
}
