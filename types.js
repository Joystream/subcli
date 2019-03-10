// See https://github.com/paritytech/oo7/blob/master/packages/oo7-substrate/src/codec.js
const { addCodecTransform } = require('oo7-substrate')

const u32 = 'u32'
const u64 = 'u64'

const BlockNumber = 'BlockNumber'
const AccountId = 'AccountId'
const Balance = 'Balance'
const Hash = 'Hash'

const module_council = {
  'Seat<AccountId, BalanceOf<T>>' : {
    member: AccountId,
    stake: Balance,
    backers: 'Vec<Backer<AccountId, BalanceOf<T>>'
  },
  // 'Backer<AccountId, BalanceOf<T>>': {
  // Bug ..proper type notation resulting in: Unknown type to decode: Backer<AccountId,BalanceOf<T>
  'Backer<AccountId, BalanceOf<T>': {
    member: AccountId,
    stake: Balance
  },
  'Seats<AccountId, BalanceOf<T>>': 'Vec<Seat<AccountId, BalanceOf<T>>>'
}

const module_elections = {
    // Id: AccountId,
    'Stake<Balance>': {
        new: Balance,
        transferred: Balance,
    },
    'SealedVote<AccountId, Stake, Hash, Vote>': {
        voter: AccountId,
        commitment: Hash,
        stake: 'Stake',
        vote: 'Option<AccountId>',
    },
    'ElectionStage<BlockNumber>': {
        _enum: {
            Announcing: BlockNumber,
            Voting: BlockNumber,
            Revealing: BlockNumber,
        }
    },
    'TransferableStake<Balance>': {
        seat: Balance,
        backing: Balance,
    },
}

const module_proposals = {
    ProposalId: u32,
    ProposalStatus: {
        _enum: [
            'Pending',
            'Cancelled',
            'Expired',
            'Approved',
            'Rejected',
            'Slashed',
        ]
    },
    'Proposal<AccountId, Balance, BlockNumber>': {
        id: 'ProposalId',
        proposer: AccountId,
        stake: Balance,
        name: 'Vec<u8>',
        description: 'Vec<u8>',
        wasm_code: 'Vec<u8>',
        proposed_at: BlockNumber,
        status: 'ProposalStatus',
    },
    VoteKind: {
        _enum: [
            'Abstention',
            'Approve',
            'Reject',
            'Slash',
        ]
    },
    'TallyResult<BlockNumber>': {
        proposal_id: 'ProposalId',
        abstentions: u32,
        approvals: u32,
        rejections: u32,
        slashes: u32,
        status: 'ProposalStatus',
        finalized_at: BlockNumber,
    },
}

const JoystreamTypes = Object.assign({},
    module_council,
    module_elections,
    module_proposals,
)

/** Parity codec will not recognize a type properly if there are spaces in its name. */
function removeSpaces(str) {
    return typeof str === 'string' ? str.replace(/[\s]+/g, '') : str;
}

/** Register custom types of Joystream Node. */
module.exports.register = function registerJoystreamTypes() {
    Object.keys(JoystreamTypes).forEach((typeName) => {
        addCodecTransform(
            removeSpaces(typeName),
            removeSpaces(JoystreamTypes[typeName])
        );
    });
};
