async function promiseTimeout(asy, num) {
  let oldTime = Date.now(),
    curTime = 0
  try {
    await asy()
  } catch {}
  curTime = Date.now()
  if (curTime - oldTime > num) {
    return Promise.reject('promise time out')
  } else {
    return asy
  }
}
