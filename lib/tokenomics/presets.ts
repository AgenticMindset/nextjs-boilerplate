import type { PresetToken } from "./types";

export interface TokenProfile {
  label: string;
  summary: string;
}

export const TOKEN_PROFILES: Record<Exclude<PresetToken, "Custom">, TokenProfile> = {
  ETH: {
    label: "Ethereum (ETH)",
    summary: `Emission schedule: Post-Merge proof-of-stake issuance to validators (roughly 0.5-1% annual issuance depending on total stake), offset by EIP-1559 base-fee burn. Net supply can be inflationary or deflationary depending on network usage. Staking mechanics: ~25-30% of supply staked via validators (32 ETH minimum to run a solo validator, or pooled via liquid staking tokens like stETH/rETH). Staked ETH has a withdrawal queue but no fixed unbonding lockup beyond queue depth. Governance structure: no on-chain governance for the base protocol; changes go through off-chain rough consensus (client teams, researchers, community calls) via EIPs. Liquidity characteristics: deepest liquidity of any smart-contract platform, spread across centralized exchanges and DeFi (Uniswap, Curve, Aave), plus a large derivatives market. Reserve/backing: no backing mechanism, value derives from network usage, security budget, and monetary policy credibility.`,
  },
  SOL: {
    label: "Solana (SOL)",
    summary: `Emission schedule: proof-of-stake issuance starting near 8% annually, disinflating by 15% per year toward a long-run terminal rate around 1.5%. Staking mechanics: the large majority of supply is staked (commonly 65-70%+), delegated to validators; unstaking requires waiting for an epoch boundary (roughly 2-3 days), not instant. Governance structure: informal off-chain governance led by core engineering teams and the validator/foundation ecosystem; no binding on-chain token vote for protocol upgrades. Liquidity characteristics: strong and growing liquidity concentrated on a smaller number of venues than ETH, with meaningful reliance on a few large market makers and centralized exchange order books. Reserve/backing: no backing mechanism; value derives from network throughput, ecosystem activity, and staking yield. Network has a history of validator-client outages that briefly halted block production, which is a relevant liveness consideration under stress.`,
  },
  USDT: {
    label: "Tether (USDT)",
    summary: `Emission schedule: minted and burned on demand by Tether Limited in response to customer deposits and redemptions; supply is fully discretionary, not algorithmic. Staking mechanics: none, USDT is not a yield-bearing or staked asset at the protocol level. Governance structure: fully centralized, controlled by Tether Limited (a private company); the issuer can freeze addresses and has done so under law-enforcement requests. Liquidity characteristics: the deepest stablecoin liquidity in crypto, the dominant trading-pair currency on most exchanges. Reserve/backing: claims roughly 1:1 backing by a reserve portfolio of cash, cash equivalents, short-term US Treasuries, and a smaller allocation to other investments (including secured loans and other assets in past attestations); backing is attested periodically by an accounting firm, not fully audited under a standard financial audit, which has historically been the industry's central point of skepticism.`,
  },
  "Algorithmic Stablecoin": {
    label: "Algorithmic Stablecoin (generic archetype)",
    summary: `Emission schedule: elastic supply expands and contracts algorithmically to defend a peg, typically via a mint/burn arbitrage against a paired volatile "shock-absorber" token (the LUNA/UST-style dual-token seigniorage design). Staking mechanics: often offers a protocol-native yield (sometimes far above market rates) to bootstrap demand for holding the stablecoin, funded by protocol reserves, emissions of the paired token, or new depositor inflows. Governance structure: typically a foundation or DAO controls peg-defense parameters and reserve deployment, with limited real-time community oversight during a crisis. Liquidity characteristics: peg stability depends entirely on continuous, deep arbitrage activity between the stablecoin and its paired token; liquidity can evaporate rapidly once confidence in the arbitrage mechanism breaks. Reserve/backing: partially or fully unbacked by hard assets; backing is instead a reflexive claim on the market value of the paired volatile token, which is the structural feature that enables a death spiral once the peg breaks.`,
  },
  "Governance Token": {
    label: "Governance Token (generic archetype)",
    summary: `Emission schedule: fixed or decaying emission curve distributed to liquidity providers, stakers, or contributors (typical of DeFi protocol tokens), often with a large allocation reserved for team/investors under multi-year vesting. Staking mechanics: tokens can usually be staked or locked (sometimes with vote-escrow mechanics) to earn a share of protocol fees and boost voting power. Governance structure: on-chain or Snapshot-based token voting controls treasury spending, fee parameters, and protocol upgrades; voting power is typically concentrated among early investors, the founding team, and large holders ("whales"), creating real plutocratic-capture risk. Liquidity characteristics: liquidity is usually much thinner than major L1 tokens and highly sensitive to unlock schedules, since large vested tranches unlocking at once can overwhelm order books. Reserve/backing: value is a claim on future protocol fee flows and treasury assets, not a hard peg; treasury composition (stablecoins vs. the protocol's own token) materially affects resilience.`,
  },
};
