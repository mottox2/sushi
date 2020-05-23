import styles from './Result.module.css'
import cn from 'classnames'

export const Result = (props: {
  miss: number,
  score: number,
  restart: () => void;
}) => {
  const { miss, score, restart } = props
  const url = 'https://sushi-mawashi.now.sh/'
  const text = '寿司を回しました'
  const shareUrl = `http://twitter.com/share?url=${url}&text=${text}&hashtags=寿司廻し`

  return <div className={styles.container}>
    <div>
      <h1 className={cn(styles.title, 'serif')}>結果</h1>
      <div className={styles.flex}>
        <div className={styles.score}>
          <div className={cn(styles.scoreLabel, 'serif')}>
            食べた寿司
          </div>
          <div className={styles.scoreValue}>
            {score}
            <small>貫</small>
          </div>
        </div>
        <div className={styles.score}>
          <div className={cn(styles.scoreLabel, 'serif')}>
            ミスした回数
          </div>
          <div className={styles.scoreValue}>
            {miss}
            <small>回</small>
          </div>
        </div>
      </div>
      <button className={styles.btn} onClick={restart}>タイトルに戻る</button>
      <a className={styles.btn} href={shareUrl} target="_blank">Twitterでシェアする</a>
    </div>
  </div>
}