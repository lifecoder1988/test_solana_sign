use anchor_lang::prelude::*;

declare_id!("5tBeqTQRrMqnPX8QKSYmmdVKUBHufgAVe5h62dWcsHKd");

#[program]
mod hello_anchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, data: u64) -> Result<()> {
        // Ensure that both signers are valid (automatically done by Anchor)
        ctx.accounts.new_account.data = data;
        msg!("Changed data to: {}!", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    // Initialize a new account with space for u64
    #[account(init, payer = signer1, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,

    // First signer
    #[account(mut)]
    pub signer1: Signer<'info>,

    // Second signer
    #[account(mut)]
    pub signer2: Signer<'info>, // Require a second signature

    // System program
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    data: u64, // Data to store
}
