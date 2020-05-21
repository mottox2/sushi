import styles from './Result.module.css'

export const Result = (props: {
  miss: number,
  score: number,
  restart: () => void;
}) => {
  const { miss, score, restart } = props

  return <div className={styles.container}>
    <h1 className='serif'>結果</h1>
    score: {score}<br/>
    miss: {miss}<br/>

    <button onClick={restart}>タイトルに戻る</button>
  </div>
}