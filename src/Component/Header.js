import React from 'react'
import './Header.css';
const Header = () => {
  const calistir = (e) =>{
    e.preventDefault()
  }
  return (
    <div className='header'>
        <a href="/" onClick={(e) =>calistir(e)} className='logo'>Flight<span className='x'>X</span></a>
        <div className="right">
            <a href="/" onClick={(e) =>calistir(e)}>Home</a>
            <a href="/" onClick={(e) =>calistir(e)}>Contact Us</a>
        </div>
    </div>
  )
}

export default Header