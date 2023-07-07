import TopShot from 0x0b2a3299cc857e29
    pub struct TopShotData {
      pub let plays: [TopShot.Play]
      init() {
        self.plays = TopShot.getAllPlays()
      }
    }
    pub fun main(): TopShotData {
      return TopShotData()
    }