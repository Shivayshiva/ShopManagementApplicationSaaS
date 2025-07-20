'use client'

import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { increment, decrement } from '@/lib/features/counter/counterSlice'

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  )
}
