import styles from './App.module.css'
import tStyles from './Title.module.css'
import cn from 'classnames'

export const Title = (props: {
  start: () => void
}) => {
  const { start } = props

  return <div className={styles.container}>
    <p className={cn(tStyles.title, 'serif')}>寿司廻し</p>
    <div onClick={start} className={styles.typing}>
      <p className={tStyles.enter}>Press Enter key</p>
    </div>
  </div>
}