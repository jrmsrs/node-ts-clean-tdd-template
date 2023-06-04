/*
 * handmade script to lint commit messages
 * author: jrmsrs
 * license: MIT
 *
 * format: <emoji><space><parenthesis><scope><parenthesis><space><subject><newline><newline><body>
 *
 * emoji meaning
 * 🔧 chore
 * 👷 ci
 * 🔨 refactor
 * 🐎 perf
 * 📚 docs
 * 🐛 fix
 * ✨ feat
 * 💄 style
 * 🚀 deploy
 * 🧪 test
 * ⏪ revert
 * 🎉 first commit
 */
const fs = require('fs')

const msg = fs.readFileSync(process.argv[2], 'utf-8').slice(0, -1) // remove trailing newline
const msgFirstLine = msg.split('\n')[0]
const msgSecondLine = msg.split('\n')[1]

// -- todo lint body --
// const msgBody = msg.split('\n').slice(2).join('\n');

const checkUppercase = /^[^A-Z]*$/

const emojiSpace = msgFirstLine.slice(0, 3)
const emojiSpaceRegex = /^(🔧|👷|🔨|🐎|📚|🐛|✨|💄|🚀|🧪|⏪|🎉) /

const hasScopeRegex = /\([^()]*\)/
const hasScope = hasScopeRegex.test(msgFirstLine)

const scope = hasScope ? msgFirstLine.slice(4).split(')')[0] : null // after emoji and space, between (not including) parenthesis
const scopeRegex = /^([a-z-]+)$/ // non-empty, non-space, non-parenthesis

const spaceSubject = msgFirstLine.slice(emojiSpace.length + (scope?.length ?? -3) + 2) // after scope and parenthesis
const spaceSubjectRegex = /^ [^()]+/ // non-empty, starts with space, any special characters except parenthesis

class CommitMsgError extends Error {
  constructor (message) {
    super()
    this.message = message
  }
}

if (!checkUppercase.test(msg)) {
  const message = `-> uppercase; msg should not contain uppercase letters\n${msg}`
  console.log(`commit -m Error: ${message}`)
  throw new CommitMsgError(message)
}

if (!emojiSpaceRegex.test(emojiSpace)) {
  const message = `-> emoji+space; msg should start with an emoji followed by a space. allowed emojis: 🔧-👷-📦-🚨-🚀-🔨-💎-📚-🐛-✨\n${msg}`
  console.log(`commit -m Error: ${message}`)
  throw new CommitMsgError(message)
}

if (scope && !scopeRegex.test(scope)) {
  const message = `-> scope; scope are optional, but if provided it should be a single word between (parenthesis)\n${msg}`
  console.log(`commit -m Error: ${message}`)
  throw new CommitMsgError(message)
}

if (!spaceSubjectRegex.test(spaceSubject)) {
  const message = `-> space+subject; subject starts with space and should not contain parenthesis\n${msg}`
  console.log(`commit -m Error: ${message}`)
  throw new CommitMsgError(message)
}

if (msgSecondLine && msgSecondLine !== '') {
  const message = `-> newline; second line is not empty\n${msg}`
  console.log(`commit -m Error: ${message}`)
  throw new CommitMsgError(message)
}

console.log('passed commit message linting')

process.exit(0)
