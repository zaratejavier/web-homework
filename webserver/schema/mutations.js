const graphql = require('graphql')
const { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLFloat, GraphQLInputObjectType } = graphql
const { TransactionModel } = require('../data-models/Transaction')
const TransactionType = require('./transaction-type')
const Transactions = require('../query-resolvers/transaction-resolvers.js')

const TransactionInputType = new GraphQLInputObjectType({
  name: 'TransactionInput',
  fields: () => ({
    id: { type: GraphQLString },
    user_id: { type: GraphQLString },
    description: { type: GraphQLString },
    merchant_id: { type: GraphQLString },
    debit: { type: GraphQLBoolean },
    credit: { type: GraphQLBoolean },
    amount: { type: GraphQLFloat }
  })
})

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTransaction: {
      type: TransactionType,
      args: {
        user_id: { type: GraphQLString },
        description: { type: GraphQLString },
        merchant_id: { type: GraphQLString },
        debit: { type: GraphQLBoolean },
        credit: { type: GraphQLBoolean },
        amount: { type: GraphQLFloat }
      },
      /* eslint-disable-next-line camelcase */
      resolve (parentValue, { user_id, description, merchant_id, debit, credit, amount }) {
        return (new TransactionModel({ user_id, description, merchant_id, debit, credit, amount })).save()
      }
    },
    deleteTransaction: {
      type: TransactionType,
      args: {
        transactionId: { type: GraphQLString }
      },
      resolve(parentVal, { transactionId }) {
        return Transactions.deleteOne(transactionId)
      }
    },

    updateTransaction: {
      type: TransactionType,
      args: {
        transaction: { type: TransactionInputType }
      },
      resolve(parentVal, { transaction }) {
        return Transactions.update(transaction)
      }
    }
  }
})

module.exports = mutation
