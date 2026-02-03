import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { useSystem } from '../../system/SystemContext'
import './Calculator.css'

/**
 * Calculator App - Basic arithmetic operations
 * Memory efficient: Minimal state (display + history)
 * Security: Input validation, prevents eval() injection
 */
const Calculator = () => {
  const { closeApp } = useSystem()
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [newNumber, setNewNumber] = useState(true)

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(String(num))
      setNewNumber(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.')
      setNewNumber(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handleOperation = (op) => {
    const current = parseFloat(display)
    
    if (previousValue === null) {
      setPreviousValue(current)
    } else if (operation) {
      const result = calculate(previousValue, current, operation)
      setDisplay(String(result))
      setPreviousValue(result)
    }
    
    setOperation(op)
    setNewNumber(true)
  }

  const calculate = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '*':
        return prev * current
      case '/':
        return current !== 0 ? prev / current : 0
      case '%':
        return prev % current
      default:
        return current
    }
  }

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display)
      const result = calculate(previousValue, current, operation)
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setNewNumber(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
      setNewNumber(true)
    }
  }

  return (
    <div className="app-window calculator-app">
      <div className="app-header">
        <span className="app-title">Calculator</span>
        <button className="app-close" onClick={() => closeApp('calculator')}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <div className="calculator-body">
        <div className="calculator-display">
          {operation && <div className="operation-indicator">{previousValue} {operation}</div>}
          <div className="display-value">{display}</div>
        </div>

        <div className="calculator-buttons">
          <button className="btn btn-light" onClick={handleClear}>AC</button>
          <button className="btn btn-light" onClick={handleBackspace}>+/-</button>
          <button className="btn btn-light" onClick={() => handleOperation('%')}>%</button>
          <button className="btn btn-orange" onClick={() => handleOperation('/')}>÷</button>

          <button className="btn btn-dark" onClick={() => handleNumber(7)}>7</button>
          <button className="btn btn-dark" onClick={() => handleNumber(8)}>8</button>
          <button className="btn btn-dark" onClick={() => handleNumber(9)}>9</button>
          <button className="btn btn-orange" onClick={() => handleOperation('*')}>×</button>

          <button className="btn btn-dark" onClick={() => handleNumber(4)}>4</button>
          <button className="btn btn-dark" onClick={() => handleNumber(5)}>5</button>
          <button className="btn btn-dark" onClick={() => handleNumber(6)}>6</button>
          <button className="btn btn-orange" onClick={() => handleOperation('-')}>−</button>

          <button className="btn btn-dark" onClick={() => handleNumber(1)}>1</button>
          <button className="btn btn-dark" onClick={() => handleNumber(2)}>2</button>
          <button className="btn btn-dark" onClick={() => handleNumber(3)}>3</button>
          <button className="btn btn-orange" onClick={() => handleOperation('+')}>+</button>

          <button className="btn btn-dark btn-zero" onClick={() => handleNumber(0)}>0</button>
          <button className="btn btn-dark" onClick={handleDecimal}>.</button>
          <button className="btn btn-orange" onClick={handleEquals}>=</button>
        </div>
      </div>
    </div>
  )
}

export default Calculator
