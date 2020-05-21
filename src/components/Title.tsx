import styles from './Result.module.css'

export const Title = (props: {
  start: () => void
}) => {
  const { start } = props

  return <div className={styles.container}>
    寿司
    <button onClick={start}>Press enter key</button>
  </div>
}