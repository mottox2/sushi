import { KeyboardEvent } from 'react'
import commonStyles from './App.module.css'
import styles from './Result.module.css'
import cn from 'classnames'
import { useInputRef } from '../hooks/useInput'

const url = 'https://sushi-mawashi.now.sh/'

export const Result = (props: {
  miss: number,
  score: number,
  rotation: number,
  restart: () => void;
}) => {
  const { miss, score, restart, rotation } = props
  const inputRef = useInputRef()
  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') restart()
  }
  const text = `${Math.floor(rotation)}回寿司を廻しました。`
  const shareUrl = `http://twitter.com/share?url=${url}&text=${text}&hashtags=寿司廻し`

  return <div className={styles.container} onClick={() => inputRef.current && inputRef.current.focus()}>
    <input className={commonStyles.input} type='text' tabIndex={0} onKeyDown={onKeyDown} ref={inputRef} />
    <div>
      <h1 className={cn(styles.title, 'serif')}>結果</h1>
      <div className={styles.flex}>
        {/* <div className={styles.score}>
          <div className={cn(styles.scoreLabel, 'serif')}>
            食べた寿司
          </div>
          <div className={styles.scoreValue}>
            {score}
            <small>貫</small>
          </div>
        </div> */}
        <div className={styles.score}>
          {/* <div className={cn(styles.scoreLabel, 'serif')}>
            回した回数
          </div> */}
          <div className={cn(styles.scoreValue, 'serif')}>
            <span className='sansserif'>{Math.floor(rotation)}</span>
            <small>回寿司を回しました</small>
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <a className={cn(styles.btn, styles.twitter)} href={shareUrl} target="_blank">Twitterでシェアする</a>
        <button className={styles.btn} onClick={restart}>タイトルに戻る</button>
      </div>
    </div>
  </div>
}