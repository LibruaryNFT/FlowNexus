This is an open-sourced project built on the Flow blockchain to create and/or test functionalities.

It's becoming a bit addictive to keep adding to it, and others might find value in the content.

# Demo Video:

[https://FlowNexus.io/](https://www.youtube.com/watch?v=3Q5vJb24q_U)

# Scripts

 flow scripts execute ./cadence/read_topshot.cdc 0x1a54f38e57ac3866 --network=mainnet

 # Transactions

 flow transactions send .\cadence\transactions\create_thought.cdc "Heres a test" "the body of course" [] nil nil nil nil nil nil nil --network=mainnet --signer=justin

# Generating a new Mainnet Account
flow accounts create
