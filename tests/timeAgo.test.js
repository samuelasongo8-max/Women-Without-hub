import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getMillisecondsUntilNairobiMidnight,
  getTimeAgo,
} from '../src/utils/timeAgo.js'

const today = new Date('2026-10-31T12:00:00+03:00')

test('returns today for a Nairobi calendar date of today', () => {
  assert.deepEqual(getTimeAgo('2026-10-31', today), {
    unit: 'today',
    count: 0,
  })
})

test('uses Nairobi date across the UTC date boundary', () => {
  const afterNairobiMidnight = new Date('2026-10-30T22:00:00Z')
  assert.deepEqual(getTimeAgo('2026-10-31', afterNairobiMidnight), {
    unit: 'today',
    count: 0,
  })
})

test('returns yesterday for one calendar day ago', () => {
  assert.deepEqual(getTimeAgo('2026-10-30', today), {
    unit: 'yesterday',
    count: 1,
  })
})

test('returns days for dates two to six days ago', () => {
  assert.deepEqual(getTimeAgo('2026-10-25', today), {
    unit: 'day',
    count: 6,
  })
})

test('returns one week at seven days', () => {
  assert.deepEqual(getTimeAgo('2026-10-24', today), {
    unit: 'week',
    count: 1,
  })
})

test('returns two weeks for 17 October 2026 on 31 October 2026', () => {
  assert.deepEqual(getTimeAgo('2026-10-17', today), {
    unit: 'week',
    count: 2,
  })
})

test('the week count increases after another seven calendar days', () => {
  const followingWeek = new Date('2026-11-07T12:00:00+03:00')
  assert.deepEqual(getTimeAgo('2026-10-17', followingWeek), {
    unit: 'week',
    count: 3,
  })
})

test('uses whole calendar weeks for dates thirty days ago', () => {
  assert.deepEqual(getTimeAgo('2026-10-01', today), {
    unit: 'week',
    count: 4,
  })
})

test('does not return a negative age for a future date', () => {
  assert.equal(getTimeAgo('2026-11-01', today), null)
})

test('schedules the next update at Nairobi midnight', () => {
  const beforeMidnight = new Date('2026-10-31T20:59:59Z')
  assert.equal(
    getMillisecondsUntilNairobiMidnight(beforeMidnight),
    1001,
  )
})
