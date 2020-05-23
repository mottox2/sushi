import { KeyboardEvent } from 'react'
import styles from './App.module.css'
import tStyles from './Title.module.css'
import cn from 'classnames'
import { useInputRef } from '../hooks/useInput'

export const Title = (props: {
  start: () => void
}) => {
  const { start } = props
  const inputRef = useInputRef()
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === 13) start()
  }

  return <div className={styles.container} onClick={() => inputRef.current.focus()}>
    <input className={styles.input} type='text' tabIndex={0} onKeyDown={onKeyDown} ref={inputRef} />
    <p className={cn(tStyles.title, 'serif')}>寿司廻し</p>
    <div onClick={start} className={cn(styles.typing, tStyles.blink)}>
      <p className={tStyles.enter}>Press Enter key</p>
    </div>
  </div>
}