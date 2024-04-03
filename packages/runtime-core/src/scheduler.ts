const queue: any[] = []
const activePreFlushCbs: any = []

const p = Promise.resolve()
let isFlushPending = false

export function nextTick(fn?) {
  return fn ? p.then(fn) : p
}

export function queueJobs(job) {
  if (!queue.includes(job)) {
    queue.push(job)
    queueFlush()
  }
}

function queueFlush() {
  if (isFlushPending)
    return
  isFlushPending = true
  nextTick(flushJobs)
}

function flushJobs() {
  isFlushPending = false
  // flushPreFlushCbs()
  let job
  // eslint-disable-next-line no-cond-assign
  while (job = queue.shift())
    job()
}

function flushPreFlushCbs() {
  // 执行所有的 pre 类型的 job
  for (let i = 0; i < activePreFlushCbs.length; i++)
    activePreFlushCbs[i]()
}

export function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs)
}

function queueCb(cb, activeQueue) {
  // 直接添加到对应的列表内就ok
  // todo 这里没有考虑 activeQueue 是否已经存在 cb 的情况
  // 然后在执行 flushJobs 的时候就可以调用 activeQueue 了
  activeQueue.push(cb)

  // 然后执行队列里面所有的 job
  queueFlush()
}
