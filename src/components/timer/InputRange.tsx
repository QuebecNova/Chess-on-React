import React from 'react'

type Props = {
    rangeValue: string,
    setRangeValue: React.Dispatch<React.SetStateAction<string>>,
    setTimer: () => void
}

export default function InputRange({rangeValue, setRangeValue, setTimer}: Props) {
    
    function handleChangeValue(e : React.ChangeEvent<HTMLInputElement>) {
        setRangeValue(e.target.value)
    }
    
  return (
    <div className={`board__define-side active`}>
        <p>Set timer</p>
        <p>
            {rangeValue}
            <span> minutes</span>
        </p>
        <input
            type="range" 
            min={1} 
            max={180} 
            value={rangeValue} 
            onChange={handleChangeValue}
        />
        <button className='custom-btn btn-5' onClick={() => setTimer()}>
            <span>Ok!</span>
        </button>
    </div>
  )
}